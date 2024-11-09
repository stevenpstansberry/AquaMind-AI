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
	ctx := context.Background()
	clientID := os.Getenv("CLIENT_ID")

	log.Println("Verifying Google ID token...")
	payload, err := idtoken.Validate(ctx, idToken, clientID)
	if err != nil {
		log.Printf("Token validation failed: %v", err)
		return nil, fmt.Errorf("could not validate ID token: %v", err)
	}

	log.Println("Google ID token verified successfully.")
	return payload, nil
}

// HandleGoogleOAuth authenticates or registers a user via Google Sign-In.
// HandleGoogleOAuth authenticates or registers a user via Google Sign-In.
func HandleGoogleOAuth(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Token string `json:"token"`
	}

	// Parse the ID token from the request body
	log.Println("Parsing ID token from request...")
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println("Failed to parse request body:", err)
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
	log.Printf("Extracted user details - Email: %s, First Name: %s", email, firstName)

	// Check if the user already exists in your database
	log.Printf("Checking if user %s already exists...", email)
	userExists := models.UserExists(email)
	if userExists {
		log.Printf("User %s already has an account. Logging in...", email)
		token, err := utils.GenerateJWT(email)
		if err != nil {
			log.Printf("Error generating JWT token for existing user %s: %v", email, err)
			http.Error(w, "Error generating token", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"token": token, "email": email, "message": "User logged in successfully"})
		return
	}

	log.Printf("User %s does not exist. Registering new user...", email)

	// If user does not exist, create one and register
	password, err := generateRandomString(32)
	if err != nil {
		log.Printf("Error generating random password for %s: %v", email, err)
		http.Error(w, "Error generating password", http.StatusInternalServerError)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password for %s: %v", email, err)
		http.Error(w, "Error processing password", http.StatusInternalServerError)
		return
	}

	// Generate a random username
	username, err := generateRandomString(8)
	if err != nil {
		log.Printf("Error generating random username for %s: %v", email, err)
		http.Error(w, "Error generating username", http.StatusInternalServerError)
		return
	}

	subscribe := "false"
	createdAt := time.Now().Format(time.RFC3339)
	log.Printf("Registering user %s with username %s", email, username)

	// Register the user in the database
	err = models.CreateUser(email, string(hashedPassword), firstName, username, subscribe, createdAt)
	if err != nil {
		log.Printf("Error creating user %s in database: %v", email, err)
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	// Generate JWT for the new user
	token, err := utils.GenerateJWT(email)
	if err != nil {
		log.Printf("Error generating JWT token for new user %s: %v", email, err)
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	log.Printf("User %s registered and logged in successfully", email)
	json.NewEncoder(w).Encode(map[string]string{"token": token, "email": email, "message": "User registered and logged in successfully"})
}

// generateRandomString creates a cryptographically secure random string of the specified length.
func generateRandomString(length int) (string, error) {
	log.Printf("Generating random string of length %d...", length)
	bytes := make([]byte, length/2)
	if _, err := rand.Read(bytes); err != nil {
		log.Printf("Error generating random string: %v", err)
		return "", err
	}
	randomString := hex.EncodeToString(bytes)
	log.Printf("Generated random string: %s", randomString)
	return randomString, nil
}
