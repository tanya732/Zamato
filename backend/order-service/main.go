package main

import (
	"log"
	"net/http"
	"order-service/handler"
	"order-service/middleware"
	"order-service/models"
	"order-service/repository"
	"order-service/service"
	"os"

	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Database connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=glassbreak password=glassbreak dbname=glassbreak port=5432 sslmode=disable"
		log.Println("DATABASE_URL not set, using glassbreak fallback config")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate models
	if err := db.AutoMigrate(&models.Order{}, &models.OrderItem{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Initialize layers
	orderRepo := repository.NewOrderRepository(db)
	orderService := service.NewOrderService(orderRepo)
	orderHandler := handler.NewOrderHandler(orderService)

	// Setup router
	r := mux.NewRouter()

	// API versioning
	api := r.PathPrefix("/api/v1").Subrouter()

	// Middleware
	api.Use(middleware.AuthMiddleware)
	api.Use(middleware.LoggingMiddleware)

	// Order routes
	api.HandleFunc("/checkout", orderHandler.Checkout).Methods("POST")
	api.HandleFunc("/orders", orderHandler.GetOrderHistory).Methods("GET")
	api.HandleFunc("/orders/{id}", orderHandler.GetOrderById).Methods("GET")
	api.HandleFunc("/orders/{id}/status", orderHandler.UpdateOrderStatus).Methods("PATCH")

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Server configuration
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	// Start server
	log.Printf("Starting order-service on port %s", port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal("Server failed to start order-service:", err)
	}
}
