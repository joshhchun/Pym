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
	// Get post's metadata
	_, group, _, err := self.fetchPost(shortId)

	// No post found with the given shortId
	if err != nil {
		if err == sql.ErrNoRows {
			c.String(200, "Sorry, no post with that ID! :P")
		} else {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
		}
		return
	}

	// Serve content depending on group
	switch group {
	case "image", "text":
		c.File(filepath.Join(self.uploadUrl, shortId))
	case "link":
		x, err := os.ReadFile(filepath.Join(self.uploadUrl, shortId))
		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
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
