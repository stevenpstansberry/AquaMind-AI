package main

import (
    "database/sql"
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/joho/godotenv"
    "github.com/stevenpstansberry/AquaMind-AI/handlers"
    "github.com/stevenpstansberry/AquaMind-AI/models"
    _ "github.com/lib/pq"
)

// CORS middleware to handle cross-origin requests
func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Api-Key") 
        // Handle preflight OPTIONS request
        if r.Method == http.MethodOptions {
            // Just return OK if it's an OPTIONS request
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r) // Continue to the next handler if it's not an OPTIONS request
    })
}

func main() {
    // Load environment variables from the .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Build the connection string using environment variables
    connStr := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
        os.Getenv("DB_HOST"),
        os.Getenv("DB_PORT"),
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_NAME"),
        os.Getenv("DB_SSLMODE"),
    )

    // Open a connection to the PostgreSQL database
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal("Unable to connect to the database: ", err)
    }
    defer db.Close()

    // Check if the connection is successful
    err = db.Ping()
    if err != nil {
        log.Fatal("Cannot ping the database: ", err)
    }

    fmt.Println("Successfully connected to PostgreSQL!")

    // Initialize the database in models
    models.InitDB(db)

    // Set up routes
    http.HandleFunc("/register", handlers.RegisterUser)
    http.HandleFunc("/login", handlers.LoginUser)

    // Apply the CORS middleware to all routes
    corsHandler := enableCORS(http.DefaultServeMux)

    // Start the server with the CORS handler
    log.Fatal(http.ListenAndServe(":8080", corsHandler))
}
