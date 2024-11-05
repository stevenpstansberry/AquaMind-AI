package main

import (
	"log"
	"net/http"
	"time"

	"github.com/joho/godotenv"
	"github.com/stevenpstansberry/AquaMind-AI/internal/auth"
	"github.com/stevenpstansberry/AquaMind-AI/internal/openai"
)

// enableCORS is a middleware function that adds headers to allow cross-origin requests and logs the request details.
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		log.Printf("Received %s request for %s from %s", r.Method, r.URL.Path, r.RemoteAddr)

		// Add CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Api-Key")

		// Handle preflight OPTIONS request
		if r.Method == http.MethodOptions {
			log.Println("Handled preflight OPTIONS request")
			w.WriteHeader(http.StatusOK)
			return
		}

		// Continue to the next handler if it's not an OPTIONS request
		next.ServeHTTP(w, r)

		duration := time.Since(startTime)
		log.Printf("Request for %s completed in %v", r.URL.Path, duration)
	})
}

func main() {
	// Load environment variables from the .env file and log the outcome
	log.Println("Loading .env file...")
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file: ", err)
	}
	log.Println(".env file loaded successfully")

	// Log server startup
	log.Println("Starting OpenAI service...")

	// Set up routes for OpenAI integration and apply JWTAuthMiddleware
	http.HandleFunc("/openai/query", auth.JWTAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Handling OpenAI query request: %s %s", r.Method, r.URL.Path)
		openai.HandleQuery(w, r)
		log.Println("OpenAI query request handled successfully")
	}))

	// Apply the CORS middleware to all routes
	corsHandler := enableCORS(http.DefaultServeMux)

	// Start the OpenAI service and log any errors that occur
	log.Println("OpenAI service running on port 443")
	if err := http.ListenAndServe(":443", corsHandler); err != nil {
		log.Fatalf("Server encountered an error: %v", err)
	}
}
