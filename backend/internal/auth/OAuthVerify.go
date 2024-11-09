package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/stevenpstansberry/AquaMind-AI/internal/models"
	utils "github.com/stevenpstansberry/AquaMind-AI/internal/util"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/idtoken"
)

// VerifyGoogleIDToken verifies the Google ID token received from the client.
func VerifyGoogleIDToken(idToken string) (*idtoken.Payload, error) {
	// Create a context for the request
	ctx := context.Background()

	// Specify your Google Client ID (from your Google API console)
	clientID := os.Getenv("CLIENT_ID")

	// Verify the ID token
	payload, err := idtoken.Validate(ctx, idToken, clientID)
	if err != nil {
		return nil, fmt.Errorf("could not validate ID token: %v", err)
	}

	// The payload contains user information
	return payload, nil
}

// HandleGoogleLogin authenticates or registers a user via Google Sign-In.
func HandleGoogleOAuth(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Token string `json:"token"`
	}

	// Parse the ID token from the request body
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Verify the Google ID token
	payload, err := VerifyGoogleIDToken(req.Token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// Extract user details from the payload
	email := payload.Claims["email"].(string)
	firstName := payload.Claims["given_name"].(string)

	// Check if the user already exists in your database
	userExists := models.UserExists(email)
	if userExists {
		// User exists, generate a JWT token for login
		token, err := utils.GenerateJWT(email)
		if err != nil {
			log.Printf("Error generating JWT token: %v", err)
			http.Error(w, "Error generating token", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"token": token, "message": "User logged in successfully"})
		return
	}

	// If user does not exist, create one and register
	password, err := generateRandomString(32) // Generate a 32-character random password
	if err != nil {
		log.Printf("Error generating random password: %v", err)
		http.Error(w, "Error generating password", http.StatusInternalServerError)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		http.Error(w, "Error processing password", http.StatusInternalServerError)
		return
	}

	// Generate a random username
	username, err := generateRandomString(8) // Generate an 8-character random username
	if err != nil {
		log.Printf("Error generating random username: %v", err)
		http.Error(w, "Error generating username", http.StatusInternalServerError)
		return
	}

	subscribe := "false"
	createdAt := time.Now()
	createdAtStr := createdAt.Format(time.RFC3339)

	// Register the user in the database
	err = models.CreateUser(email, string(hashedPassword), firstName, username, subscribe, createdAtStr)
	if err != nil {
		log.Printf("Error creating user in database: %v", err)
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	// Generate JWT for the new user
	token, err := utils.GenerateJWT(email)
	if err != nil {
		log.Printf("Error generating JWT token: %v", err)
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Respond with the JWT token and success message
	log.Printf("User %s registered and logged in successfully", email)
	json.NewEncoder(w).Encode(map[string]string{"token": token, "message": "User registered and logged in successfully"})
}

// generateRandomString creates a cryptographically secure random string of the specified length.
func generateRandomString(length int) (string, error) {
	bytes := make([]byte, length/2) // Each byte gives 2 hex characters
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
