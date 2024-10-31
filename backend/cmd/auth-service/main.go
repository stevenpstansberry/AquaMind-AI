package main

import (
    "database/sql"
    "fmt"
    "log"
    "net/http"
    "os"

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

    // Initialize the database in models package
    models.InitDB(db)

    // Initialize the router
    router := mux.NewRouter()

    // Set up routes for user registration and login using the auth package
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

    // Start the server on port 8080, using the CORS handler
    log.Fatal(http.ListenAndServe(":8080", corsHandler))
}
