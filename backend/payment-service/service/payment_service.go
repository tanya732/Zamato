package service

import (
	"io"
	"payment-service/contracts"
	"payment-service/external"
	"payment-service/models"
	"time"
)

type paymentService struct {
	repo    contracts.PaymentRepository
	gateway external.PaymentGateway
}

func NewPaymentService(r contracts.PaymentRepository, g external.PaymentGateway) contracts.PaymentService {
	return &paymentService{repo: r, gateway: g}
}

func (s *paymentService) CreatePayment(payment *models.Payment) error {
	// Process payment using gateway
	txID, err := s.gateway.Process(payment.Amount)
	if err != nil {
		return err
	}
	payment.TransactionID = txID
	payment.Status = "completed"
	payment.CreatedAt = time.Now().Unix()
	return s.repo.Save(payment)
}

func (s *paymentService) GetPayment(id string) (*models.Payment, error) {
	return s.repo.FindByID(id)
}

func (s *paymentService) ListPaymentsByOrder(orderID string) ([]*models.Payment, error) {
	return s.repo.FindByOrderID(orderID)
}

func (s *paymentService) InitiateRefund(paymentID string) (*models.Refund, error) {
	payment, err := s.repo.FindByID(paymentID)
	if err != nil || payment == nil {
		return nil, err
	}
	refund := &models.Refund{
		ID:        "refund-id", // generate unique ID in real impl
		PaymentID: paymentID,
		Status:    "initiated",
		Amount:    payment.Amount,
		CreatedAt: time.Now().Unix(),
	}
	err = s.repo.SaveRefund(refund)
	return refund, err
}

func (s *paymentService) GetRefundStatus(paymentID string) (*models.Refund, error) {
	return s.repo.FindRefundByPaymentID(paymentID)
}

func (s *paymentService) HandleWebhook(body io.Reader) error {
	// ...parse webhook and update payment status...
	return nil
}
