package external

import (
	"bytes"
	"encoding/json"
	"net/http"
)

type PaymentRequest struct {
	OrderID string  `json:"order_id"`
	Amount  float64 `json:"amount"`
}

type PaymentResponse struct {
	PaymentID string `json:"payment_id"`
	Status    string `json:"status"`
}

func ProcessPayment(url string, request PaymentRequest) (*PaymentResponse, error) {
	body, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var response PaymentResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, err
	}

	return &response, nil
}
