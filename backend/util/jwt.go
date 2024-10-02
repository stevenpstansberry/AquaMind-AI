// Package utils provides utility functions for generating and validating JWT tokens.
// These functions are used for securing routes by generating tokens upon user login
// and validating them for protected routes.
package utils

import (
    "time"
    "github.com/dgrijalva/jwt-go"
    "errors"
)

// Claims represents the structure for JWT claims. It embeds the StandardClaims
// from the JWT package and includes an Email field to store the user's email address.
type Claims struct {
    Email string `json:"email"`           // The user's email address
    jwt.StandardClaims                   // Embedded standard claims (e.g., expiration time)
}

// jwtKey is the secret key used to sign JWT tokens. 
// In production, this should be securely stored (e.g., AWS Secrets Manager, environment variables).
var jwtKey = []byte("your_secret_key")

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

    // Sign the token with the secret key
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
        return jwtKey, nil
    })

    // Check if there was an error in parsing or the token is invalid
    if err != nil || !token.Valid {
        return nil, errors.New("invalid token")
    }

    // Token is valid, return the claims
    return claims, nil
}
