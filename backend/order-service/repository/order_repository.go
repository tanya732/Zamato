package repository

import (
	"order-service/models"

	"gorm.io/gorm"
)

type OrderRepository interface {
	Create(order *models.Order) error
	GetByID(id uint) (*models.Order, error)
	GetUserOrders(userID uint) ([]models.Order, error)
	UpdateStatus(id uint, status models.OrderStatus) error
	UpdatePayment(orderID uint, paymentID string) error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(order *models.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepository) GetByID(id uint) (*models.Order, error) {
	var order models.Order
	err := r.db.Preload("OrderItems").First(&order, id).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) GetUserOrders(userID uint) ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Where("user_id = ?", userID).Preload("OrderItems").Order("created_at desc").Find(&orders).Error
	return orders, err
}

func (r *orderRepository) UpdateStatus(id uint, status models.OrderStatus) error {
	return r.db.Model(&models.Order{}).Where("id = ?", id).Update("status", status).Error
}

func (r *orderRepository) UpdatePayment(orderID uint, paymentID string) error {
	return r.db.Model(&models.Order{}).Where("id = ?", orderID).Updates(map[string]interface{}{
		"payment_id": paymentID,
		"status":     models.StatusPaid,
	}).Error
}
