package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"order-service/mocks"
	"order-service/models"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
)

func withUserID(ctx context.Context, userID uint) context.Context {
	return context.WithValue(ctx, "userID", userID)
}

func TestOrderHandler_Checkout(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	tests := []struct {
		name           string
		userID         interface{}
		body           interface{}
		mockSetup      func(m *mocks.MockOrderService)
		wantStatus     int
		wantErrContain string
	}{
		{
			name:   "success",
			userID: uint(1),
			body: map[string]interface{}{
				"items":            []models.OrderItem{{MenuItemID: 1, Quantity: 2, Price: 10}},
				"delivery_address": "addr",
			},
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					CreateOrder(uint(1), []models.OrderItem{{MenuItemID: 1, Quantity: 2, Price: 10}}, "addr").
					Return(&models.Order{ID: 1, UserID: 1, OrderItems: []models.OrderItem{{MenuItemID: 1, Quantity: 2, Price: 10}}, DeliveryAddress: "addr"}, nil)
			},
			wantStatus: http.StatusOK,
		},
		{
			name:           "invalid body",
			userID:         uint(1),
			body:           "invalid-json",
			mockSetup:      func(m *mocks.MockOrderService) {},
			wantStatus:     http.StatusBadRequest,
			wantErrContain: "invalid character",
		},
		{
			name:           "missing userID",
			userID:         nil,
			body:           map[string]interface{}{"items": []models.OrderItem{}, "delivery_address": "addr"},
			mockSetup:      func(m *mocks.MockOrderService) {},
			wantStatus:     http.StatusUnauthorized,
			wantErrContain: "userID not found",
		},
		{
			name:   "service error",
			userID: uint(1),
			body:   map[string]interface{}{"items": []models.OrderItem{}, "delivery_address": "addr"},
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					CreateOrder(uint(1), []models.OrderItem{}, "addr").
					Return(nil, errors.New("order must have at least one item"))
			},
			wantStatus:     http.StatusBadRequest,
			wantErrContain: "order must have at least one item",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSvc := mocks.NewMockOrderService(ctrl)
			if tt.mockSetup != nil {
				tt.mockSetup(mockSvc)
			}
			var bodyBytes []byte
			switch v := tt.body.(type) {
			case string:
				bodyBytes = []byte(v)
			default:
				bodyBytes, _ = json.Marshal(tt.body)
			}
			req := httptest.NewRequest("POST", "/checkout", bytes.NewReader(bodyBytes))
			if tt.userID != nil {
				req = req.WithContext(withUserID(req.Context(), tt.userID.(uint)))
			}
			rr := httptest.NewRecorder()
			h := NewOrderHandler(mockSvc)
			h.Checkout(rr, req)
			assert.Equal(t, tt.wantStatus, rr.Code)
			if tt.wantErrContain != "" {
				assert.Contains(t, rr.Body.String(), tt.wantErrContain)
			}
		})
	}
}

func TestOrderHandler_GetOrderHistory(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	tests := []struct {
		name           string
		userID         interface{}
		mockSetup      func(m *mocks.MockOrderService)
		wantStatus     int
		wantErrContain string
	}{
		{
			name:   "success",
			userID: uint(1),
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					GetOrderHistory(uint(1)).
					Return([]models.Order{{ID: 1, UserID: 1}}, nil)
			},
			wantStatus: http.StatusOK,
		},
		{
			name:           "missing userID",
			userID:         nil,
			mockSetup:      func(m *mocks.MockOrderService) {},
			wantStatus:     http.StatusUnauthorized,
			wantErrContain: "userID not found",
		},
		{
			name:   "service error",
			userID: uint(1),
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					GetOrderHistory(uint(1)).
					Return(nil, errors.New("db error"))
			},
			wantStatus:     http.StatusInternalServerError,
			wantErrContain: "db error",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSvc := mocks.NewMockOrderService(ctrl)
			if tt.mockSetup != nil {
				tt.mockSetup(mockSvc)
			}
			req := httptest.NewRequest("GET", "/orders", nil)
			if tt.userID != nil {
				req = req.WithContext(withUserID(req.Context(), tt.userID.(uint)))
			}
			rr := httptest.NewRecorder()
			h := NewOrderHandler(mockSvc)
			h.GetOrderHistory(rr, req)
			assert.Equal(t, tt.wantStatus, rr.Code)
			if tt.wantErrContain != "" {
				assert.Contains(t, rr.Body.String(), tt.wantErrContain)
			}
		})
	}
}

func TestOrderHandler_GetOrderById(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	tests := []struct {
		name           string
		id             string
		mockSetup      func(m *mocks.MockOrderService)
		wantStatus     int
		wantErrContain string
	}{
		{
			name: "success",
			id:   "1",
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					GetOrder("1").
					Return(&models.Order{ID: 1, UserID: 1}, nil)
			},
			wantStatus: http.StatusOK,
		},
		{
			name:           "invalid id",
			id:             "abc",
			mockSetup:      func(m *mocks.MockOrderService) {},
			wantStatus:     http.StatusBadRequest,
			wantErrContain: "invalid order id",
		},
		{
			name: "not found",
			id:   "999",
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					GetOrder("999").
					Return(nil, errors.New("record not found"))
			},
			wantStatus:     http.StatusNotFound,
			wantErrContain: "order not found",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSvc := mocks.NewMockOrderService(ctrl)
			if tt.mockSetup != nil {
				tt.mockSetup(mockSvc)
			}
			req := httptest.NewRequest("GET", "/orders/"+tt.id, nil)
			rr := httptest.NewRecorder()
			h := NewOrderHandler(mockSvc)
			vars := map[string]string{"id": tt.id}
			req = mux.SetURLVars(req, vars)
			h.GetOrderById(rr, req)
			assert.Equal(t, tt.wantStatus, rr.Code)
			if tt.wantErrContain != "" {
				assert.Contains(t, rr.Body.String(), tt.wantErrContain)
			}
		})
	}
}

func TestOrderHandler_UpdateOrderStatus(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	tests := []struct {
		name           string
		id             string
		body           interface{}
		mockSetup      func(m *mocks.MockOrderService)
		wantStatus     int
		wantErrContain string
	}{
		{
			name: "success",
			id:   "1",
			body: map[string]interface{}{"status": models.StatusDelivered},
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					UpdateOrderStatus("1", models.StatusDelivered).
					Return(nil)
			},
			wantStatus: http.StatusNoContent,
		},
		{
			name:           "invalid id",
			id:             "abc",
			body:           map[string]interface{}{"status": models.StatusDelivered},
			mockSetup:      func(m *mocks.MockOrderService) {},
			wantStatus:     http.StatusBadRequest,
			wantErrContain: "invalid order id",
		},
		{
			name:           "invalid body",
			id:             "1",
			body:           "invalid-json",
			mockSetup:      func(m *mocks.MockOrderService) {},
			wantStatus:     http.StatusBadRequest,
			wantErrContain: "invalid character",
		},
		{
			name: "service error",
			id:   "1",
			body: map[string]interface{}{"status": models.StatusDelivered},
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					UpdateOrderStatus("1", models.StatusDelivered).
					Return(errors.New("update error"))
			},
			wantStatus:     http.StatusInternalServerError,
			wantErrContain: "update error",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSvc := mocks.NewMockOrderService(ctrl)
			if tt.mockSetup != nil {
				tt.mockSetup(mockSvc)
			}
			var bodyBytes []byte
			switch v := tt.body.(type) {
			case string:
				bodyBytes = []byte(v)
			default:
				bodyBytes, _ = json.Marshal(tt.body)
			}
			req := httptest.NewRequest("PUT", "/orders/"+tt.id+"/status", bytes.NewReader(bodyBytes))
			rr := httptest.NewRecorder()
			h := NewOrderHandler(mockSvc)
			vars := map[string]string{"id": tt.id}
			req = mux.SetURLVars(req, vars)
			h.UpdateOrderStatus(rr, req)
			assert.Equal(t, tt.wantStatus, rr.Code)
			if tt.wantErrContain != "" {
				assert.Contains(t, rr.Body.String(), tt.wantErrContain)
			}
		})
	}
}

func TestOrderHandler_ProcessPayment(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	tests := []struct {
		name           string
		orderID        string
		body           interface{}
		mockSetup      func(m *mocks.MockOrderService)
		wantStatus     int
		wantErrContain string
	}{
		{
			name:    "success",
			orderID: "1",
			body:    map[string]interface{}{"payment_id": "pay_123"},
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					ProcessPayment("1", "pay_123").
					Return(nil)
			},
			wantStatus: http.StatusNoContent,
		},
		{
			name:           "invalid order id",
			orderID:        "abc",
			body:           map[string]interface{}{"payment_id": "pay_123"},
			mockSetup:      func(m *mocks.MockOrderService) {},
			wantStatus:     http.StatusBadRequest,
			wantErrContain: "invalid order id",
		},
		{
			name:           "invalid body",
			orderID:        "1",
			body:           "invalid-json",
			mockSetup:      func(m *mocks.MockOrderService) {},
			wantStatus:     http.StatusBadRequest,
			wantErrContain: "invalid character",
		},
		{
			name:    "service error",
			orderID: "1",
			body:    map[string]interface{}{"payment_id": "pay_123"},
			mockSetup: func(m *mocks.MockOrderService) {
				m.EXPECT().
					ProcessPayment("1", "pay_123").
					Return(errors.New("payment error"))
			},
			wantStatus:     http.StatusInternalServerError,
			wantErrContain: "payment error",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSvc := mocks.NewMockOrderService(ctrl)
			if tt.mockSetup != nil {
				tt.mockSetup(mockSvc)
			}
			var bodyBytes []byte
			switch v := tt.body.(type) {
			case string:
				bodyBytes = []byte(v)
			default:
				bodyBytes, _ = json.Marshal(tt.body)
			}
			req := httptest.NewRequest("POST", "/orders/"+tt.orderID+"/payment", bytes.NewReader(bodyBytes))
			rr := httptest.NewRecorder()
			h := NewOrderHandler(mockSvc)
			vars := map[string]string{"orderId": tt.orderID}
			req = mux.SetURLVars(req, vars)
			h.ProcessPayment(rr, req) // Call the handler
			assert.Equal(t, tt.wantStatus, rr.Code)
			if tt.wantErrContain != "" {
				assert.Contains(t, rr.Body.String(), tt.wantErrContain)
			}
		})
	}
}
