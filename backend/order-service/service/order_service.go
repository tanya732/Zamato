package service

import (
	"errors"
	"order-service/contracts"
	"order-service/external"
	"order-service/models"
	"order-service/repository"
	"strconv"
	"sync"

	"github.com/google/uuid"
)

type OrderService interface {
	CreateOrder(userID uint, items []models.OrderItem, address string) (*models.Order, error)
	GetOrderHistory(userID uint) ([]models.Order, error)
	GetOrder(orderID string) (*models.Order, error)
	UpdateOrderStatus(orderID string, status models.OrderStatus) error
	ProcessPayment(orderID string, paymentID string) error
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

	// Generate a unique OrderID as uint64
	orderID := uint64(uuid.New().ID())

	order := &models.Order{
		ID:              orderID,
		UserID:          userID,
		OrderItems:      items,
		TotalAmount:     total,
		Status:          models.StatusPending,
		DeliveryAddress: address,
	}

	var wg sync.WaitGroup
	var createErr error

	// Goroutine for creating the order in the repository
	wg.Add(1)
	go func() {
		defer wg.Done()
		createErr = s.repo.Create(order)
	}()

	// Goroutine for processing the payment
	wg.Add(1)
	go func() {
		defer wg.Done()
		paymentRequest := contracts.PaymentRequest{
			OrderID: strconv.FormatUint(orderID, 10), // Convert uint64 to string
			Amount:  total,
		}
		_, err := external.ProcessPayment("https://payment-service/pay", paymentRequest)
		if err != nil {
			// Log the error or handle it as needed
		}
	}()

	wg.Wait()

	if createErr != nil {
		return nil, createErr
	}

	return order, nil
}

func (s *orderService) GetOrderHistory(userID uint) ([]models.Order, error) {
	return s.repo.GetUserOrders(userID)
}

func (s *orderService) GetOrder(orderID string) (*models.Order, error) {
	return s.repo.GetByID(orderID)
}

func (s *orderService) UpdateOrderStatus(orderID string, status models.OrderStatus) error {
	return s.repo.UpdateStatus(orderID, status)
}

func (s *orderService) ProcessPayment(orderID string, paymentID string) error {
	order, err := s.repo.GetByID(orderID)
	if err != nil {
		return err
	}
	if order.Status != models.StatusPending {
		return errors.New("invalid order status")
	}
	// Optionally, update PaymentID if your model supports it
	// order.PaymentID = &paymentID
	// s.repo.UpdatePaymentID(orderID, paymentID) // If you have such a method

	return s.repo.UpdateStatus(orderID, models.StatusPaid)
}
