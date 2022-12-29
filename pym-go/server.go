package main

import (
	"crypto/rand"
	"crypto/sha1"
	"database/sql"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type handler struct {
	db          *sql.DB
	maxFileSize int64
	maxTries    int64
}

func (self *handler) initDb() error {
	// Init host and port
	user := os.Getenv("DB_USER")
	dbName := os.Getenv("DB_NAME")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	password := os.Getenv("POSTGRES_PASSWORD")

	dbInfo := fmt.Sprintf("user=%s host=%s port=%s password=%s dbname=%s sslmode=disable", user, host, port, password, dbName)
	db, err := sql.Open("postgres", dbInfo)
	if err != nil {
		return err
	}

	self.db = db
	_, err = self.db.Exec(
		`CREATE TABLE IF NOT EXISTS pym (
			id	   SERIAL PRIMARY KEY,
			expire	   TIMESTAMP NOT NULL,
			"group"	   TEXT NOT NULL,
			language   TEXT,
			shortId    TEXT NOT NULL UNIQUE,
			hash	   TEXT NOT NULL UNIQUE
		)`)
	if err != nil {
		return err
	}
	return nil
}

func (self *handler) updateExpire(shortId string) error {
	newExpire := time.Now().AddDate(0, 0, 15).Format(time.RFC3339)
	_, err := self.db.Exec(`UPDATE pym SET expire=$1 WHERE shortId=$2`, newExpire, shortId)
	return err
}

func (self *handler) fetchPost(shortId string) (string, string, string, error) {
	var hash string
	var group string
	var language string

	row := self.db.QueryRow(`SELECT "group", language, hash FROM pym WHERE shortId=$1`, shortId)
	err := row.Scan(&group, &language, &hash)

	return hash, group, language, err
}

func (self *handler) displayRouter(c *gin.Context) {
	shortId := c.Param("id")
	_, group, language, err := self.fetchPost(shortId)

	// Check for errors
	if err == sql.ErrNoRows {
		c.AbortWithStatus(http.StatusNotFound)
	} else if err != nil {
		log.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
	}

	value, err := os.ReadFile(filepath.Join(os.Getenv("UPLOAD_URL"), shortId))
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err})
		return
	}

	c.JSON(200, gin.H{"value": value, "group": group, "language": language})

	// Update the expired field of the post
	err = self.updateExpire(shortId)
	if err != nil {
		log.Println(err)
	}

}

func (self *handler) rawRouter(c *gin.Context) {
	shortId := c.Param("id")
	hash, group, _, err := self.fetchPost(shortId)

	// Check for errors
	if err != nil {
		if err == sql.ErrNoRows {
			c.AbortWithStatus(http.StatusNotFound)
		} else {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
		}
		return
	}

	/** TODO: maybe change all of these into c.File? **/
	switch group {
	case "image":
		c.File(filepath.Join(os.Getenv("UPLOAD_URL"), shortId))
	case "text":
		c.String(200, hash)
	case "link":
		c.Redirect(200, hash)
	default:
		log.Printf("Unexpected group: %s\n", group)
		c.AbortWithStatus(http.StatusMethodNotAllowed)
		return
	}

	// Update the expired field of the post
	err = self.updateExpire(shortId)
	if err != nil {
		log.Println(err)
	}

}


// hashFile returns the SHA1 hash of the given content
func hashFile(file multipart.File) (string, error) {
	hashSum := sha1.New()
	if _, err := io.Copy(hashSum, file); err != nil {
		log.Fatal(err)
		return "", err
	}
	return fmt.Sprintf("%x", hashSum.Sum(nil)), nil
}

func hashText(buffer string) string {
	return fmt.Sprintf("%x", sha1.Sum([]byte(buffer)))
}

func (self *handler) generateShortID() (string, error) {
	var count int
	var shortId string
	b := make([]byte, 2)
	for i := int64(0); i <= self.maxTries; i += 1 {
		_, err := rand.Read(b)
		if err != nil {
			log.Println(err)
			continue
		}

		shortId = hex.EncodeToString(b)[:4]
		row := self.db.QueryRow(`SELECT COUNT(shortId) FROM pym WHERE shortId=$1`, shortId)
		err = row.Scan(&count)
		if err != nil {
			log.Println(err)
		}
		if count == 0 {
			break
		}
	}

	// If we are out of the loop and the count is not 0, then we could not make new entry
	if count != 0 {
		return "", fmt.Errorf("Could not make new entry in database.")
	}

	return shortId, nil
}

type Body struct {
	group    string `json:"group"`
	language string `json:"language"`
	value    string `json:"hash"`
}

type Form struct {
	File *multipart.FileHeader `form:"files"`
}

func (self *handler) saveRouter(c *gin.Context) {
	var form Form
	file, _, err := c.Request.FormFile("files")
	if err != nil {
		log.Println("yur done buddy")
		log.Println(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	log.Println("ok gets here?")

	// User is trying to post a paste || url
	if file == nil {
		var requestBody Body
		if err := c.BindJSON(&requestBody); err != nil {
			log.Println("in hereee")
			log.Println(err)
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		shortId, err := self.handleText(requestBody)
		if err != nil {
			log.Println("abort abort abort")
			log.Println(err)
			c.AbortWithStatus(http.StatusBadRequest)
		}
		c.JSON(200, gin.H{"shortId": shortId})
	} else {
		if form.File.Size > self.maxFileSize {
			log.Printf("Requested upload file size: %d", form.File.Size)
			c.AbortWithStatus(http.StatusRequestEntityTooLarge)
			return
		}
		shortId, err := self.handleFile(form.File)
		if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		c.JSON(200, gin.H{"shortId": shortId})
	}

}

func (self *handler) checkHash(hash string) (string, error) {
	var shortId string
	row := self.db.QueryRow(`SELECT shortId FROM pym WHERE hash=$1`, hash)
	err := row.Scan(&shortId)

	switch err {
	case nil:
		return shortId, nil
	case sql.ErrNoRows:
		return "", nil
	default:
		return "", err
	}
}

func (self *handler) handleText(body Body) (string, error) {
	// Check if post already exists
	hash := hashText(body.value)
	shortId, err := self.checkHash(hash)
	if err != nil {
		log.Println(err)
	}
	if shortId != "" {
		return shortId, nil
	}

	shortId, err = self.generateShortID()
	if err != nil {
		return "", err
	}

	fileCreated, err := os.Create(filepath.Join(os.Getenv("UPLOAD_URL"), shortId))
	if err != nil {
		return "", err
	}
	defer fileCreated.Close()

	// Write the body contents to the new file
	_, err = fileCreated.WriteString(body.value)
	if err != nil {
		return "", err
	}

	// Save post in the database
	_, err = self.db.Exec(`INSERT INTO pym (expire, "group", language, shortId, hash) VALUES ($1, $2, $3, $4, $5)`,
		time.Now().Add(time.Hour), body.group, body.language, shortId, hash)
	if err != nil {
		return "", err
	}

	return shortId, nil
}

func (self *handler) handleFile(file *multipart.FileHeader) (string, error) {
	// Open the file
	openedFile, err := file.Open()
	if err != nil {
		return "", err
	}
	defer openedFile.Close()

	// Get the hash of the file
	hash, err := hashFile(openedFile)
	shortId, err := self.checkHash(hash)
	if err != nil {
		log.Println(err)
	}
	if shortId != "" {
		return shortId, nil
	}

	// Seek the file
	_, err = openedFile.Seek(0, io.SeekStart)
	if err != nil {
		return "", err
	}

	shortId, err = self.generateShortID()
	if err != nil {
		return "", err
	}

	// Create the new file
	fileCreated, err := os.Create(filepath.Join(os.Getenv("UPLOAD_URL"), shortId))
	if err != nil {
		return "", err
	}
	defer fileCreated.Close()

	// Copy the file to the new file
	_, err = io.Copy(fileCreated, openedFile)
	if err != nil {
		return "", err
	}

	// Save post in the database
	_, err = self.db.Exec(`INSERT INTO pym (expire, "group", language, shortId, hash) VALUES ($1, $2, $3, $4, $5)`,
		time.Now().Add(time.Hour), "image", "", shortId, hash)
	if err != nil {
		return "", err
	}

	return shortId, nil
}

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Panic(err)
	}

	host := os.Getenv("HOST")
	port := os.Getenv("PORT")

	obj := handler{maxFileSize: (2 << 20) * 8, maxTries: 8}
	err = obj.initDb()
	if err != nil {
		log.Panic(err)
	}
	// Init gin server
	r := gin.Default()

	// Request handlers
	r.GET("/api/display/:id", obj.displayRouter)
	r.GET("/api/:id", obj.rawRouter)
	r.POST("/api/save", obj.saveRouter)
	r.Run(fmt.Sprintf("%s:%s", host, port))
}
