package models

import (
	"gorm.io/gorm"
)

type OrderStatus string

const (
	StatusPending   OrderStatus = "PENDING"
	StatusPaid      OrderStatus = "PAID"
	StatusPreparing OrderStatus = "PREPARING"
	StatusDelivered OrderStatus = "DELIVERED"
	StatusCancelled OrderStatus = "CANCELLED"
)

type Order struct {
	gorm.Model
	ID              uint        `json:"id" gorm:"primaryKey"`
	UserID          uint        `json:"user_id" gorm:"index"`
	OrderItems      []OrderItem `json:"order_items" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	TotalAmount     float64     `json:"total_amount"`
	Status          OrderStatus `json:"status" gorm:"type:varchar(20);index"`
	PaymentID       *string     `json:"payment_id"`
	DeliveryAddress string      `json:"delivery_address"`
}

type OrderItem struct {
	gorm.Model
	OrderID    uint    `json:"order_id" gorm:"index"`
	MenuItemID uint    `json:"menu_item_id"`
	Quantity   int     `json:"quantity"`
	Price      float64 `json:"price"`
	Name       string  `json:"name"`
}
