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

const maxTokens = 150                     // Limit tokens per response
const rateLimitDuration = 5 * time.Second // Allow one request per user per duration
const maxRequestsPerHour = 25             // Max number of requests allowed per hour

// HandleQuery processes requests to interact with the OpenAI API using the official Go SDK.
func HandleQuery(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received request: method=%s, URL=%s, userIP=%s", r.Method, r.URL.Path, r.RemoteAddr)

	if r.Method != http.MethodPost {
		log.Printf("Invalid request method: %s", r.Method)
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		log.Println("Error: OPENAI_API_KEY environment variable not set")
		http.Error(w, "API key not set", http.StatusInternalServerError)
		return
	}

	// Rate limiting by user IP
	userIP := r.RemoteAddr
	if !allowRequest(userIP) {
		log.Printf("Rate limit exceeded for userIP=%s", userIP)
		http.Error(w, "Too many requests. Please wait before sending another request.", http.StatusTooManyRequests)
		return
	}

	// Parse the request body to get the messages
	var reqBody RequestBody
	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil || len(reqBody.Messages) == 0 {
		log.Printf("Invalid input from userIP=%s: error=%v, body=%v", userIP, err, reqBody)
		http.Error(w, "Invalid input. Expected a JSON body with a 'messages' field.", http.StatusBadRequest)
		return
	}
	log.Printf("Parsed request body from userIP=%s successfully", userIP)

	// Create a new OpenAI client
	client := openai.NewClient(apiKey)
	log.Printf("Creating OpenAI completion request for userIP=%s", userIP)

	// Create the chat completion request with the messages from the request body and token limit
	completionRequest := openai.ChatCompletionRequest{
		Model:     "gpt-3.5-turbo", // Use GPT-3.5 Turbo model
		Messages:  reqBody.Messages,
		MaxTokens: maxTokens,
	}

	// Send the request to OpenAI
	startTime := time.Now()
	resp, err := client.CreateChatCompletion(context.Background(), completionRequest)
	duration := time.Since(startTime)
	if err != nil {
		log.Printf("OpenAI request error for userIP=%s: error=%v, duration=%v", userIP, err, duration)
		http.Error(w, "Failed to get response from OpenAI", http.StatusInternalServerError)
		return
	}
	log.Printf("OpenAI request completed successfully for userIP=%s, duration=%v", userIP, duration)

	// Prepare the response
	responseBody := ResponseBody{
		Content: resp.Choices[0].Message.Content,
	}
	log.Printf("Sending response to userIP=%s: content=%s", userIP, responseBody.Content)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(responseBody)
	if err != nil {
		log.Printf("Error encoding response for userIP=%s: error=%v", userIP, err)
	}
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
			log.Printf("Request denied for userIP=%s due to rate limit duration", userIP)
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
			log.Printf("Request denied for userIP=%s due to hourly rate limit", userIP)
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
	log.Printf("Request allowed for userIP=%s", userIP)
	return true
}
