package repository

import (
	"payment-service/models"

	"gorm.io/gorm"
)

// PaymentRepository defines the repository interface for payment persistence.
type PaymentRepository interface {
	Save(payment *models.Payment) error
	FindByID(id string) (*models.Payment, error)
	FindByOrderID(orderID string) ([]*models.Payment, error)
	SaveRefund(refund *models.Refund) error
	FindRefundByPaymentID(paymentID string) (*models.Refund, error)
	UpdatePaymentStatus(id, status string) error
}

type paymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) PaymentRepository {
	return &paymentRepository{db: db}
}

func (r *paymentRepository) Save(payment *models.Payment) error {
	return r.db.Create(payment).Error
}

func (r *paymentRepository) FindByID(id string) (*models.Payment, error) {
	var p models.Payment
	if err := r.db.First(&p, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *paymentRepository) FindByOrderID(orderID string) ([]*models.Payment, error) {
	var result []*models.Payment
	if err := r.db.Where("order_id = ?", orderID).Find(&result).Error; err != nil {
		return nil, err
	}
	return result, nil
}

func (r *paymentRepository) SaveRefund(refund *models.Refund) error {
	return r.db.Create(refund).Error
}

func (r *paymentRepository) FindRefundByPaymentID(paymentID string) (*models.Refund, error) {
	var ref models.Refund
	if err := r.db.First(&ref, "payment_id = ?", paymentID).Error; err != nil {
		return nil, err
	}
	return &ref, nil
}

func (r *paymentRepository) UpdatePaymentStatus(id, status string) error {
	return r.db.Model(&models.Payment{}).Where("id = ?", id).Update("status", status).Error
}
