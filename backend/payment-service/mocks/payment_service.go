package mocks

import (
	"io"
	"payment-service/models"
)

type MockPaymentService struct {
	// ...mock fields...
}

func (m *MockPaymentService) CreatePayment(payment *models.Payment) error {
	// ...mock logic...
	return nil
}

func (m *MockPaymentService) GetPayment(id string) (*models.Payment, error) {
	// ...mock logic...
	return nil, nil
}

func (m *MockPaymentService) ListPaymentsByOrder(orderID string) ([]*models.Payment, error) {
	// ...mock logic...
	return []*models.Payment{}, nil
}

func (m *MockPaymentService) InitiateRefund(paymentID string) (*models.Refund, error) {
	// ...mock logic...
	return &models.Refund{}, nil
}

func (m *MockPaymentService) GetRefundStatus(paymentID string) (*models.Refund, error) {
	// ...mock logic...
	return &models.Refund{}, nil
}

func (m *MockPaymentService) HandleWebhook(body io.Reader) error {
	// ...mock logic...
	return nil
}
