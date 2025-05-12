# Use official Golang image as the build environment
FROM golang:1.23 as builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o payment-service .

# Start a new stage from scratch
FROM alpine:latest

WORKDIR /app

# Install necessary certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Copy the pre-built binary file from the previous stage
COPY --from=builder /app/payment-service .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./payment-service"]

# Note: Ensure Postgres is running and accessible for the application.
