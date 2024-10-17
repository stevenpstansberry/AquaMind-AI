package openai

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "os"
    "sync"
    "time"

    openai "github.com/sashabaranov/go-openai"
)

// RequestBody represents the structure of the incoming request with a messages array.
type RequestBody struct {
    Messages []openai.ChatCompletionMessage `json:"messages"`
}

// ResponseBody represents the structure of the response sent back to the client.
type ResponseBody struct {
    Content string `json:"content"`
}

// Structure to track requests for rate limiting
type RequestInfo struct {
    LastRequestTime time.Time
    RequestTimes    []time.Time
}

// Global rate limiter to track user requests (by IP address)
var requestTracker = sync.Map{}

const maxTokens = 150                    // Limit tokens per response
const rateLimitDuration = 5 * time.Second // Allow one request per user per duration
const maxRequestsPerHour = 25            // Max number of requests allowed per hour

// HandleQuery processes requests to interact with the OpenAI API using the official Go SDK.
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

    // Rate limiting by user IP
    userIP := r.RemoteAddr
    if !allowRequest(userIP) {
        http.Error(w, "Too many requests. Please wait before sending another request.", http.StatusTooManyRequests)
        return
    }

    // Parse the request body to get the messages
    var reqBody RequestBody
    err := json.NewDecoder(r.Body).Decode(&reqBody)
    if err != nil || len(reqBody.Messages) == 0 {
        http.Error(w, "Invalid input. Expected a JSON body with a 'messages' field.", http.StatusBadRequest)
        return
    }

    // Create a new OpenAI client
    client := openai.NewClient(apiKey)

    // Create the chat completion request with the messages from the request body and token limit
    completionRequest := openai.ChatCompletionRequest{
        Model:     "gpt-3.5-turbo", // Use GPT-3.5 Turbo model
        Messages:  reqBody.Messages,
        MaxTokens: maxTokens,
    }

    // Send the request to OpenAI
    resp, err := client.CreateChatCompletion(context.Background(), completionRequest)
    if err != nil {
        log.Printf("OpenAI request error: %v", err)
        http.Error(w, "Failed to get response from OpenAI", http.StatusInternalServerError)
        return
    }

    // Prepare the response
    responseBody := ResponseBody{
        Content: resp.Choices[0].Message.Content,
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(responseBody)
}

// allowRequest checks if a request is allowed based on the rate limit for the user
func allowRequest(userIP string) bool {
    now := time.Now()

    value, ok := requestTracker.Load(userIP)
    var info RequestInfo
    if ok {
        info = value.(RequestInfo)
        // Check if the request is within the rate limit duration
        if now.Sub(info.LastRequestTime) < rateLimitDuration {
            return false // Deny if within the rate limit duration
        }

        // Filter out timestamps older than 1 hour
        filteredTimes := []time.Time{}
        for _, t := range info.RequestTimes {
            if now.Sub(t) < time.Hour {
                filteredTimes = append(filteredTimes, t)
            }
        }

        // Update the request times with the filtered list
        info.RequestTimes = filteredTimes

        // Check if the number of requests in the last hour exceeds the maximum allowed
        if len(info.RequestTimes) >= maxRequestsPerHour {
            return false // Deny if the user has exceeded the limit
        }
    } else {
        // Initialize a new entry for this user IP if not found
        info = RequestInfo{}
    }

    // Add the current request time to the list
    info.RequestTimes = append(info.RequestTimes, now)
    info.LastRequestTime = now

    // Store the updated info back to the map
    requestTracker.Store(userIP, info)
    return true
}
