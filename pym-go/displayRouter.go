package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

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

	c.JSON(200, gin.H{"value": string(value), "group": group, "language": language})

	// Update the expired field of the post
	err = self.updateExpire(shortId)
	if err != nil {
		log.Println(err)
	}

}
