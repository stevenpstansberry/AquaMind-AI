# Stage 1: Build the Go application
FROM golang:1.18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files first to cache the dependencies.
COPY go.mod go.sum ./

# Download the Go module dependencies
RUN go mod download

# Copy the rest of the application source code into the container
COPY . .

# Build the Go application
RUN go build -o main .

# Stage 2: Create a minimal image for production
FROM alpine:latest

# Set the working directory inside the container
WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /app/main .

# Expose the port your Go application runs on
EXPOSE 8000

# Run the Go binary
CMD ["./main"]
