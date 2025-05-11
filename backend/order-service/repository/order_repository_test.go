package repository

import (
	"order-service/models"
	"strconv"
	"testing"

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

		// Convert order.ID to string for GetByID
		got, err := repo.GetByID(strconv.FormatUint(order.ID, 10))
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
		err = repo.UpdateStatus(strconv.FormatUint(order.ID, 10), models.StatusDelivered)
		assert.NoError(t, err)
		got, _ := repo.GetByID(strconv.FormatUint(order.ID, 10))
		assert.Equal(t, models.StatusDelivered, got.Status)
	})

	t.Run("GetByID not found", func(t *testing.T) {
		got, err := repo.GetByID("999")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "record not found")
		assert.Nil(t, got)
	})
}
