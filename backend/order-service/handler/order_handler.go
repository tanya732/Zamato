package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"order-service/contracts"
	"order-service/service"

	"github.com/gorilla/mux"
)

type OrderHandler struct {
	service service.OrderService
}

func NewOrderHandler(service service.OrderService) *OrderHandler {
	return &OrderHandler{service: service}
}

func (h *OrderHandler) Checkout(w http.ResponseWriter, r *http.Request) {
	var request contracts.CheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	userID, ok := r.Context().Value("userID").(uint)
	if !ok {
		http.Error(w, "userID not found in context", http.StatusUnauthorized)
		return
	}
	order, err := h.service.CreateOrder(userID, request.Items, request.Address)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(contracts.CheckoutResponse{
		OrderID: strconv.FormatUint(order.ID, 10),
	})
}

func (h *OrderHandler) GetOrderHistory(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(uint)
	if !ok {
		http.Error(w, "userID not found in context", http.StatusUnauthorized)
		return
	}
	orders, err := h.service.GetOrderHistory(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

func (h *OrderHandler) GetOrderById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID := vars["id"]

	if _, err := strconv.ParseUint(orderID, 10, 64); err != nil {
		http.Error(w, "invalid order id", http.StatusBadRequest)
		return
	}

	order, err := h.service.GetOrder(orderID)
	if err != nil {
		if err.Error() == "record not found" {
			http.Error(w, "order not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

func (h *OrderHandler) UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID := vars["id"]

	if _, err := strconv.ParseUint(orderID, 10, 64); err != nil {
		http.Error(w, "invalid order id", http.StatusBadRequest)
		return
	}

	var req contracts.UpdateOrderStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateOrderStatus(orderID, req.Status); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *OrderHandler) ProcessPayment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID := vars["orderId"]

	if _, err := strconv.ParseUint(orderID, 10, 64); err != nil {
		http.Error(w, "invalid order id", http.StatusBadRequest)
		return
	}

	var req contracts.ProcessPaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.ProcessPayment(orderID, req.PaymentID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
