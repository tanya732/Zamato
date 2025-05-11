package contracts

import (
	"io"
	"payment-service/models"
)

type PaymentService interface {
	CreatePayment(payment *models.Payment) error
	GetPayment(id string) (*models.Payment, error)
	ListPaymentsByOrder(orderID string) ([]*models.Payment, error)
	InitiateRefund(paymentID string) (*models.Refund, error)
	GetRefundStatus(paymentID string) (*models.Refund, error)
	HandleWebhook(body io.Reader) error
}

type PaymentRepository interface {
	Save(payment *models.Payment) error
	FindByID(id string) (*models.Payment, error)
	FindByOrderID(orderID string) ([]*models.Payment, error)
	SaveRefund(refund *models.Refund) error
	FindRefundByPaymentID(paymentID string) (*models.Refund, error)
	UpdatePaymentStatus(id, status string) error
}
