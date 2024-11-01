# Use the official Golang image as the base image for building
FROM golang:1.20 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o auth-service ./cmd/auth-service/main.go

# Use a minimal Alpine image for the final container
FROM alpine:latest

# Set environment variables (for example, port configuration if required)
ENV PORT=8080

# Copy the compiled binary from the builder stage
COPY --from=builder /app/auth-service /auth-service

# Copy .env if you need environment variables for the app at runtime
COPY cmd/auth-service/.env .env

# Expose the service port
EXPOSE 8080

# Run the application
CMD ["/auth-service"]
