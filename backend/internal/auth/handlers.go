// Package handlers contains HTTP handlers for user authentication,
// including user registration and login. These handlers interact
// with the models package to manage users in the database and use
// utility functions for password hashing and JWT generation.
package auth

import (
    "encoding/json"
    "log"
    "net/http"
    "golang.org/x/crypto/bcrypt"
    "github.com/stevenpstansberry/AquaMind-AI/internal/models"
    "github.com/stevenpstansberry/AquaMind-AI/internal/util"
)

// Credentials represents the structure for incoming authentication requests.
// It includes the user's email, password, and optionally, first name (for registration).
type Credentials struct {
    Email    string `json:"email"`     // The user's email address
    Password string `json:"password"`  // The user's password
    FirstName string `json:"first_name,omitempty"`  // Optional first name for registration
}

// RegisterUser handles user registration by accepting user details (email, password, first name),
// hashing the password, and storing the user in the database. It returns a JWT token upon success.
//
// Method: POST
// Endpoint: /register
//
// The function performs the following steps:
//   - Parse and validate the incoming request body (expects JSON).
//   - Check if the user already exists in the database.
//   - Hash the user's password using bcrypt.
//   - Store the user details in the database.
//   - Generate a JWT token for the registered user.
//   - Return the token as a JSON response or an error message in case of failure.
//
// Request body (JSON):
//   {
//     "email": "user@example.com",
//     "password": "userpassword",
//     "first_name": "User first Name"
//   }
//
// Response (JSON):
//   - On success: {"token": "generated-jwt-token"}
//   - On error: HTTP status code with an appropriate error message.
func RegisterUser(w http.ResponseWriter, r *http.Request) {
    var creds Credentials

    // Parse JSON request body
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        log.Printf("Error decoding request body: %v", err)
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Print out creds to see what it looks like
    log.Printf("Parsed credentials: %+v", creds)

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
    err = models.CreateUser(creds.Email, string(hashedPassword), creds.FirstName)
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
    log.Printf("User %s created successfully", creds)
    json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// LoginUser handles user authentication by verifying the user's email and password.
// If valid, it returns a JWT token for future authenticated requests.
//
// Method: POST
// Endpoint: /login
//
// The function performs the following steps:
//   - Parse and validate the incoming request body (expects JSON).
//   - Check if the user exists in the database.
//   - Compare the provided password with the stored hashed password.
//   - Generate a JWT token upon successful authentication.
//   - Return the token as a JSON response or an error message if authentication fails.
//
// Request body (JSON):
//   {
//     "email": "user@example.com",
//     "password": "userpassword"
//   }
//
// Response (JSON):
//   - On success: {"token": "generated-jwt-token"}
//   - On error: HTTP status code with an appropriate error message.
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
