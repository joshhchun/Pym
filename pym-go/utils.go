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
	"strings"
	"time"
)

type handler struct {
    db          *sql.DB
    maxFileSize int64
    maxTries    int64
    uploadUrl   string
}

type Body struct {
    Group    string
    Language string
    Value    string
}

type Form struct {
    File *multipart.FileHeader `form:"files"`
}

var textMimeTypes = map[string]string{
    "text/javascript":           "javascript",
    "application/json":          "json",
    "application/vnd.ms-excel":  "excel",
    "application/x-latex":       "latex",
    "application/x-python-code": "python",
    "application/x-sh":          "shell",
    "text/css":                  "css",
    "text/html":                 "html",
    "text/plain":                "plaintext",
    "text/x-python":             "python",
    "text/x-c":                  "c",
}

// If link does not have https, add it
func handleLink(body *Body) {
    if !strings.HasPrefix(body.Value, "https://") {
        body.Value = fmt.Sprintf("%s%s", "https://", body.Value)
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
func hashText(buffer string) string {
    return fmt.Sprintf("%x", sha1.Sum([]byte(buffer)))
}

func (self *handler) generateShortID() (string, error) {
    var count int
    var shortId string
    b := make([]byte, 2)

    // Try to generate a unique shortId a `max.tries` amount of times
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
        // Generated a unique shortId, can exit
        if count == 0 {
            break
        }
    }

    // If we are out of the loop and the count is not 0, then we could not make new entry
    if count != 0 {
        return "", fmt.Errorf("could not make new entry in database")
    }
    return shortId, nil
}

func (self *handler) checkHash(hash string) (string, error) {
    var shortId string
    row := self.db.QueryRow(`SELECT shortId FROM pym WHERE hash=$1`, hash)
    err := row.Scan(&shortId)

    switch err {
    // No errors, a post with the hash was found
    case nil:
        return shortId, nil
    // No post with the hash exists
    case sql.ErrNoRows:
        return "", nil
    // Some other error happened
    default:
        return "", err
    }
}
