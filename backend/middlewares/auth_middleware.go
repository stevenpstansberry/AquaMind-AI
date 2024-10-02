// Package middlewares provides middleware functions for HTTP handlers.
package middlewares

import (
    "net/http"
    "strings"
    "backend/util"
)

// JWTAuthMiddleware is an HTTP middleware that protects routes by verifying the presence and validity of a JWT token.
// It expects the token in the Authorization header using the Bearer schema. If the token is valid, the request is passed
// to the next handler; otherwise, it returns an unauthorized response.
//
// Usage:
// This middleware should be used to wrap protected routes.
//
// Example:
//   http.HandleFunc("/protected", middlewares.JWTAuthMiddleware(protectedHandler))
//
// Params:
//   - next: the HTTP handler that should be executed if the token is valid.
//
// Returns:
//   - http.HandlerFunc: a wrapped HTTP handler that verifies JWT authentication.
func JWTAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")
        if authHeader == "" {
            http.Error(w, "Missing token", http.StatusUnauthorized)
            return
        }

        // Extract the token from the Authorization header
        tokenString := strings.TrimPrefix(authHeader, "Bearer ")

        // Validate the JWT token
        claims, err := util.ValidateJWT(tokenString)
        if err != nil {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        // Optionally, you can pass claims in the request context here if needed

        // Call the next handler if token is valid
        next.ServeHTTP(w, r)
    }
}
