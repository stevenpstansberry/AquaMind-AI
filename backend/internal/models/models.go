// Package models provides data access to the database for the User entity.
// It includes functions to create users, check user existence, and retrieve users by their email.
package models

import (
    "database/sql"
    "encoding/json"
    _ "github.com/lib/pq" // PostgreSQL driver
)

// db is a package-level variable for the database connection.
var db *sql.DB

// InitDB initializes the global database connection.
// It should be called once from the main function to establish the connection.
//
// Params:
//   - database: the initialized sql.DB connection object
func InitDB(database *sql.DB) {
    db = database
}

// User represents a user in the system with their ID, email, password, and first name.
type User struct {
    ID       string    // Unique identifier of the user
    Email    string // Email address of the user
    Password string // Hashed password of the user
    FirstName string // First name of the user
}


// CreateUser inserts a new user into the database with the provided email, password, and first name.
//
// Params:
//   - email: the user's email address
//   - password: the user's hashed password
//   - first_name: the user's first name
//   - username: the user's username
//
// Returns:
//   - error: an error if the insert operation fails, otherwise nil
func CreateUser(email, password, first_name string, username string, subscribe string, created_at string) error {
    query := `INSERT INTO users (email, password, first_name, username, subscribe, created_at) VALUES ($1, $2, $3, $4, $5, $6)`
    _, err := db.Exec(query, email, password, first_name, username, subscribe, created_at)
    return err
}


// GetUserByEmail retrieves a user from the database by their email address.
//
// Params:
//   - email: the user's email address to search by
//
// Returns:
//   - *User: a pointer to the User struct if the user is found
//   - error: an error if the query fails or the user is not found
func GetUserByEmail(email string) (*User, error) {
    var user User
    query := `SELECT id, email, password, first_name FROM users WHERE email = $1`
    err := db.QueryRow(query, email).Scan(&user.ID, &user.Email, &user.Password, &user.FirstName)
    if err != nil {
        return nil, err
    }
    return &user, nil
}

// UserExists checks whether a user with the specified email exists in the database.
//
// Params:
//   - email: the user's email address to check
//
// Returns:
//   - bool: true if the user exists, false otherwise
func UserExists(email string) bool {
    var exists bool
    query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
    db.QueryRow(query, email).Scan(&exists)
    return exists
}

// Aquarium represents an aquarium in the system.
type Aquarium struct {
    ID        string   // UUID
    UserID    string      // Owner's user ID
    Name      string
    Type      string
    Size      string
    Species   []string
    Plants    []string
    Equipment []string
}

// CreateAquarium inserts a new aquarium into the database.
func CreateAquarium(aquarium *Aquarium) error {
    speciesJSON, err := json.Marshal(aquarium.Species)
    if err != nil {
        return err
    }
    plantsJSON, err := json.Marshal(aquarium.Plants)
    if err != nil {
        return err
    }
    equipmentJSON, err := json.Marshal(aquarium.Equipment)
    if err != nil {
        return err
    }

    query := `
        INSERT INTO aquariums (id, user_id, name, type, size, species, plants, equipment)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb)
    `
    _, err = db.Exec(query, aquarium.ID, aquarium.UserID, aquarium.Name, aquarium.Type, aquarium.Size, speciesJSON, plantsJSON, equipmentJSON)
    return err
}

// GetAquariumsByUserID retrieves all aquariums owned by a user.
func GetAquariumsByUserID(userID string) ([]Aquarium, error) {
    query := `
        SELECT id, user_id, name, type, size, species, plants, equipment
        FROM aquariums
        WHERE user_id = $1
    `
    rows, err := db.Query(query, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var aquariums []Aquarium

    for rows.Next() {
        var aquarium Aquarium
        var speciesJSON, plantsJSON, equipmentJSON []byte

        err := rows.Scan(&aquarium.ID, &aquarium.UserID, &aquarium.Name, &aquarium.Type, &aquarium.Size, &speciesJSON, &plantsJSON, &equipmentJSON)
        if err != nil {
            return nil, err
        }

        json.Unmarshal(speciesJSON, &aquarium.Species)
        json.Unmarshal(plantsJSON, &aquarium.Plants)
        json.Unmarshal(equipmentJSON, &aquarium.Equipment)

        aquariums = append(aquariums, aquarium)
    }

    return aquariums, nil
}

// GetAquariumByID retrieves an aquarium by its ID.
func GetAquariumByID(id string) (*Aquarium, error) {
    query := `SELECT id, user_id, name, type, size, species, plants, equipment FROM aquariums WHERE id = $1`
    var aquarium Aquarium
    var speciesJSON, plantsJSON, equipmentJSON []byte

    err := db.QueryRow(query, id).Scan(&aquarium.ID, &aquarium.UserID, &aquarium.Name, &aquarium.Type, &aquarium.Size, &speciesJSON, &plantsJSON, &equipmentJSON)
    if err != nil {
        return nil, err
    }

    json.Unmarshal(speciesJSON, &aquarium.Species)
    json.Unmarshal(plantsJSON, &aquarium.Plants)
    json.Unmarshal(equipmentJSON, &aquarium.Equipment)

    return &aquarium, nil
}

// UpdateAquarium updates an existing aquarium in the database.
func UpdateAquarium(aquarium *Aquarium) error {
    speciesJSON, err := json.Marshal(aquarium.Species)
    if err != nil {
        return err
    }
    plantsJSON, err := json.Marshal(aquarium.Plants)
    if err != nil {
        return err
    }
    equipmentJSON, err := json.Marshal(aquarium.Equipment)
    if err != nil {
        return err
    }

    query := `
        UPDATE aquariums
        SET name = $1, type = $2, size = $3, species = $4::jsonb, plants = $5::jsonb, equipment = $6::jsonb
        WHERE id = $7 AND user_id = $8
    `
    result, err := db.Exec(query, aquarium.Name, aquarium.Type, aquarium.Size, speciesJSON, plantsJSON, equipmentJSON, aquarium.ID, aquarium.UserID)
    if err != nil {
        return err
    }

    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return err
    }
    if rowsAffected == 0 {
        return sql.ErrNoRows
    }

    return nil
}

// DeleteAquarium deletes an aquarium from the database.
func DeleteAquarium(id string, userID string) error {
    query := `DELETE FROM aquariums WHERE id = $1 AND user_id = $2`
    result, err := db.Exec(query, id, userID)
    if err != nil {
        return err
    }

    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return err
    }
    if rowsAffected == 0 {
        return sql.ErrNoRows
    }

    return nil
}