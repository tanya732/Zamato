package contracts

import "order-service/models"

type CheckoutRequest struct {
	Items   []models.OrderItem `json:"items"`
	Address string             `json:"delivery_address"`
}

type CheckoutResponse struct {
	OrderID string `json:"order_id"`
}

type UpdateOrderStatusRequest struct {
	Status models.OrderStatus `json:"status"`
}

type ProcessPaymentRequest struct {
	PaymentID string `json:"payment_id"`
}

type PaymentRequest struct {
	OrderID string  `json:"order_id"`
	Amount  float64 `json:"amount"`
}

type PaymentResponse struct {
	PaymentID string `json:"payment_id"`
	Status    string `json:"status"`
}
