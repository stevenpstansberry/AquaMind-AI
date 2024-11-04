package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // PostgreSQL driver

	"github.com/stevenpstansberry/AquaMind-AI/internal/auth"
	"github.com/stevenpstansberry/AquaMind-AI/internal/models"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Api-Key, X-Detail-Type")

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
	log.Println("Starting application...")

	// Load environment variables from the .env file
	log.Println("Loading environment variables...")
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}
	log.Println("Environment variables loaded successfully.")

	// Print out each relevant environment variable for confirmation
	log.Printf("DB_HOST: %s", os.Getenv("DB_HOST"))
	log.Printf("DB_PORT: %s", os.Getenv("DB_PORT"))
	log.Printf("DB_USER: %s", os.Getenv("DB_USER"))
	log.Printf("DB_NAME: %s", os.Getenv("DB_NAME"))
	log.Printf("DB_SSLMODE: %s", os.Getenv("DB_SSLMODE"))

	// Build the connection string using environment variables
	log.Println("Building connection string...")
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
	)
	log.Println("Connection string built successfully.")

	// Open a connection to the PostgreSQL database
	log.Println("Opening connection to PostgreSQL database...")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Unable to connect to the database: %v", err)
	}
	defer func() {
		log.Println("Closing database connection...")
		db.Close()
	}()
	log.Println("Connection to database opened successfully.")

	// Check if the connection is successful
	log.Println("Pinging the database to verify connection...")
	startPing := time.Now()
	err = db.Ping()
	if err != nil {
		log.Fatalf("Cannot ping the database: %v", err)
	}
	log.Printf("Ping successful. Duration: %v", time.Since(startPing))

	log.Println("Successfully connected to PostgreSQL!")

	// Initialize the database in the models package
	log.Println("Initializing database with models package...")
	models.InitDB(db)
	log.Println("Database initialization complete.")

	// Initialize the router
	log.Println("Initializing router...")
	router := mux.NewRouter()

	// Set up routes for user registration and login using the auth package
	log.Println("Setting up routes...")
	router.HandleFunc("/register", auth.RegisterUser).Methods("POST")
	router.HandleFunc("/login", auth.LoginUser).Methods("POST")

	// Aquarium routes with JWT authentication middleware
	router.Handle("/aquariums", auth.JWTAuthMiddleware(http.HandlerFunc(auth.CreateAquariumHandler))).Methods("POST")
	router.Handle("/user/aquariums", auth.JWTAuthMiddleware(http.HandlerFunc(auth.GetUserAquariumsHandler))).Methods("GET")
	router.Handle("/aquariums/{id}", auth.JWTAuthMiddleware(http.HandlerFunc(auth.GetAquariumHandler))).Methods("GET")
	router.Handle("/aquariums/{id}", auth.JWTAuthMiddleware(http.HandlerFunc(auth.UpdateAquariumHandler))).Methods("PUT")
	router.Handle("/aquariums/{id}", auth.JWTAuthMiddleware(http.HandlerFunc(auth.DeleteAquariumHandler))).Methods("DELETE")

	// Detail routes with JWT authentication middleware
	router.Handle("/details/{id}", auth.JWTAuthMiddleware(http.HandlerFunc(auth.GetDetailHandler))).Methods("GET")
	router.Handle("/details/all/{type}", auth.JWTAuthMiddleware(http.HandlerFunc(auth.GetAllDetailsHandler))).Methods("GET")

	// Parameter entry routes with JWT authentication middleware
	router.Handle("/aquariums/{aquariumId}/parameter-entries", auth.JWTAuthMiddleware(http.HandlerFunc(auth.CreateParameterEntryHandler))).Methods("POST")
	router.Handle("/aquariums/{aquariumId}/parameter-entries", auth.JWTAuthMiddleware(http.HandlerFunc(auth.GetParameterEntriesHandler))).Methods("GET")

	// Apply the CORS middleware to all routes
	corsHandler := enableCORS(router)

	log.Println("Starting the server on port 80...")
	err = http.ListenAndServe(":80", corsHandler)
	if err != nil {
		log.Fatalf("Server encountered an error: %v", err)
	}
}
