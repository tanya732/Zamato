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
	service := NewOrderService(mockRepo)

	t.Run("success", func(t *testing.T) {
		expectedOrder := &models.Order{
			ID:     1,
			UserID: 1,
		}
		mockRepo.EXPECT().GetByID("1").Return(expectedOrder, nil)
		order, err := service.GetOrder("1")
		assert.NoError(t, err)
		assert.Equal(t, expectedOrder, order)
	})

	t.Run("not found", func(t *testing.T) {
		mockRepo.EXPECT().GetByID("2").Return(nil, errors.New("record not found"))
		order, err := service.GetOrder("2")
		assert.Error(t, err)
		assert.Nil(t, order)
		assert.Contains(t, err.Error(), "record not found")
	})
}
