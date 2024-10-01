package utils

import (
    "time"
    "github.com/dgrijalva/jwt-go"
    "errors"
)

// Claims struct used to store the JWT claims
type Claims struct {
    Email string `json:"email"`
    jwt.StandardClaims
}

// Secret key used to sign the JWT. This should be stored securely, such as in AWS Secrets Manager.
var jwtKey = []byte("your_secret_key")

// GenerateJWT generates a new JWT for a given email
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

// ValidateJWT validates a JWT and returns the claims if valid
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
