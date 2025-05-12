# Use the official Golang image as the base image
FROM golang:1.23 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Go modules manifests
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o order-service .

# Use a minimal image for the final container
FROM alpine:latest

# Install necessary certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Install Postgres dependency
RUN apk --no-cache add postgresql-client

# Set the working directory inside the container
WORKDIR /root/

# Copy the built binary from the builder stage
COPY --from=builder /app/order-service .

# Expose the port the service listens on
EXPOSE 8080

# Command to run the application
CMD ["./order-service"]
