package middlewares

import (
    "net/http"
    "strings"
    "backend/utils"
)

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
        claims, err := utils.ValidateJWT(tokenString)
        if err != nil {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        // Set the claims (like Email) in the request context (optional)
        // and pass control to the next handler
        next.ServeHTTP(w, r)
    }
}
