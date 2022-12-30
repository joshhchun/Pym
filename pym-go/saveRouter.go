package main

import (
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func (self *handler) saveRouter(c *gin.Context) {
	if c.GetHeader("Content-Type") == "application/json" {
		requestBody := Body{}
		if err := c.BindJSON(&requestBody); err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}
		shortId, err := self.handleText(requestBody)
		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusBadRequest)
		}
		c.JSON(200, gin.H{"shortId": shortId})
	} else {
		form := Form{}
		// Bind the request to the Form
		if err := c.ShouldBind(&form); err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusBadRequest)
		}
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

func (self *handler) handleText(body Body) (string, error) {
	// Check if post already exists
	hash := hashText(body.Value)
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
	_, err = fileCreated.WriteString(body.Value)
	if err != nil {
		return "", err
	}

	// Save post in the database
	_, err = self.db.Exec(`INSERT INTO pym (expire, "group", language, shortId, hash) VALUES ($1, $2, $3, $4, $5)`,
		time.Now().Add(time.Hour), body.Group, body.Language, shortId, hash)
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
