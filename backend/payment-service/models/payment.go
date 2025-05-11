package models

type Payment struct {
	ID            string  `json:"id"`
	OrderID       string  `json:"order_id"`
	Amount        float64 `json:"amount"`
	Status        string  `json:"status"`
	TransactionID string  `json:"transaction_id"` // <-- Add this field
	CreatedAt     int64   `json:"created_at"`
	// ...other fields...
}

type Refund struct {
	ID        string  `json:"id"`
	PaymentID string  `json:"payment_id"`
	Status    string  `json:"status"`
	Amount    float64 `json:"amount"`
	CreatedAt int64   `json:"created_at"`
	// ...other fields...
}
