# Stage 1: Build the Go app for auth-service
FROM golang:1.23 AS auth-builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/auth-service ./cmd/auth-service

# Stage 2: Build the Go app for openai-service
FROM golang:1.23 AS openai-builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/openai-service ./cmd/openai-service

# Stage 3: Create a minimal image for production for auth-service
FROM alpine:latest AS auth-service
WORKDIR /root/

# Copy the .env file (if needed)
COPY --from=auth-builder /app/.env .

ENV JWT_SECRET=jwt

COPY --from=auth-builder /app/auth-service .
EXPOSE 8080
CMD ["./auth-service"]

# Stage 4: Create a minimal image for production for openai-service
FROM alpine:latest AS openai-service
WORKDIR /root/

COPY --from=openai-builder /app/.env .

COPY --from=openai-builder /app/openai-service .
EXPOSE 80 
CMD ["./openai-service"]
