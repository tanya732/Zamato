package external

import (
	"bytes"
	"encoding/json"
	"net/http"
	"order-service/contracts"
)

func ProcessPayment(url string, request contracts.PaymentRequest) (*contracts.PaymentResponse, error) {
	body, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var response contracts.PaymentResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, err
	}

	return &response, nil
}
