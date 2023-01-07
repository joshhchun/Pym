package main

import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/lib/pq"
)

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

    // Set the maximum number of idle connections and open connections
    db.SetMaxIdleConns(25)
    db.SetMaxOpenConns(100)

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
