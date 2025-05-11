package repository

import (
	"payment-service/models"
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	err = db.AutoMigrate(&models.Payment{}, &models.Refund{})
	assert.NoError(t, err)
	return db
}

func TestPaymentRepository_CRUD(t *testing.T) {
	db := setupTestDB(t)
	repo := NewPaymentRepository(db)

	t.Run("Save and FindByID", func(t *testing.T) {
		payment := &models.Payment{ID: "p1", Amount: 100, OrderID: "o1"}
		err := repo.Save(payment)
		assert.NoError(t, err)

		got, err := repo.FindByID("p1")
		assert.NoError(t, err)
		assert.Equal(t, payment.ID, got.ID)
	})

	t.Run("FindByOrderID", func(t *testing.T) {
		payment := &models.Payment{ID: "p2", Amount: 200, OrderID: "o2"}
		_ = repo.Save(payment)
		payments, err := repo.FindByOrderID("o2")
		assert.NoError(t, err)
		assert.Len(t, payments, 1)
		assert.Equal(t, "p2", payments[0].ID)
	})

	t.Run("SaveRefund and FindRefundByPaymentID", func(t *testing.T) {
		refund := &models.Refund{ID: "r1", PaymentID: "p1", Amount: 100}
		err := repo.SaveRefund(refund)
		assert.NoError(t, err)

		got, err := repo.FindRefundByPaymentID("p1")
		assert.NoError(t, err)
		assert.Equal(t, refund.ID, got.ID)
	})

	t.Run("UpdatePaymentStatus", func(t *testing.T) {
		payment := &models.Payment{ID: "p3", Amount: 300, OrderID: "o3", Status: "pending"}
		_ = repo.Save(payment)
		err := repo.UpdatePaymentStatus("p3", "completed")
		assert.NoError(t, err)
		got, _ := repo.FindByID("p3")
		assert.Equal(t, "completed", got.Status)
	})

	t.Run("FindByID not found", func(t *testing.T) {
		got, err := repo.FindByID("not-exist")
		assert.Error(t, err)
		assert.Nil(t, got)
	})

	t.Run("FindRefundByPaymentID not found", func(t *testing.T) {
		got, err := repo.FindRefundByPaymentID("not-exist")
		assert.Error(t, err)
		assert.Nil(t, got)
	})

	t.Run("FindByOrderID not found", func(t *testing.T) {
		payments, err := repo.FindByOrderID("not-exist")
		assert.NoError(t, err)
		assert.Len(t, payments, 0)
	})

	t.Run("Save duplicate payment returns error", func(t *testing.T) {
		payment := &models.Payment{ID: "dup", Amount: 10, OrderID: "o4"}
		_ = repo.Save(payment)
		err := repo.Save(payment)
		assert.Error(t, err)
	})

	t.Run("SaveRefund duplicate returns error", func(t *testing.T) {
		refund := &models.Refund{ID: "dup-refund", PaymentID: "p1", Amount: 10}
		_ = repo.SaveRefund(refund)
		err := repo.SaveRefund(refund)
		assert.Error(t, err)
	})
}
