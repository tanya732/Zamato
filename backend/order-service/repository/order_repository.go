package repository

import (
	"order-service/models"
	"strconv"

	"gorm.io/gorm"
)

type OrderRepository interface {
	Create(order *models.Order) error
	GetByID(id string) (*models.Order, error) // Changed id type to string
	GetUserOrders(userID uint) ([]models.Order, error)
	UpdateStatus(id string, status models.OrderStatus) error // Changed id type to string
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

func (r *orderRepository) GetByID(id string) (*models.Order, error) {
	orderID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return nil, err
	}

	var order models.Order
	if err := r.db.Preload("OrderItems").First(&order, orderID).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) GetUserOrders(userID uint) ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Where("user_id = ?", userID).Preload("OrderItems").Order("created_at desc").Find(&orders).Error
	return orders, err
}

func (r *orderRepository) UpdateStatus(id string, status models.OrderStatus) error {
	orderID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return err
	}
	return r.db.Model(&models.Order{}).Where("id = ?", orderID).Update("status", status).Error
}
