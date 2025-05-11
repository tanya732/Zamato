package main

import (
	"log"
	"net/http"
	"os"

	"payment-service/external"
	"payment-service/handler"
	"payment-service/models"
	"payment-service/repository"
	"payment-service/service"

	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=glassbreak password=glassbreak dbname=glassbreak port=5432 sslmode=disable"
		log.Println("DATABASE_URL not set, using glassbreak fallback config")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	if err := db.AutoMigrate(&models.Payment{}, &models.Refund{}); err != nil {
		log.Fatalf("Failed to automigrate database: %v", err)
	}

	repo := repository.NewPaymentRepository(db)
	gateway := &external.DummyGateway{}
	svc := service.NewPaymentService(repo, gateway)
	h := handler.NewPaymentHandler(svc)

	r := mux.NewRouter()
	r.HandleFunc("/payments", h.CreatePayment).Methods("POST")
	r.HandleFunc("/payments/{id}", h.GetPayment).Methods("GET")
	r.HandleFunc("/payments", h.ListPayments).Methods("GET").Queries("order_id", "{order_id}")
	r.HandleFunc("/payments/{id}/refund", h.InitiateRefund).Methods("POST")
	r.HandleFunc("/payments/{id}/refund", h.GetRefundStatus).Methods("GET")
	r.HandleFunc("/payments/webhook", h.PaymentWebhook).Methods("POST")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting payment-service on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
