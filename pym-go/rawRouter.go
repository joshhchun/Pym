package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func (self *handler) rawRouter(c *gin.Context) {
	shortId := c.Param("id")
	_, group, _, err := self.fetchPost(shortId)

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
		c.File(filepath.Join(os.Getenv("UPLOAD_URL"), shortId))
	case "link":
		x, _ := os.ReadFile(filepath.Join(os.Getenv("UPLOAD_URL"), shortId))
		c.Redirect(302, string(x))
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
