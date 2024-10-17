package openai

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "os"

    openai "github.com/sashabaranov/go-openai"
)

// RequestBody represents the structure of the incoming request with a prompt.
type RequestBody struct {
    Prompt string `json:"prompt"`
}

// HandleQuery processes requests to interact with the OpenAI API using the official Go SDK.
func HandleQuery(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    // Load the OpenAI API key from environment variables
    apiKey := os.Getenv("OPENAI_API_KEY")
    if apiKey == "" {
        http.Error(w, "API key not set", http.StatusInternalServerError)
        return
    }

    // Parse the request body to get the prompt
    var reqBody RequestBody
    err := json.NewDecoder(r.Body).Decode(&reqBody)
    if err != nil || reqBody.Prompt == "" {
        http.Error(w, "Invalid input. Expected a JSON body with a 'prompt' field.", http.StatusBadRequest)
        return
    }

    // Create a new OpenAI client
    client := openai.NewClient(apiKey)

    // Create the chat completion request with the prompt from the request body
    completionRequest := openai.ChatCompletionRequest{
        Model: "gpt-3.5-turbo", // Use GPT-3.5 Turbo model
        Messages: []openai.ChatCompletionMessage{
            {Role: "user", Content: reqBody.Prompt},
        },
    }

    // Send the request to OpenAI
    resp, err := client.CreateChatCompletion(context.Background(), completionRequest)
    if err != nil {
        log.Printf("OpenAI request error: %v", err)
        http.Error(w, "Failed to get response from OpenAI", http.StatusInternalServerError)
        return
    }

    // Write the response from OpenAI to the HTTP output
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(resp.Choices[0].Message.Content))
}
