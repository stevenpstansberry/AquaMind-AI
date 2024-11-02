# Stage 1: Build the Go app
FROM golang:1.23 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/auth-service ./cmd/auth-service

# Stage 2: Create a minimal image for production
FROM alpine:latest
WORKDIR /root/

# Copy the .env file (if needed)
COPY --from=builder /app/.env .

ENV JWT_SECRET=jwt

COPY --from=builder /app/auth-service .
EXPOSE 8080
CMD ["./auth-service"]
