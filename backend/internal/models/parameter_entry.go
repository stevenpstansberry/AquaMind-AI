// models/parameter_entry.go

package models

import (
)

// CreateWaterParameterEntry inserts a new parameter entry into the database.
func CreateWaterParameterEntry(entry *WaterParameterEntry) error {
    query := `
        INSERT INTO parameter_entries (id, aquarium_id, timestamp, temperature, ph, hardness)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `

    _, err := db.Exec(query, entry.ID, entry.AquariumID, entry.Timestamp, entry.Temperature, entry.Ph, entry.Hardness)
    return err
}

// GetWaterParameterEntriesByAquariumID retrieves all parameter entries for a specific aquarium.
func GetWaterParameterEntriesByAquariumID(aquariumID string) ([]WaterParameterEntry, error) {
    query := `
        SELECT id, aquarium_id, timestamp, temperature, ph, hardness
        FROM parameter_entries
        WHERE aquarium_id = $1
        ORDER BY timestamp DESC
    `

    rows, err := db.Query(query, aquariumID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var entries []WaterParameterEntry
    for rows.Next() {
        var entry WaterParameterEntry
        err := rows.Scan(
            &entry.ID,
            &entry.AquariumID,
            &entry.Timestamp,
            &entry.Temperature,
            &entry.Ph,
            &entry.Hardness,
        )
        if err != nil {
            return nil, err
        }
        entries = append(entries, entry)
    }
    return entries, nil
}