package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"payment-service/mocks"
	"payment-service/models"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/gorilla/mux"
)

func TestPaymentHandler_CreatePayment(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockService := mocks.NewMockPaymentService(ctrl)
	handler := NewPaymentHandler(mockService)

	tests := []struct {
		name         string
		input        models.Payment
		bodyInvalid  bool
		serviceError error
		wantStatus   int
	}{
		{
			name:       "success",
			input:      models.Payment{ID: "1", Amount: 100, OrderID: "order1"},
			wantStatus: http.StatusCreated,
		},
		{
			name:        "invalid body",
			bodyInvalid: true,
			wantStatus:  http.StatusBadRequest,
		},
		{
			name:         "service error",
			input:        models.Payment{ID: "2", Amount: 200, OrderID: "order2"},
			serviceError: errors.New("fail"),
			wantStatus:   http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var body io.Reader
			if tt.bodyInvalid {
				body = bytes.NewBufferString("{invalid json")
			} else {
				b, _ := json.Marshal(tt.input)
				body = bytes.NewBuffer(b)
			}
			req := httptest.NewRequest("POST", "/payments", body)
			w := httptest.NewRecorder()

			if !tt.bodyInvalid {
				mockService.EXPECT().
					CreatePayment(gomock.Any()).
					Return(tt.serviceError).
					Times(1)
			}

			handler.CreatePayment(w, req)
			if w.Code != tt.wantStatus {
				t.Errorf("got status %d, want %d", w.Code, tt.wantStatus)
			}
		})
	}
}

func TestPaymentHandler_GetPayment(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockService := mocks.NewMockPaymentService(ctrl)
	handler := NewPaymentHandler(mockService)

	tests := []struct {
		name       string
		id         string
		payment    *models.Payment
		serviceErr error
		wantStatus int
	}{
		{
			name:       "found",
			id:         "1",
			payment:    &models.Payment{ID: "1"},
			wantStatus: http.StatusOK,
		},
		{
			name:       "not found",
			id:         "2",
			payment:    nil,
			serviceErr: errors.New("not found"),
			wantStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/payments/"+tt.id, nil)
			req = mux.SetURLVars(req, map[string]string{"id": tt.id})
			w := httptest.NewRecorder()

			mockService.EXPECT().
				GetPayment(tt.id).
				Return(tt.payment, tt.serviceErr).
				Times(1)

			handler.GetPayment(w, req)
			if w.Code != tt.wantStatus {
				t.Errorf("got status %d, want %d", w.Code, tt.wantStatus)
			}
		})
	}
}

func TestPaymentHandler_ListPayments(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockService := mocks.NewMockPaymentService(ctrl)
	handler := NewPaymentHandler(mockService)

	tests := []struct {
		name       string
		orderID    string
		payments   []*models.Payment
		serviceErr error
		wantStatus int
	}{
		{
			name:       "success",
			orderID:    "order1",
			payments:   []*models.Payment{{ID: "1"}, {ID: "2"}},
			wantStatus: http.StatusOK,
		},
		{
			name:       "service error",
			orderID:    "order2",
			serviceErr: errors.New("fail"),
			wantStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/payments?order_id="+tt.orderID, nil)
			w := httptest.NewRecorder()

			mockService.EXPECT().
				ListPaymentsByOrder(tt.orderID).
				Return(tt.payments, tt.serviceErr).
				Times(1)

			handler.ListPayments(w, req)
			if w.Code != tt.wantStatus {
				t.Errorf("got status %d, want %d", w.Code, tt.wantStatus)
			}
		})
	}
}

func TestPaymentHandler_InitiateRefund(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockService := mocks.NewMockPaymentService(ctrl)
	handler := NewPaymentHandler(mockService)

	tests := []struct {
		name       string
		id         string
		refund     *models.Refund
		serviceErr error
		wantStatus int
	}{
		{
			name:       "success",
			id:         "1",
			refund:     &models.Refund{ID: "r1"},
			wantStatus: http.StatusOK,
		},
		{
			name:       "service error",
			id:         "2",
			serviceErr: errors.New("fail"),
			wantStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/payments/"+tt.id+"/refund", nil)
			req = mux.SetURLVars(req, map[string]string{"id": tt.id})
			w := httptest.NewRecorder()

			mockService.EXPECT().
				InitiateRefund(tt.id).
				Return(tt.refund, tt.serviceErr).
				Times(1)

			handler.InitiateRefund(w, req)
			if w.Code != tt.wantStatus {
				t.Errorf("got status %d, want %d", w.Code, tt.wantStatus)
			}
		})
	}
}

func TestPaymentHandler_GetRefundStatus(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockService := mocks.NewMockPaymentService(ctrl)
	handler := NewPaymentHandler(mockService)

	tests := []struct {
		name       string
		id         string
		refund     *models.Refund
		serviceErr error
		wantStatus int
	}{
		{
			name:       "success",
			id:         "1",
			refund:     &models.Refund{ID: "r1"},
			wantStatus: http.StatusOK,
		},
		{
			name:       "service error",
			id:         "2",
			serviceErr: errors.New("fail"),
			wantStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/payments/"+tt.id+"/refund", nil)
			req = mux.SetURLVars(req, map[string]string{"id": tt.id})
			w := httptest.NewRecorder()

			mockService.EXPECT().
				GetRefundStatus(tt.id).
				Return(tt.refund, tt.serviceErr).
				Times(1)

			handler.GetRefundStatus(w, req)
			if w.Code != tt.wantStatus {
				t.Errorf("got status %d, want %d", w.Code, tt.wantStatus)
			}
		})
	}
}

func TestPaymentHandler_PaymentWebhook(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockService := mocks.NewMockPaymentService(ctrl)
	handler := NewPaymentHandler(mockService)

	tests := []struct {
		name       string
		body       string
		serviceErr error
		wantStatus int
	}{
		{
			name:       "success",
			body:       "{}",
			wantStatus: http.StatusOK,
		},
		{
			name:       "fail",
			body:       "{}",
			serviceErr: errors.New("fail"),
			wantStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/webhook", bytes.NewBufferString(tt.body))
			w := httptest.NewRecorder()

			mockService.EXPECT().
				HandleWebhook(gomock.Any()).
				Return(tt.serviceErr).
				Times(1)

			handler.PaymentWebhook(w, req)
			if w.Code != tt.wantStatus {
				t.Errorf("got status %d, want %d", w.Code, tt.wantStatus)
			}
		})
	}
}
