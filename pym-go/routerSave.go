package main

import (
    "io"
    "log"
    "mime/multipart"
    "net/http"
    "os"
    "path/filepath"
    "strings"
    "time"

    "github.com/gin-gonic/gin"
)

// Handler for saving a post
func (self *handler) saveRouter(c *gin.Context) {
    log.Println("IN SAVE ROUTER");
    header := c.GetHeader("Content-Type")
    switch {
    // User is trying to save text or url
    case header == "application/json":
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
    // User is trying to save a file
    case strings.HasPrefix(header, "multipart/form-data"):
        form := Form{}
        // Bind the request to the Form
        if err := c.ShouldBind(&form); err != nil {
            log.Println(err)
            c.AbortWithStatus(http.StatusBadRequest)
        }
    
        log.Println(form);

        if form.File.Size > self.maxFileSize {
            log.Printf("Requested upload file size too large: %d", form.File.Size)
            c.AbortWithStatus(http.StatusRequestEntityTooLarge)
            return
        }
        shortId, err := self.handleFile(form.File)
        if err != nil {
            log.Println(err)
            c.AbortWithStatus(http.StatusInternalServerError)
            return
        }
        c.JSON(200, gin.H{"shortId": shortId})
    default:
        log.Printf("Non expected content-type: %s", header)
        c.AbortWithStatus(http.StatusBadRequest)
    }
}

func (self *handler) handleText(body Body) (string, error) {
    // Handle link if it doesnt have HTTPS
    if body.Group == "link" {
        handleLink(&body)
    }
    // Retrieve the SHA1 Hash of the text
    hash := hashText(body.Value)
    // Check if the hash already exists in the database
    shortId, err := self.checkHash(hash)
    if err != nil {
        log.Println(err)
    }
    // Post with the hash already exists, return existing shortId
    if shortId != "" {
        return shortId, nil
    }

    shortId, err = self.generateShortID()
    if err != nil {
        return "", err
    }

    fileCreated, err := os.Create(filepath.Join(self.uploadUrl, shortId))
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
        time.Now().AddDate(0, 0, 15), body.Group, body.Language, shortId, hash)
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
    if (err) != nil {
        return "", err
    }

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
    fileCreated, err := os.Create(filepath.Join(self.uploadUrl, shortId))
    if err != nil {
        return "", err
    }
    defer fileCreated.Close()

    // Copy the file to the new file
    _, err = io.Copy(fileCreated, openedFile)
    if err != nil {
        return "", err
    }

    fileType := "image"
    language := ""
    // If the file is a text/code file then do not save it as image
    if val, exists := textMimeTypes[file.Header.Get("Content-Type")]; exists {
        fileType = "text"
        language = val
    }

    // Save post in the database
    _, err = self.db.Exec(`INSERT INTO pym (expire, "group", language, shortId, hash) VALUES ($1, $2, $3, $4, $5)`,
        time.Now().AddDate(0, 0, 15), fileType, language, shortId, hash)
    if err != nil {
        return "", err
    }

    return shortId, nil
}
