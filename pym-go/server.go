package main

import (
	"crypto"
	"database/sql"
	"fmt"
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
	db *sql.DB
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
			language   TEXT NOT NULL,
			shortId    TEXT NOT NULL UNIQUE,
			value	   TEXT NOT NULL UNIQUE
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
	var value string
	var group string
	var language string

	row := self.db.QueryRow(`SELECT "group", language, value FROM pym WHERE shortId=$1`, shortId)
	err := row.Scan(&group, &language, &value)

	return value, group, language, err
}

func (self *handler) displayRouter(c *gin.Context) {
	shortId := c.Param("id")
	value, group, language, err := self.fetchPost(shortId)

	// Check for errors
	if err == sql.ErrNoRows {
		c.AbortWithStatus(http.StatusNotFound)
	} else if err != nil {
		log.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
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
	value, group, _, err := self.fetchPost(shortId)

	// Check for errors
	if err == sql.ErrNoRows {
		c.AbortWithStatus(http.StatusNotFound)
	} else if err != nil {
		log.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
	}

	switch group {
	case "image":
		c.File(filepath.Join(os.Getenv("UPLOAD_URL"), shortId))
	case "text":
		c.String(200, value)
	case "link":
		c.Redirect(200, value)
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

type Form struct {
	File *multipart.FileHeader `form:"files" binding:"required"`
}

// hashFile returns the SHA256 hash of the given content
func hashFile(content []byte) string {
	hashSum := crypto.SHA256.New()
	hashSum.Write(content)
	return fmt.Sprintf("%x", hashSum.Sum(nil))
}

func (self *handler) saveRouter(c *gin.Context) {
	var form Form
	err := c.ShouldBind(&form)

	if err != nil {
		log.Println(err)
		c.AbortWithStatus(http.StatusBadRequest)
	}
	
	if (form.File == nil) {
		fmt.Println("Not file!")
	} else {
		fmt.Println("File!")
	}

}

func (self *handler) handleFile(file) {
	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		return "", err
	}
	fileSaved, err := os.Create(filepath.Join(bp.UploadsDir, digest))
	if err != nil {
		return "", err
	}
	defer fileSaved.Close()
	if _, err := io.Copy(fileSaved, file); err != nil {
		return "", err
	}
}

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Panic(err)
	}

	host := os.Getenv("HOST")
	port := os.Getenv("PORT")

	obj := handler{}
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
