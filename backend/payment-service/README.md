## Running Postgres with Docker

```bash
docker run --name payment-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=payment_db -p 5432:5432 -d postgres:15
```

## API Testing

### Create Payment

```bash
curl -X POST http://localhost:8080/payments \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "USD", "user_id": "12345", "order_id": "order_001"}'
```

### Get Payment by ID

```bash
curl http://localhost:8080/payments/123
```

### List Payments by Order ID

```bash
curl "http://localhost:8080/payments?order_id=order_001"
```

### Refund Payment

```bash
curl -X POST http://localhost:8080/payments/123/refund
```

### Get Refund Status

```bash
curl http://localhost:8080/payments/123/refund
```
