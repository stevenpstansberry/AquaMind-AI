package handlers

import (
    "encoding/json"
    "log"
    "net/http"
    "golang.org/x/crypto/bcrypt"
    "github.com/stevenpstansberry/AquaMind-AI/models"
    "github.com/stevenpstansberry/AquaMind-AI/util"
)

type Credentials struct {
    Email    string `json:"email"`
    Password string `json:"password"`
    FullName string `json:"full_name,omitempty"` // Optional for login
}

// RegisterUser handles user registration
func RegisterUser(w http.ResponseWriter, r *http.Request) {
    var creds Credentials

    // Parse JSON request body
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        log.Printf("Error decoding request body: %v", err)
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Check if user already exists
    if models.UserExists(creds.Email) {
        log.Printf("User with email %s already exists", creds.Email)
        http.Error(w, "User already exists", http.StatusBadRequest)
        return
    }

    // Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
    if err != nil {
        log.Printf("Error hashing password: %v", err)
        http.Error(w, "Error processing password", http.StatusInternalServerError)
        return
    }

    // Create user in the database
    err = models.CreateUser(creds.Email, string(hashedPassword), creds.FullName)
    if err != nil {
        log.Printf("Error creating user in database: %v", err)
        http.Error(w, "Error creating user", http.StatusInternalServerError)
        return
    }

    // Generate JWT
    token, err := utils.GenerateJWT(creds.Email)
    if err != nil {
        log.Printf("Error generating JWT token: %v", err)
        http.Error(w, "Error generating token", http.StatusInternalServerError)
        return
    }

    // Respond with the JWT token
    log.Printf("User %s created successfully", creds.Email)
    json.NewEncoder(w).Encode(map[string]string{"token": token})
}


// LoginUser handles user login and returns a JWT token
func LoginUser(w http.ResponseWriter, r *http.Request) {
    var creds Credentials

    // Log that the login attempt has started
    log.Println("Login attempt started")

    // Parse JSON request body
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        log.Printf("Error decoding request body: %v\n", err)
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    log.Printf("Attempting to authenticate user with email: %s\n", creds.Email)

    // Get user from the database
    user, err := models.GetUserByEmail(creds.Email)
    if err != nil {
        log.Printf("User not found or invalid credentials for email: %s\n", creds.Email)
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // Compare the hashed password
    err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password))
    if err != nil {
        log.Printf("Invalid password for user: %s\n", creds.Email)
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    log.Printf("User authenticated successfully: %s\n", creds.Email)

    // Generate JWT token
    token, err := utils.GenerateJWT(user.Email)
    if err != nil {
        log.Printf("Error generating JWT token for user: %s, error: %v\n", creds.Email, err)
        http.Error(w, "Error generating token", http.StatusInternalServerError)
        return
    }

    // Log successful login and token generation
    log.Printf("JWT token generated successfully for user: %s\n", creds.Email)

    // Return the JWT token
    json.NewEncoder(w).Encode(map[string]string{"token": token})
    log.Println("Login attempt successful, token sent to user")
}