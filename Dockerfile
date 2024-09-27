# Use the official Golang image for building the application
FROM golang:1.22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Install git for fetching dependencies
RUN apk update && apk add --no-cache git

# Copy go.mod and go.sum files to the container and download dependencies
COPY go.mod go.sum ./

RUN go mod download

# Copy the entire project source code to the container
COPY . .

# Set the working directory to the location of the main.go file
WORKDIR /app/cmd/server

# Build the Go application, outputting the binary as 'xchat-client'
RUN go build -o /app/xchat-client .

# Use a minimal Alpine image to run the application
FROM alpine:latest

# Set the working directory inside the runtime container
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/xchat-client .

# Expose the application port
EXPOSE 8087

# Set the command to run the application
CMD ["./xchat-client"]