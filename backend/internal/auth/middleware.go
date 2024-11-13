// Package middlewares provides middleware functions for HTTP handlers.
package auth

import (
	"log"
	"net/http"
	"strings"
	"time"

	utils "github.com/stevenpstansberry/AquaMind-AI/internal/util"
)

// LoggingMiddleware is an HTTP middleware that provides extensive logging for each request.
// It logs details such as request method, URL, client IP address, user agent, and authorization status.
//
// Usage:
// This middleware should be used to wrap routes where logging is required.
//
// Example:
//
//	http.HandleFunc("/route", middlewares.LoggingMiddleware(protectedHandler))
//
// Params:
//   - next: the HTTP handler to execute after logging request details.
//
// Returns:
//   - http.HandlerFunc: a wrapped HTTP handler that logs request details.
//
// LoggingMiddleware is an HTTP middleware that provides extensive logging for each request.
// It logs details such as request method, URL, client IP address, user agent, and authorization status.
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get client IP address
		clientIP := r.Header.Get("X-Forwarded-For")
		if clientIP == "" {
			clientIP = r.Header.Get("X-Real-IP")
		}
		if clientIP == "" {
			clientIP = r.RemoteAddr
		}

		// Load the Pacific timezone location
		location, err := time.LoadLocation("America/Los_Angeles")
		if err != nil {
			log.Printf("Error loading location: %v", err)
			location = time.UTC // Fallback to UTC if there's an error
		}

		// Log request details with Pacific time
		log.Printf("Request received: %s %s", r.Method, r.URL.Path)
		log.Printf("Timestamp (Pacific Time): %s", time.Now().In(location).Format(time.RFC3339))
		log.Printf("Client IP: %s", clientIP)
		log.Printf("User-Agent: %s", r.UserAgent())
		log.Printf("Authorization header: %s", r.Header.Get("Authorization"))

		// Call the next handler
		next.ServeHTTP(w, r)

		// Optionally log after handler execution for additional response info if needed
		log.Printf("Response sent for: %s %s", r.Method, r.URL.Path)
	})
}

// JWTAuthMiddleware is an HTTP middleware that protects routes by verifying the presence and validity of a JWT token.
// It expects the token in the Authorization header using the Bearer schema. If the token is valid, the request is passed
// to the next handler; otherwise, it returns an unauthorized response.
//
// Usage:
// This middleware should be used to wrap protected routes.
//
// Example:
//
//	http.HandleFunc("/protected", middlewares.JWTAuthMiddleware(protectedHandler))
//
// Params:
//   - next: the HTTP handler that should be executed if the token is valid.
//
// Returns:
//   - http.HandlerFunc: a wrapped HTTP handler that verifies JWT authentication.
func JWTAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// Check if the Authorization header is present
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		// Extract the token from the Authorization header
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Validate the JWT token
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		log.Printf("Authenticated user: %s", claims.Email)

		// Optionally, you can pass claims in the request context here if needed

		// Call the next handler if token is valid
		next.ServeHTTP(w, r)
	}
}
