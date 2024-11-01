package models

import (
    "fmt"
    "strings"
)

// GetSpeciesDetailsByIDs retrieves the details of species by their IDs.
func GetSpeciesDetailsByIDs(speciesIDs []string) ([]Species, error) {
    if len(speciesIDs) == 0 {
        return nil, nil
    }

    // Create a placeholder string for SQL IN clause
    placeholders := make([]string, len(speciesIDs))
    args := make([]interface{}, len(speciesIDs))
    for i, id := range speciesIDs {
        placeholders[i] = fmt.Sprintf("$%d", i+1)
        args[i] = id
    }

    query := fmt.Sprintf(`
        SELECT 
            id, name, role, type, description, feeding_habits, tank_requirements,
            min_tank_size, compatibility, lifespan, size, water_parameters,
            breeding_info, behavior, care_level, dietary_restrictions, native_habitat,
            stocking_recommendations, special_considerations, image_url, scientific_name,
            wikipedia_link
        FROM species
        WHERE id IN (%s)
    `, strings.Join(placeholders, ", "))

    rows, err := db.Query(query, args...)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var speciesList []Species
    for rows.Next() {
        var species Species
        err := rows.Scan(
            &species.Id,
            &species.Name,
            &species.Role,
            &species.Type,
            &species.Description,
            &species.FeedingHabits,
            &species.TankRequirements,
            &species.MinTankSize,
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
            &species.ImageURL,
            &species.ScientificName,
            &species.WikipediaLink,
        )
        if err != nil {
            return nil, err
        }
        speciesList = append(speciesList, species)
    }

    return speciesList, nil
}
