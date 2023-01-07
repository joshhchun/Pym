package main

import (
    "fmt"
    "log"
    "os"

    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    // Load environment variables
    err := godotenv.Load()
    if err != nil {
        log.Panic(err)
    }

    host := os.Getenv("HOST")
    port := os.Getenv("PORT")

    // Max file size is 20MB
    obj := handler{maxFileSize: (2 << 20) * 20, maxTries: 8, uploadUrl: os.Getenv("UPLOAD_URL")}
    err = obj.initDb()
    if err != nil {
        log.Panic(err)
    }

    defer obj.db.Close()

    // Init gin server
    r := gin.Default()

    // Request handlers
    r.GET("/api/display/:id", obj.displayRouter)
    r.GET("/api/:id", obj.rawRouter)
    r.POST("/api/save", obj.saveRouter)
    r.Run(fmt.Sprintf("%s:%s", host, port))
}
