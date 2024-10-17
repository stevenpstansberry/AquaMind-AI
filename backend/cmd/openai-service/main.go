package main

import (
    "log"
    "net/http"
    "github.com/joho/godotenv"
    "github.com/stevenpstansberry/AquaMind-AI/internal/openai"
)

// enableCORS is a middleware function that adds headers to allow cross-origin requests.
func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Api-Key")

        // Handle preflight OPTIONS request
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        // Continue to the next handler if it's not an OPTIONS request
        next.ServeHTTP(w, r)
    })
}

func main() {
    // Load environment variables from the .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Set up routes for OpenAI integration
    http.HandleFunc("/openai/query", openai.HandleQuery)

	// Apply the CORS middleware to all routes
	corsHandler := enableCORS(http.DefaultServeMux)

    // Start the OpenAI service
    log.Fatal(http.ListenAndServe(":8082", corsHandler))  // OpenAI service runs on port 8082
}
