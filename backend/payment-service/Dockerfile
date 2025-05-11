# Use official Golang image as the build environment
FROM golang:1.21-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN go build -o payment-service .

# Start a new stage from scratch
FROM alpine:latest

WORKDIR /app

# Copy the pre-built binary file from the previous stage
COPY --from=builder /app/payment-service .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the executable
CMD ["./payment-service"]
