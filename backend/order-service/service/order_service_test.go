package service

import (
	"errors"
	"order-service/mocks"
	"order-service/models"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
)

func TestOrderService_CreateOrder(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	tests := []struct {
		name        string
		items       []models.OrderItem
		mockSetup   func(m *mocks.MockOrderRepository)
		wantErr     bool
		errContains string
	}{
		{
			name:  "success",
			items: []models.OrderItem{{MenuItemID: 1, Quantity: 2, Price: 10}},
			mockSetup: func(m *mocks.MockOrderRepository) {
				m.EXPECT().
					Create(gomock.Any()).
					DoAndReturn(func(order *models.Order) error {
						order.ID = 1
						return nil
					})
			},
		},
		{
			name:        "no items",
			items:       []models.OrderItem{},
			mockSetup:   func(m *mocks.MockOrderRepository) {},
			wantErr:     true,
			errContains: "at least one item",
		},
		{
			name:        "invalid quantity",
			items:       []models.OrderItem{{MenuItemID: 1, Quantity: 0, Price: 10}},
			mockSetup:   func(m *mocks.MockOrderRepository) {},
			wantErr:     true,
			errContains: "invalid item quantity or price",
		},
		{
			name:  "repo error",
			items: []models.OrderItem{{MenuItemID: 1, Quantity: 1, Price: 10}},
			mockSetup: func(m *mocks.MockOrderRepository) {
				m.EXPECT().
					Create(gomock.Any()).
					Return(errors.New("db error"))
			},
			wantErr:     true,
			errContains: "db error",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := mocks.NewMockOrderRepository(ctrl)
			if tt.mockSetup != nil {
				tt.mockSetup(mockRepo)
			}
			svc := NewOrderService(mockRepo)
			order, err := svc.CreateOrder(1, tt.items, "addr")
			if tt.wantErr {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.errContains)
				assert.Nil(t, order)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, order)
				assert.Equal(t, "addr", order.DeliveryAddress)
			}
		})
	}
}

func TestOrderService_GetOrderHistory(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := mocks.NewMockOrderRepository(ctrl)
	mockRepo.EXPECT().
		GetUserOrders(uint(1)).
		Return([]models.Order{{ID: 1, UserID: 1}}, nil)
	svc := NewOrderService(mockRepo)
	orders, err := svc.GetOrderHistory(1)
	assert.NoError(t, err)
	assert.Len(t, orders, 1)
}

func TestOrderService_GetOrder(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := mocks.NewMockOrderRepository(ctrl)
	mockRepo.EXPECT().
		GetByID(uint(1)).
		Return(&models.Order{ID: 1}, nil)
	mockRepo.EXPECT().
		GetByID(uint(2)).
		Return(nil, errors.New("not found"))
	svc := NewOrderService(mockRepo)
	order, err := svc.GetOrder(1)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), order.ID)
	order, err = svc.GetOrder(2)
	assert.Error(t, err)
	assert.Nil(t, order)
}

func TestOrderService_UpdateOrderStatus(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := mocks.NewMockOrderRepository(ctrl)
	mockRepo.EXPECT().
		UpdateStatus(uint(1), models.StatusDelivered).
		Return(nil)
	mockRepo.EXPECT().
		UpdateStatus(uint(2), models.StatusDelivered).
		Return(errors.New("not found"))
	svc := NewOrderService(mockRepo)
	err := svc.UpdateOrderStatus(1, models.StatusDelivered)
	assert.NoError(t, err)
	err = svc.UpdateOrderStatus(2, models.StatusDelivered)
	assert.Error(t, err)
}

func TestOrderService_ProcessPayment(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	tests := []struct {
		name        string
		paymentID   string
		mockSetup   func(m *mocks.MockOrderRepository)
		wantErr     bool
		errContains string
	}{
		{
			name:      "success",
			paymentID: "pay_123",
			mockSetup: func(m *mocks.MockOrderRepository) {
				m.EXPECT().
					UpdatePayment(uint(1), "pay_123").
					Return(nil)
			},
		},
		{
			name:        "missing paymentID",
			paymentID:   "",
			mockSetup:   func(m *mocks.MockOrderRepository) {},
			wantErr:     true,
			errContains: "paymentID required",
		},
		{
			name:      "repo error",
			paymentID: "pay_123",
			mockSetup: func(m *mocks.MockOrderRepository) {
				m.EXPECT().
					UpdatePayment(uint(1), "pay_123").
					Return(errors.New("db error"))
			},
			wantErr:     true,
			errContains: "db error",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := mocks.NewMockOrderRepository(ctrl)
			if tt.mockSetup != nil {
				tt.mockSetup(mockRepo)
			}
			svc := NewOrderService(mockRepo)
			err := svc.ProcessPayment(1, tt.paymentID)
			if tt.wantErr {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.errContains)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
