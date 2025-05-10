package repository

import (
	"errors"
	"order-service/mocks"
	"order-service/models"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	err = db.AutoMigrate(&models.Order{}, &models.OrderItem{})
	assert.NoError(t, err)
	return db
}

func TestOrderRepository_CRUD(t *testing.T) {
	db := setupTestDB(t)
	repo := NewOrderRepository(db)

	t.Run("Create and GetByID", func(t *testing.T) {
		order := &models.Order{
			UserID: 1,
			OrderItems: []models.OrderItem{
				{MenuItemID: 1, Quantity: 2, Price: 10},
			},
			TotalAmount:     20,
			Status:          models.StatusPending,
			DeliveryAddress: "addr",
		}
		err := repo.Create(order)
		assert.NoError(t, err)
		assert.NotZero(t, order.ID)

		got, err := repo.GetByID(order.ID)
		assert.NoError(t, err)
		assert.Equal(t, order.ID, got.ID)
		assert.Equal(t, 1, len(got.OrderItems))
	})

	t.Run("GetUserOrders", func(t *testing.T) {
		order := &models.Order{
			UserID: 2,
			OrderItems: []models.OrderItem{
				{MenuItemID: 2, Quantity: 1, Price: 5},
			},
			TotalAmount:     5,
			Status:          models.StatusPending,
			DeliveryAddress: "addr2",
		}
		err := repo.Create(order)
		assert.NoError(t, err)

		orders, err := repo.GetUserOrders(2)
		assert.NoError(t, err)
		assert.Len(t, orders, 1)
		assert.Equal(t, uint(2), orders[0].UserID)
	})

	t.Run("UpdateStatus", func(t *testing.T) {
		order := &models.Order{
			UserID: 3,
			OrderItems: []models.OrderItem{
				{MenuItemID: 3, Quantity: 1, Price: 7},
			},
			TotalAmount:     7,
			Status:          models.StatusPending,
			DeliveryAddress: "addr3",
		}
		err := repo.Create(order)
		assert.NoError(t, err)
		err = repo.UpdateStatus(order.ID, models.StatusDelivered)
		assert.NoError(t, err)
		got, _ := repo.GetByID(order.ID)
		assert.Equal(t, models.StatusDelivered, got.Status)
	})

	t.Run("UpdatePayment", func(t *testing.T) {
		order := &models.Order{
			UserID: 4,
			OrderItems: []models.OrderItem{
				{MenuItemID: 4, Quantity: 1, Price: 8},
			},
			TotalAmount:     8,
			Status:          models.StatusPending,
			DeliveryAddress: "addr4",
		}
		err := repo.Create(order)
		assert.NoError(t, err)
		err = repo.UpdatePayment(order.ID, "pay_123")
		assert.NoError(t, err)
		got, _ := repo.GetByID(order.ID)
		assert.Equal(t, "pay_123", got.PaymentID)
		assert.Equal(t, models.StatusPaid, got.Status)
	})

	t.Run("GetByID not found", func(t *testing.T) {
		got, err := repo.GetByID(9999)
		assert.Error(t, err)
		assert.Nil(t, got)
	})
}

// Additional test using a mock DB to simulate DB errors
func TestOrderRepository_DBError(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockDB := mocks.NewMockGormDB(ctrl)
	repo := &orderRepository{db: (*gorm.DB)(nil)} // Not used directly

	// Simulate Create error
	mockDB.EXPECT().Create(gomock.Any()).Return(&gorm.DB{Error: errors.New("create error")})
	err := repo.Create(&models.Order{})
	assert.Error(t, err)

	// Simulate GetByID error
	mockDB.EXPECT().Preload("OrderItems").Return(mockDB)
	mockDB.EXPECT().First(gomock.Any(), gomock.Any()).Return(&gorm.DB{Error: errors.New("not found")})
	_, err = repo.GetByID(1)
	assert.Error(t, err)

	// Simulate UpdateStatus error
	mockDB.EXPECT().Model(gomock.Any()).Return(mockDB)
	mockDB.EXPECT().Where(gomock.Any(), gomock.Any()).Return(mockDB)
	mockDB.EXPECT().Update(gomock.Any(), gomock.Any()).Return(&gorm.DB{Error: errors.New("update error")})
	err = repo.UpdateStatus(1, models.StatusDelivered)
	assert.Error(t, err)

	// Simulate UpdatePayment error
	mockDB.EXPECT().Model(gomock.Any()).Return(mockDB)
	mockDB.EXPECT().Where(gomock.Any(), gomock.Any()).Return(mockDB)
	mockDB.EXPECT().Updates(gomock.Any()).Return(&gorm.DB{Error: errors.New("update payment error")})
	err = repo.UpdatePayment(1, "pay_123")
	assert.Error(t, err)
}
