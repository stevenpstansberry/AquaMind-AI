// Package utils provides utility functions for generating and validating JWT tokens.
// These functions are used for securing routes by generating tokens upon user login
// and validating them for protected routes.
package utils

import (
    "time"
    "github.com/dgrijalva/jwt-go"
    "errors"
    "strings"
    "log"
    "os"

    "github.com/joho/godotenv"
)

// Claims represents the structure for JWT claims. It embeds the StandardClaims
// from the JWT package and includes an Email field to store the user's email address.
type Claims struct {
    Email string `json:"email"`           // The user's email address
    jwt.StandardClaims                   // Embedded standard claims (e.g., expiration time)
}

// jwtKey is a global variable that stores the secret key for signing JWTs.
var jwtKey []byte

// init function is executed when the package is initialized.
// It loads the environment variables and retrieves the JWT secret key once.
func init() {
    // Load environment variables from .env file (optional in case it's used locally)
    err := godotenv.Load()
    if err != nil {
        log.Println("No .env file found, using system environment variables")
    }

    // Get the JWT secret key from environment variables
    jwtSecret := os.Getenv("JWT_SECRET")
    if jwtSecret == "" {
        log.Fatal("JWT_SECRET is not set in the environment")
    }

    // Set the secret key for JWT as a global variable
    jwtKey = []byte(jwtSecret)
}

// GenerateJWT creates and signs a new JWT token for the given email.
// The token is valid for 24 hours.
//
// Params:
//   - email: the email address to embed in the token claims.
//
// Returns:
//   - string: the signed JWT token.
//   - error: an error if the token generation fails.
func GenerateJWT(email string) (string, error) {
    // Set expiration time (e.g., 24 hours)
    expirationTime := time.Now().Add(24 * time.Hour)

    // Create the JWT claims, including the user's email and expiration time
    claims := &Claims{
        Email: email,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    // Create the token with claims
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    // Sign the token with the secret key (jwtKey)
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        return "", err
    }

    // Return the signed JWT token
    return tokenString, nil
}

// ValidateJWT parses and validates a JWT token. If the token is valid,
// it returns the claims contained in the token.
//
// Params:
//   - tokenString: the JWT token string to validate.
//
// Returns:
//   - *Claims: the claims (including the email) if the token is valid.
//   - error: an error if the token is invalid or if there was an issue parsing it.
func ValidateJWT(tokenString string) (*Claims, error) {
    claims := &Claims{}

    // Parse the JWT string and store the result in `claims`
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil // jwtKey is now accessible globally
    })

    // Check if there was an error in parsing or the token is invalid
    if err != nil || !token.Valid {
        return nil, errors.New("invalid token")
    }

    // Token is valid, return the claims
    return claims, nil
}

// ExtractEmailFromJWT extracts the email from the JWT token in the Authorization header.
func ExtractEmailFromJWT(authHeader string) (string, error) {
    if authHeader == "" {
        return "", errors.New("authorization header is empty")
    }

    parts := strings.Split(authHeader, " ")
    if len(parts) != 2 || parts[0] != "Bearer" {
        return "", errors.New("invalid authorization header format")
    }

    tokenStr := parts[1]

    claims := &Claims{}

    token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil || !token.Valid {
        return "", errors.New("invalid token")
    }

    return claims.Email, nil
}