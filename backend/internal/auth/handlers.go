// Package handlers contains HTTP handlers for user authentication,
// including user registration and login. These handlers interact
// with the models package to manage users in the database and use
// utility functions for password hashing and JWT generation.
package auth

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    "errors"
    "time"

    "github.com/gorilla/mux"
    "github.com/stevenpstansberry/AquaMind-AI/internal/models"
    "github.com/stevenpstansberry/AquaMind-AI/internal/util"
    "golang.org/x/crypto/bcrypt"
)

// Credentials represents the structure for incoming authentication requests.
// It includes the user's email, password, and optionally, first name (for registration).
type Credentials struct {
    Email    string `json:"email"`     // The user's email address
    Password string `json:"password"`  // The user's password
    FirstName string `json:"first_name,omitempty"`  // Optional first name for registration
    Username string `json:"username,omitempty"`  // Optional username for registration
    Subscribe string `json:"subscribe,omitempty"`  // Optional subscription for registration
    CreatedAt string `json:"created_at,omitempty"`  // Optional created_at for registration

}

// RegisterUser handles user registration by accepting user details (email, password, first name),
// hashing the password, and storing the user in the database. It returns a JWT token upon success.
//
// Method: POST
// Endpoint: /register
//
// The function performs the following steps:
//   - Parse and validate the incoming request body (expects JSON).
//   - Check if the user already exists in the database.
//   - Store the user details in the database.
//   - Generate a JWT token for the registered user.
//   - Return the token as a JSON response or an error message in case of failure.
//
// Request body (JSON):
//   {
//     "email": "user@example.com",
//     "password": "userpassword",
//     "first_name": "User first Name"
//   }
//
// Response (JSON):
//   - On success: {"token": "generated-jwt-token"}
//   - On error: HTTP status code with an appropriate error message.
func RegisterUser(w http.ResponseWriter, r *http.Request) {
    var creds Credentials

    // Parse JSON request body
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        log.Printf("Error decoding request body: %v", err)
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    log.Printf("Parsed credentials: %+v", creds)

    // Check if user already exists
    if models.UserExists(creds.Email) {
        log.Printf("User with email %s already exists", creds.Email)
        http.Error(w, "User already exists", http.StatusBadRequest)
        return
    }

    // Hash the password before storing it
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
    if err != nil {
        log.Printf("Error hashing password: %v", err)
        http.Error(w, "Error processing password", http.StatusInternalServerError)
        return
    }

    // Create user in the database with the hashed password
    err = models.CreateUser(creds.Email, string(hashedPassword), creds.FirstName, creds.Username, creds.Subscribe, creds.CreatedAt)
    if err != nil {
        log.Printf("Error creating user in database: %v", err)
        http.Error(w, "Error creating user", http.StatusInternalServerError)
        return
    }

    // Generate JWT
    token, err := utils.GenerateJWT(creds.Email)
    if err != nil {
        log.Printf("Error generating JWT token: %v", err)
        http.Error(w, "Error generating token", http.StatusInternalServerError)
        return
    }

    // Respond with the JWT token
    log.Printf("User %s created successfully", creds.Email)
    json.NewEncoder(w).Encode(map[string]string{"token": token})
}


// LoginUser handles user authentication by verifying the user's email and password.
// If valid, it returns a JWT token for future authenticated requests.
//
// Method: POST
// Endpoint: /login
//
// The function performs the following steps:
//   - Parse and validate the incoming request body (expects JSON).
//   - Check if the user exists in the database.
//   - Compare the provided password with the stored hashed password.
//   - Generate a JWT token upon successful authentication.
//   - Return the token as a JSON response or an error message if authentication fails.
//
// Request body (JSON):
//   {
//     "email": "user@example.com",
//     "password": "userpassword"
//   }
//
// Response (JSON):
//   - On success: {"token": "generated-jwt-token"}
//   - On error: HTTP status code with an appropriate error message.
func LoginUser(w http.ResponseWriter, r *http.Request) {
    var creds Credentials

    // Log that the login attempt has started
    log.Println("Login attempt started")

    // Parse JSON request body
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        log.Printf("Error decoding request body: %v\n", err)
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    log.Printf("Attempting to authenticate user with email: %s\n", creds.Email)

    // Get user from the database
    user, err := models.GetUserByEmail(creds.Email)
    if err != nil {
        log.Printf("User not found or invalid credentials for email: %s\n", creds.Email)
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // Compare the hashed password
    err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password))
    if err != nil {
        log.Printf("Invalid password for user: %s\n", creds.Email)
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }


    log.Printf("User authenticated successfully: %s\n", creds.Email)

    // Generate JWT token
    token, err := utils.GenerateJWT(user.Email)
    if err != nil {
        log.Printf("Error generating JWT token for user: %s, error: %v\n", creds.Email, err)
        http.Error(w, "Error generating token", http.StatusInternalServerError)
        return
    }

    // Log successful login and token generation
    log.Printf("JWT token generated successfully for user: %s\n", creds.Email)

    // Return the JWT token
    json.NewEncoder(w).Encode(map[string]string{"token": token})
    log.Println("Login attempt successful, token sent to user")
}



// CreateAquariumHandler handles the creation of a new aquarium.
func CreateAquariumHandler(w http.ResponseWriter, r *http.Request) {
    // Only allow POST method
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    // Extract user information from the JWT token
    userEmail, err := utils.ExtractEmailFromJWT(r.Header.Get("Authorization"))
    if err != nil {
        log.Printf("Error extracting user from token: %v", err)
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Get user by email
    user, err := models.GetUserByEmail(userEmail)
    if err != nil {
        log.Printf("Error retrieving user: %v", err)
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    var aquarium models.Aquarium

    // Parse JSON request body
    err = json.NewDecoder(r.Body).Decode(&aquarium)
    if err != nil {
        log.Printf("Error decoding request body: %v", err)
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Set the UserID to the authenticated user's ID
    aquarium.UserID = user.ID

    // Save the aquarium to the database
    err = models.CreateAquarium(&aquarium)
    if err != nil {
        log.Printf("Error creating aquarium in database: %v", err)
        http.Error(w, "Error creating aquarium", http.StatusInternalServerError)
        return
    }

    // Respond with the created aquarium object
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(aquarium)
}

// GetUserAquariumsHandler retrieves all aquariums for the authenticated user.
func GetUserAquariumsHandler(w http.ResponseWriter, r *http.Request) {
    // Extract user information from the JWT token
    userEmail, err := utils.ExtractEmailFromJWT(r.Header.Get("Authorization"))
    if err != nil {
        log.Printf("Error extracting user from token: %v", err)
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Get user by email
    user, err := models.GetUserByEmail(userEmail)
    if err != nil {
        log.Printf("Error retrieving user: %v", err)
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    // Get aquariums for the user
    aquariums, err := models.GetAquariumsByUserID(user.ID)
    if err != nil {
        log.Printf("Error retrieving aquariums: %v", err)
        http.Error(w, "Error retrieving aquariums", http.StatusInternalServerError)
        return
    }

    // Respond with the user's aquariums
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(aquariums)
}

// GetAquariumHandler handles the retrieval of a single aquarium by ID.
func GetAquariumHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    // Extract user information from the JWT token
    userEmail, err := utils.ExtractEmailFromJWT(r.Header.Get("Authorization"))
    if err != nil {
        log.Printf("Error extracting user from token: %v", err)
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Get user by email
    user, err := models.GetUserByEmail(userEmail)
    if err != nil {
        log.Printf("Error retrieving user: %v", err)
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    aquarium, err := models.GetAquariumByID(id)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "Aquarium not found", http.StatusNotFound)
        } else {
            log.Printf("Error retrieving aquarium: %v", err)
            http.Error(w, "Error retrieving aquarium", http.StatusInternalServerError)
        }
        return
    }

    // Check if the aquarium belongs to the user
    if aquarium.UserID != user.ID {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

    // Respond with the aquarium data
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(aquarium)
}

// UpdateAquariumHandler handles the update of an existing aquarium.
func UpdateAquariumHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    // Extract user information from the JWT token
    userEmail, err := utils.ExtractEmailFromJWT(r.Header.Get("Authorization"))
    if err != nil {
        log.Printf("Error extracting user from token: %v", err)
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Get user by email
    user, err := models.GetUserByEmail(userEmail)
    if err != nil {
        log.Printf("Error retrieving user: %v", err)
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    var aquarium models.Aquarium

    // Parse JSON request body
    err = json.NewDecoder(r.Body).Decode(&aquarium)
    if err != nil {
        log.Printf("Error decoding request body: %v", err)
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Set the ID from the URL path
    aquarium.ID = id

    // Retrieve the existing aquarium
    existingAquarium, err := models.GetAquariumByID(id)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "Aquarium not found", http.StatusNotFound)
        } else {
            log.Printf("Error retrieving aquarium: %v", err)
            http.Error(w, "Error retrieving aquarium", http.StatusInternalServerError)
        }
        return
    }

    // Check if the aquarium belongs to the user
    if existingAquarium.UserID != user.ID {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

    // Set the UserID to ensure it remains the same
    aquarium.UserID = user.ID

    // Update the aquarium in the database
    err = models.UpdateAquarium(&aquarium)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "Aquarium not found", http.StatusNotFound)
        } else {
            log.Printf("Error updating aquarium: %v", err)
            http.Error(w, "Error updating aquarium", http.StatusInternalServerError)
        }
        return
    }

    // Respond with the updated aquarium object
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(aquarium)
}

// DeleteAquariumHandler handles the deletion of an aquarium.
func DeleteAquariumHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    // Extract user information from the JWT token
    userEmail, err := utils.ExtractEmailFromJWT(r.Header.Get("Authorization"))
    if err != nil {
        log.Printf("Error extracting user from token: %v", err)
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Get user by email
    user, err := models.GetUserByEmail(userEmail)
    if err != nil {
        log.Printf("Error retrieving user: %v", err)
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    // Attempt to delete the aquarium
    err = models.DeleteAquarium(id, user.ID)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "Aquarium not found or not owned by user", http.StatusNotFound)
        } else {
            log.Printf("Error deleting aquarium: %v", err)
            http.Error(w, "Error deleting aquarium", http.StatusInternalServerError)
        }
        return
    }

    // Respond with no content status
    w.WriteHeader(http.StatusNoContent)
}

// GetDetailHandler handles the retrieval of species, plant, or equipment details by ID.
func GetDetailHandler(w http.ResponseWriter, r *http.Request) {
    // Extract the ID from the URL path
    vars := mux.Vars(r)
    id := vars["id"]



    // Read the header parameter "X-Detail-Type"
    detailType := r.Header.Get("X-Detail-Type")
    if detailType == "" {
        http.Error(w, "Missing X-Detail-Type header", http.StatusBadRequest)
        return
    }

    // Extract the detail type from the header
    log.Printf("Requesting detail for ID: %s and type: %s", id, detailType)





    result, err := models.GetDetailByID(id, detailType)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            http.Error(w, "Not found", http.StatusNotFound)
        } else {
            log.Printf("Error retrieving detail: %v", err)
            http.Error(w, "Error retrieving detail", http.StatusInternalServerError)
        }
        return
    }

    // Respond with the retrieved detail
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}

// GetAllDetailsHandler retrieves all records of the specified type.
func GetAllDetailsHandler(w http.ResponseWriter, r *http.Request) {
    detailType := mux.Vars(r)["type"]
    log.Printf("Requesting all details of type: %s", detailType)

    result, err := models.GetAllDetails(detailType)
    if err != nil {
        log.Printf("Error retrieving details: %v", err)
        http.Error(w, "Error retrieving details", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}


// CreateParameterEntryHandler handles the creation of a new parameter entry.
func CreateParameterEntryHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    aquariumID := vars["aquariumId"]

    // Extract user information from the JWT token
    userEmail, err := utils.ExtractEmailFromJWT(r.Header.Get("Authorization"))
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Get user by email
    user, err := models.GetUserByEmail(userEmail)
    if err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    // Verify that the aquarium belongs to the user
    aquarium, err := models.GetAquariumByID(aquariumID)
    if err != nil {
        http.Error(w, "Aquarium not found", http.StatusNotFound)
        return
    }
    if aquarium.UserID != user.ID {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

    var entry models.WaterParameterEntry

    // Parse JSON request body
    err = json.NewDecoder(r.Body).Decode(&entry)
    if err != nil {
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Set the AquariumID and Timestamp
    entry.AquariumID = aquariumID
    if entry.Timestamp == 0 {
        entry.Timestamp = time.Now().Unix()
    }

    // Create the parameter entry in the database
    err = models.CreateWaterParameterEntry(&entry)
    if err != nil {
        http.Error(w, "Error creating parameter entry", http.StatusInternalServerError)
        return
    }

    // Respond with the created parameter entry
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(entry)
}

func GetParameterEntriesHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    aquariumID := vars["aquariumId"]

    // Extract user information from the JWT token
    userEmail, err := utils.ExtractEmailFromJWT(r.Header.Get("Authorization"))
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Get user by email
    user, err := models.GetUserByEmail(userEmail)
    if err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    // Verify that the aquarium belongs to the user
    aquarium, err := models.GetAquariumByID(aquariumID)
    if err != nil {
        http.Error(w, "Aquarium not found", http.StatusNotFound)
        return
    }
    if aquarium.UserID != user.ID {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

    // Retrieve parameter entries from the database
    entries, err := models.GetWaterParameterEntriesByAquariumID(aquariumID)
    if err != nil {
        http.Error(w, "Error retrieving parameter entries", http.StatusInternalServerError)
        return
    }

    // Respond with the parameter entries
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(entries)
}