package handlers

import (
    "encoding/json"
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
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Check if user already exists
    if models.UserExists(creds.Email) {
        http.Error(w, "User already exists", http.StatusBadRequest)
        return
    }

    // Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, "Error processing password", http.StatusInternalServerError)
        return
    }

    // Create user in the database
    err = models.CreateUser(creds.Email, string(hashedPassword), creds.FullName)
    if err != nil {
        http.Error(w, "Error creating user", http.StatusInternalServerError)
        return
    }

    // Generate JWT
    token, err := utils.GenerateJWT(creds.Email)
    if err != nil {
        http.Error(w, "Error generating token", http.StatusInternalServerError)
        return
    }

    // Respond with the JWT token
    json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// LoginUser handles user login and returns a JWT token
func LoginUser(w http.ResponseWriter, r *http.Request) {
    var creds Credentials

    // Parse JSON request body
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Get user from database
    user, err := models.GetUserByEmail(creds.Email)
    if err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // Compare the hashed password
    err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password))
    if err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // Generate JWT token
    token, err := utils.GenerateJWT(user.Email)
    if err != nil {
        http.Error(w, "Error generating token", http.StatusInternalServerError)
        return
    }

    // Return the JWT token
    json.NewEncoder(w).Encode(map[string]string{"token": token})
}