package external

import (
	"fmt"
)

type PaymentGateway interface {
	Process(amount float64) (string, error)
}

type DummyGateway struct{}

func (g *DummyGateway) Process(amount float64) (string, error) {
	// Simulate payment processing
	if amount <= 0 {
		return "", fmt.Errorf("invalid amount")
	}
	return "dummy-transaction-id", nil
}
