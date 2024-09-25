package utils

import (
    "github.com/dgrijalva/jwt-go"
    "time"
)

// Claims structure for JWT
type Claims struct {
    Email string `json:"email"`
    jwt.StandardClaims
}


// ValidateJWT validates a JWT token and returns the claims
func ValidateJWT(tokenString string, jwtKey []byte) (*Claims, error) {
    claims := &Claims{}
    
    // Parse the token
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil || !token.Valid {
        return nil, err
    }

    return claims, nil
}
