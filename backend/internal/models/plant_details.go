package models

import (
    "fmt"
    "strings"
)


// GetPlantsDetailsByIDs retrieves the details of plants by their IDs.
func GetPlantsDetailsByIDs(plantIDs []string) ([]Plant, error) {
    if len(plantIDs) == 0 {
        return nil, nil
    }

    // Create a placeholder string for SQL IN clause
    placeholders := make([]string, len(plantIDs))
    args := make([]interface{}, len(plantIDs))
    for i, id := range plantIDs {
        placeholders[i] = fmt.Sprintf("$%d", i+1)
        args[i] = id
    }

    query := fmt.Sprintf(`
        SELECT 
            id, name, role, type, description, tank_requirements, min_tank_size,
            compatibility, lifespan, size, water_parameters, lighting_needs,
            growth_rate, care_level, native_habitat, propagation_methods,
            special_considerations, image_url, scientific_name, wikipedia_link
        FROM plants
        WHERE id IN (%s)
    `, strings.Join(placeholders, ", "))

    rows, err := db.Query(query, args...)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var plantList []Plant
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
            &plant.ScientificName,
            &plant.WikipediaLink,
        )
        if err != nil {
            return nil, err
        }
        plantList = append(plantList, plant)
    }

    return plantList, nil
}
