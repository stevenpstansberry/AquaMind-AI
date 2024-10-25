// Package models provides data access to the database for the User entity.
// It includes functions to create users, check user existence, and retrieve users by their email.
package models

import (
    "database/sql"
    "encoding/json"
    "errors"
    "fmt"
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
    ID        string    `json:"id"`
    UserID    string    `json:"userId"`
    Name      string    `json:"name"`
    Type      string    `json:"type"`
    Size      string    `json:"size"`
    Species   []Species `json:"species"`
    Plants    []Plant   `json:"plants"`
    Equipment []Equipment `json:"equipment"`
}

type Species struct {
    Id                      string  `json:"id"`
    Name                    string  `json:"name"`
    ImageURL                *string `json:"imageUrl"`
    Role                    string  `json:"role"`
    Type                    string  `json:"type"`
    Description             string  `json:"description"`
    FeedingHabits           string  `json:"feedingHabits"`
    TankRequirements        string  `json:"tankRequirements"`
    Compatibility           string  `json:"compatibility"`
    Lifespan                *string `json:"lifespan"`
    Size                    *string `json:"size"`
    WaterParameters         *string `json:"waterParameters"`
    BreedingInfo            *string `json:"breeding_info"`
    Behavior                *string `json:"behavior"`
    CareLevel               *string `json:"careLevel"`
    DietaryRestrictions     *string `json:"dietaryRestrictions"`
    NativeHabitat           *string `json:"nativeHabitat"`
    StockingRecommendations *string `json:"stockingRecommendations"`
    SpecialConsiderations   *string `json:"specialConsiderations"`
    MinTankSize             int     `json:"minTankSize"`
}

type Plant struct {
    Id                  string  `json:"id"`
    Name                string  `json:"name"`
    Role                string  `json:"role"`
    Type                string  `json:"type"`
    Description         string  `json:"description"`
    TankRequirements    string  `json:"tankRequirements"`
    MinTankSize         int     `json:"minTankSize"`
    Compatibility       string  `json:"compatibility"`
    Lifespan            *string `json:"lifespan"`
    Size                *string `json:"size"`
    WaterParameters     *string `json:"waterParameters"`
    LightingNeeds       *string `json:"lightingNeeds"`
    GrowthRate          *string `json:"growthRate"`
    CareLevel           *string `json:"careLevel"`
    NativeHabitat       *string `json:"nativeHabitat"`
    PropagationMethods  *string `json:"propagationMethods"`
    SpecialConsiderations *string `json:"specialConsiderations"`
    ImageURL            *string `json:"imageUrl"`
}


type Equipment struct {
    Id                  string          `json:"id"`
    Name                string          `json:"name"`
    Description         string          `json:"description"`
    Role                string          `json:"role"`
    Importance          string          `json:"importance"`
    Usage               string          `json:"usage"`
    SpecialConsiderations *string       `json:"specialConsiderations"`
    Fields              json.RawMessage `json:"fields"`
    Type                string          `json:"type"`
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


func GetDetailByID(id string, detailType string) (interface{}, error) {
    var tableName string
    switch detailType {
    case "species":
        tableName = "species"
    case "plant":
        tableName = "plants"
    case "equipment":
        tableName = "equipment"
    default:
        return nil, errors.New("Invalid detail type")
    }

    var query string
    switch detailType {
    case "species":
        query = fmt.Sprintf(`
            SELECT id, name, image_url, role, type, description, feeding_habits, tank_requirements, 
                   compatibility, lifespan, size, water_parameters, breeding_info, behavior, care_level,
                   dietary_restrictions, native_habitat, stocking_recommendations, special_considerations, min_tank_size
            FROM %s
            WHERE id = $1
        `, tableName)
    case "plant":
        query = fmt.Sprintf(`
            SELECT id, name, role, type, description, tank_requirements, min_tank_size, compatibility, 
                   lifespan, size, water_parameters, lighting_needs, growth_rate, care_level, native_habitat, 
                   propagation_methods, special_considerations, image_url
            FROM %s
            WHERE id = $1
        `, tableName)
    case "equipment":
        query = fmt.Sprintf(`
            SELECT id, name, description, role, importance, usage, special_considerations, fields, type
            FROM %s
            WHERE id = $1
        `, tableName)
    default:
        return nil, errors.New("Unhandled detail type")
    }

    var detail interface{}

    switch detailType {
    case "species":
        var species Species
        err := db.QueryRow(query, id).Scan(
            &species.Id,
            &species.Name,
            &species.ImageURL,
            &species.Role,
            &species.Type,
            &species.Description,
            &species.FeedingHabits,
            &species.TankRequirements,
            &species.Compatibility,
            &species.Lifespan,
            &species.Size,
            &species.WaterParameters,
            &species.BreedingInfo,
            &species.Behavior,
            &species.CareLevel,
            &species.DietaryRestrictions,
            &species.NativeHabitat,
            &species.StockingRecommendations,
            &species.SpecialConsiderations,
            &species.MinTankSize,
        )
        if err != nil {
            return nil, err
        }
        detail = species
    case "plant":
        var plant Plant
        err := db.QueryRow(query, id).Scan(
            &plant.Id,
            &plant.Name,
            &plant.Role,
            &plant.Type,
            &plant.Description,
            &plant.TankRequirements,
            &plant.MinTankSize,
            &plant.Compatibility,
            &plant.Lifespan,
            &plant.Size,
            &plant.WaterParameters,
            &plant.LightingNeeds,
            &plant.GrowthRate,
            &plant.CareLevel,
            &plant.NativeHabitat,
            &plant.PropagationMethods,
            &plant.SpecialConsiderations,
            &plant.ImageURL,
        )
        if err != nil {
            return nil, err
        }
        detail = plant
    case "equipment":
        var equipment Equipment
        err := db.QueryRow(query, id).Scan(
            &equipment.Id,
            &equipment.Name,
            &equipment.Description,
            &equipment.Role,
            &equipment.Importance,
            &equipment.Usage,
            &equipment.SpecialConsiderations,
            &equipment.Fields,
            &equipment.Type,
        )
        if err != nil {
            return nil, err
        }
        detail = equipment
    default:
        return nil, errors.New("Unhandled detail type")
    }

    return detail, nil
}


// GetAllDetails retrieves all records of a given type (species, plants, equipment) from the database.
func GetAllDetails(detailType string) (interface{}, error) {
    var query string
    switch detailType {
    case "species":
        query = `SELECT id, name, image_url, role, type, description, feeding_habits, tank_requirements,
                 compatibility, lifespan, size, water_parameters, breeding_info, behavior, care_level,
                 dietary_restrictions, native_habitat, stocking_recommendations, special_considerations, min_tank_size
                 FROM species`
    case "plants":
        query = `SELECT id, name, role, type, description, tank_requirements, min_tank_size, compatibility,
                 lifespan, size, water_parameters, lighting_needs, growth_rate, care_level, native_habitat,
                 propagation_methods, special_considerations, image_url
                 FROM plants`
    case "equipment":
        query = `SELECT id, name, description, role, importance, usage, special_considerations, fields, type
                 FROM equipment`
    default:
        return nil, errors.New("Invalid detail type")
    }

    rows, err := db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    switch detailType {
    case "species":
        var speciesList []Species
        for rows.Next() {
            var species Species
            err := rows.Scan(
                &species.Id,
                &species.Name,
                &species.ImageURL,
                &species.Role,
                &species.Type,
                &species.Description,
                &species.FeedingHabits,
                &species.TankRequirements,
                &species.Compatibility,
                &species.Lifespan,
                &species.Size,
                &species.WaterParameters,
                &species.BreedingInfo,
                &species.Behavior,
                &species.CareLevel,
                &species.DietaryRestrictions,
                &species.NativeHabitat,
                &species.StockingRecommendations,
                &species.SpecialConsiderations,
                &species.MinTankSize,
            )
            if err != nil {
                return nil, err
            }
            speciesList = append(speciesList, species)
        }
        return speciesList, nil
    case "plants":
        var plants []Plant
        for rows.Next() {
            var plant Plant
            err := rows.Scan(
                &plant.Id,
                &plant.Name,
                &plant.Role,
                &plant.Type,
                &plant.Description,
                &plant.TankRequirements,
                &plant.MinTankSize,
                &plant.Compatibility,
                &plant.Lifespan,
                &plant.Size,
                &plant.WaterParameters,
                &plant.LightingNeeds,
                &plant.GrowthRate,
                &plant.CareLevel,
                &plant.NativeHabitat,
                &plant.PropagationMethods,
                &plant.SpecialConsiderations,
                &plant.ImageURL,
            )
            if err != nil {
                return nil, err
            }
            plants = append(plants, plant)
        }
        return plants, nil
    case "equipment":
        var equipmentList []Equipment
        for rows.Next() {
            var equipment Equipment
            err := rows.Scan(
                &equipment.Id,
                &equipment.Name,
                &equipment.Description,
                &equipment.Role,
                &equipment.Importance,
                &equipment.Usage,
                &equipment.SpecialConsiderations,
                &equipment.Fields,
                &equipment.Type,
            )
            if err != nil {
                return nil, err
            }
            equipmentList = append(equipmentList, equipment)
        }
        return equipmentList, nil
    default:
        return nil, errors.New("Unhandled detail type")
    }
}
