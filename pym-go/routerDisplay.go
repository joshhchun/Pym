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
    // Fetch the metadata of the post
    _, group, language, err := self.fetchPost(shortId)

    // No post found with the given shortId
    if err != nil {
        if err == sql.ErrNoRows {
            c.JSON(http.StatusOK, gin.H{"value": "Sorry, no post with that ID! :P", "group": "text", "language": "plaintext"})
        } else {
            log.Println(err)
            c.AbortWithStatus(http.StatusInternalServerError)
        }
        return
    }

    // If it is an image, no need to read the file
    value := make([]byte, 0)
    if group != "image" {
        value, err = os.ReadFile(filepath.Join(self.uploadUrl, shortId))
        if err != nil {
            log.Println(err)
            c.AbortWithStatus(http.StatusInternalServerError)
            return
        }
    }

    c.JSON(200, gin.H{"value": string(value), "group": group, "language": language})

    // Update the expired field of the post
    err = self.updateExpire(shortId)
    if err != nil {
        log.Println(err)
    }

}
