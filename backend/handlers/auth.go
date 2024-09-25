package handlers

import (
    "encoding/json"
    "net/http"
    "time"
    "golang.org/x/crypto/bcrypt"
    "github.com/dgrijalva/jwt-go"
    "backend/models"
    "backend/utils"
)

// Secret key used to sign JWT tokens
var jwtKey = []byte("your_secret_key")  

// Struct to parse JSON request body for registration and login
type Credentials struct {
    Email    string `json:"email"`
    Password string `json:"password"`
    FullName string `json:"full_name,omitempty"` 
}

// JWT Claims structure
type Claims struct {
    Email string `json:"email"`
    jwt.StandardClaims
}

// RegisterUser handles user registration
func RegisterUser(w http.ResponseWriter, r *http.Request) {
    var creds Credentials

    // Parse the incoming JSON request body
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Check if the user already exists
    if models.UserExists(creds.Email) {
        http.Error(w, "User already exists", http.StatusBadRequest)
        return
    }

    // Hash the password using bcrypt
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, "Error processing password", http.StatusInternalServerError)
        return
    }

    // Save the user in the database
    err = models.CreateUser(creds.Email, string(hashedPassword), creds.FullName)
    if err != nil {
        http.Error(w, "Error creating user", http.StatusInternalServerError)
        return
    }

    // Generate a JWT token
    token, err := utils.GenerateJWT(creds.Email, jwtKey)
    if err != nil {
        http.Error(w, "Error generating token", http.StatusInternalServerError)
        return
    }

    // Return the token to the client
    json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// LoginUser handles user login and returns a JWT token on success
func LoginUser(w http.ResponseWriter, r *http.Request) {
    var creds Credentials
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Authenticate user (you'll implement this in models)
    user, err := models.AuthenticateUser(creds.Email, creds.Password)
    if err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // Generate a new JWT token
    tokenString, err := utils.GenerateJWT(user.Email)
    if err != nil {
        http.Error(w, "Error generating token", http.StatusInternalServerError)
        return
    }

    // Return the token in the response
    json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}
