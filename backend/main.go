package main

import (
    "database/sql"
    "fmt"
    "log"
    "os"

    _ "github.com/lib/pq"
    "github.com/joho/godotenv"
)

func main() {
    // Load .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Retrieve environment variables
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")
    sslMode := os.Getenv("DB_SSLMODE")

    // Construct connection string using environment variables
    connStr := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s", dbUser, dbPassword, dbName, sslMode)

    // Connect to PostgreSQL
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }

    err = db.Ping()
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Successfully connected to PostgreSQL!")
}
