package openai

import (
    "net/http"
    "io/ioutil"
    "os"
    "bytes"
    "log"
)

// HandleQuery processes requests to interact with the OpenAI API.
func HandleQuery(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    apiKey := os.Getenv("OPENAI_API_KEY")
    if apiKey == "" {
        http.Error(w, "API key not set", http.StatusInternalServerError)
        return
    }


    // Read the request body
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Failed to read request body", http.StatusInternalServerError)
        return
    }

    // Create a request to OpenAI API
    req, err := http.NewRequest("POST", "https://api.openai.com/v1/engines/davinci/completions", bytes.NewBuffer(body))
    if err != nil {
        http.Error(w, "Failed to create request", http.StatusInternalServerError)
        return
    }

    // Set headers
    req.Header.Set("Authorization", "Bearer "+apiKey)
    req.Header.Set("Content-Type", "application/json")

    // Send the request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        http.Error(w, "Failed to send request to OpenAI", http.StatusInternalServerError)
        return
    }
    defer resp.Body.Close()

    // Return the response from OpenAI
    responseBody, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        http.Error(w, "Failed to read response from OpenAI", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(resp.StatusCode)
    w.Write(responseBody)
}
