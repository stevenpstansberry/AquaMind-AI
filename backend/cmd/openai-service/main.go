package main

import (
    "log"
    "net/http"
    "github.com/joho/godotenv"
    "github.com/stevenpstansberry/AquaMind-AI/internal/openai"
)

func main() {
    // Load environment variables from the .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Set up routes for OpenAI integration
    http.HandleFunc("/openai/query", openai.HandleQuery)

    // Start the OpenAI service
    log.Fatal(http.ListenAndServe(":8082", nil))  // OpenAI service runs on port 8082
}
