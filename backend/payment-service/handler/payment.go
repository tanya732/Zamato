package handler

import (
	"encoding/json"
	"net/http"
	"payment-service/models"
	"payment-service/service"

	"github.com/gorilla/mux"
)

type PaymentHandler struct {
	service service.PaymentService
}

func NewPaymentHandler(s service.PaymentService) *PaymentHandler {
	return &PaymentHandler{service: s}
}

func (h *PaymentHandler) CreatePayment(w http.ResponseWriter, r *http.Request) {
	var payment models.Payment
	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	err := h.service.CreatePayment(&payment)
	if err != nil {
		http.Error(w, "Failed to create payment", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(payment)
}

func (h *PaymentHandler) GetPayment(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	payment, err := h.service.GetPayment(id)
	if err != nil || payment == nil {
		http.Error(w, "Payment not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(payment)
}

func (h *PaymentHandler) ListPayments(w http.ResponseWriter, r *http.Request) {
	orderID := r.URL.Query().Get("order_id")
	payments, err := h.service.ListPaymentsByOrder(orderID)
	if err != nil {
		http.Error(w, "Failed to list payments", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(payments)
}

func (h *PaymentHandler) InitiateRefund(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	refund, err := h.service.InitiateRefund(id)
	if err != nil {
		http.Error(w, "Failed to initiate refund", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(refund)
}

func (h *PaymentHandler) GetRefundStatus(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	refund, err := h.service.GetRefundStatus(id)
	if err != nil {
		http.Error(w, "Failed to get refund status", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(refund)
}

func (h *PaymentHandler) PaymentWebhook(w http.ResponseWriter, r *http.Request) {
	// Parse webhook payload and update payment status accordingly
	err := h.service.HandleWebhook(r.Body)
	if err != nil {
		http.Error(w, "Failed to process webhook", http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusOK)
}
