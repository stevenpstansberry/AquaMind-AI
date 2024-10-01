package models

import (
    "database/sql"
    _ "github.com/lib/pq" // PostgreSQL driver
)

var db *sql.DB

// InitDB initializes the connection to the database (called from main.go)
func InitDB(database *sql.DB) {
    db = database
}

type User struct {
    ID       int
    Email    string
    Password string
    FullName string
}

// CreateUser saves a new user to the database
func CreateUser(email, password, fullName string) error {
    query := `INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3)`
    _, err := db.Exec(query, email, password, fullName)
    return err
}

// GetUserByEmail retrieves a user by their email address
func GetUserByEmail(email string) (*User, error) {
    var user User
    query := `SELECT id, email, password, full_name FROM users WHERE email = $1`
    err := db.QueryRow(query, email).Scan(&user.ID, &user.Email, &user.Password, &user.FullName)
    if err != nil {
        return nil, err
    }
    return &user, nil
}

// UserExists checks if a user already exists
func UserExists(email string) bool {
    var exists bool
    query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
    db.QueryRow(query, email).Scan(&exists)
    return exists
}
