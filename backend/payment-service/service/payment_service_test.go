package service

import (
	"errors"
	"strings"
	"testing"

	"payment-service/mocks"
	"payment-service/models"

	"github.com/golang/mock/gomock"
)

func TestPaymentService_CreatePayment(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockRepo := mocks.NewMockPaymentRepository(ctrl)
	mockGateway := mocks.NewMockPaymentGateway(ctrl)
	svc := NewPaymentService(mockRepo, mockGateway)

	tests := []struct {
		name       string
		amount     float64
		gatewayErr error
		repoErr    error
		wantErr    bool
	}{
		{
			name:   "success",
			amount: 100,
		},
		{
			name:       "gateway error",
			amount:     200,
			gatewayErr: errors.New("gateway fail"),
			wantErr:    true,
		},
		{
			name:    "repo error",
			amount:  300,
			repoErr: errors.New("repo fail"),
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &models.Payment{Amount: tt.amount}
			if tt.gatewayErr != nil {
				mockGateway.EXPECT().Process(float64(tt.amount)).Return("", tt.gatewayErr)
			} else {
				mockGateway.EXPECT().Process(float64(tt.amount)).Return("txid", nil)
				mockRepo.EXPECT().Save(gomock.Any()).Return(tt.repoErr)
			}
			err := svc.CreatePayment(p)
			if (err != nil) != tt.wantErr {
				t.Errorf("got err %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPaymentService_GetPayment(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockRepo := mocks.NewMockPaymentRepository(ctrl)
	svc := NewPaymentService(mockRepo, nil)

	tests := []struct {
		name    string
		id      string
		payment *models.Payment
		repoErr error
		wantErr bool
	}{
		{
			name:    "found",
			id:      "1",
			payment: &models.Payment{ID: "1"},
		},
		{
			name:    "not found",
			id:      "2",
			repoErr: errors.New("not found"),
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.EXPECT().FindByID(tt.id).Return(tt.payment, tt.repoErr)
			_, err := svc.GetPayment(tt.id)
			if (err != nil) != tt.wantErr {
				t.Errorf("got err %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPaymentService_ListPaymentsByOrder(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockRepo := mocks.NewMockPaymentRepository(ctrl)
	svc := NewPaymentService(mockRepo, nil)

	tests := []struct {
		name     string
		orderID  string
		payments []*models.Payment
		repoErr  error
		wantErr  bool
	}{
		{
			name:     "success",
			orderID:  "order1",
			payments: []*models.Payment{{ID: "1"}},
		},
		{
			name:    "repo error",
			orderID: "order2",
			repoErr: errors.New("fail"),
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.EXPECT().FindByOrderID(tt.orderID).Return(tt.payments, tt.repoErr)
			_, err := svc.ListPaymentsByOrder(tt.orderID)
			if (err != nil) != tt.wantErr {
				t.Errorf("got err %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPaymentService_InitiateRefund(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockRepo := mocks.NewMockPaymentRepository(ctrl)
	svc := NewPaymentService(mockRepo, nil)

	tests := []struct {
		name      string
		paymentID string
		payment   *models.Payment
		findErr   error
		saveErr   error
		wantErr   bool
	}{
		{
			name:      "success",
			paymentID: "1",
			payment:   &models.Payment{ID: "1", Amount: 100},
		},
		{
			name:      "find error",
			paymentID: "2",
			findErr:   errors.New("not found"),
			wantErr:   true,
		},
		{
			name:      "save error",
			paymentID: "3",
			payment:   &models.Payment{ID: "3", Amount: 200},
			saveErr:   errors.New("save fail"),
			wantErr:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.EXPECT().FindByID(tt.paymentID).Return(tt.payment, tt.findErr)
			if tt.findErr == nil && tt.payment != nil {
				mockRepo.EXPECT().SaveRefund(gomock.Any()).Return(tt.saveErr)
			}
			_, err := svc.InitiateRefund(tt.paymentID)
			if (err != nil) != tt.wantErr {
				t.Errorf("got err %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPaymentService_GetRefundStatus(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	mockRepo := mocks.NewMockPaymentRepository(ctrl)
	svc := NewPaymentService(mockRepo, nil)

	tests := []struct {
		name      string
		paymentID string
		refund    *models.Refund
		repoErr   error
		wantErr   bool
	}{
		{
			name:      "success",
			paymentID: "1",
			refund:    &models.Refund{ID: "r1"},
		},
		{
			name:      "repo error",
			paymentID: "2",
			repoErr:   errors.New("fail"),
			wantErr:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.EXPECT().FindRefundByPaymentID(tt.paymentID).Return(tt.refund, tt.repoErr)
			_, err := svc.GetRefundStatus(tt.paymentID)
			if (err != nil) != tt.wantErr {
				t.Errorf("got err %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPaymentService_HandleWebhook(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	svc := NewPaymentService(nil, nil)

	tests := []struct {
		name    string
		body    string
		wantErr bool
	}{
		{
			name:    "noop",
			body:    "{}",
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := svc.HandleWebhook(strings.NewReader(tt.body))
			if (err != nil) != tt.wantErr {
				t.Errorf("got err %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
