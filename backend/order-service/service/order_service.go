package service

import (
	"errors"
	"order-service/models"
	"order-service/repository"
)

type OrderService interface {
	CreateOrder(userID uint, items []models.OrderItem, address string) (*models.Order, error)
	GetOrderHistory(userID uint) ([]models.Order, error)
	GetOrder(id uint) (*models.Order, error)
	UpdateOrderStatus(id uint, status models.OrderStatus) error
	ProcessPayment(orderID uint, paymentID string) error
}

type orderService struct {
	repo repository.OrderRepository
}

func NewOrderService(repo repository.OrderRepository) OrderService {
	return &orderService{repo: repo}
}

func (s *orderService) CreateOrder(userID uint, items []models.OrderItem, address string) (*models.Order, error) {
	if len(items) == 0 {
		return nil, errors.New("order must have at least one item")
	}
	var total float64
	for i := range items {
		if items[i].Quantity <= 0 || items[i].Price < 0 {
			return nil, errors.New("invalid item quantity or price")
		}
		total += float64(items[i].Quantity) * items[i].Price
	}
	order := &models.Order{
		UserID:         userID,
		OrderItems:     items,
		TotalAmount:    total,
		Status:         models.StatusPending,
		DeliveryAddress: address,
	}
	if err := s.repo.Create(order); err != nil {
		return nil, err
	}
	return order, nil
}

func (s *orderService) GetOrderHistory(userID uint) ([]models.Order, error) {
	return s.repo.GetUserOrders(userID)
}

func (s *orderService) GetOrder(id uint) (*models.Order, error) {
	return s.repo.GetByID(id)
}

func (s *orderService) UpdateOrderStatus(id uint, status models.OrderStatus) error {
	return s.repo.UpdateStatus(id, status)
}

func (s *orderService) ProcessPayment(orderID uint, paymentID string) error {
	if paymentID == "" {
		return errors.New("paymentID required")
	}
	return s.repo.UpdatePayment(orderID, paymentID)
}
