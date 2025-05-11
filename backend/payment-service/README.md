## API Testing

### Create Payment

```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "USD", "userId": "12345"}'
```

### Get Payment by ID

```bash
curl http://localhost:3000/payments/123
```

### List Payments

```bash
curl http://localhost:3000/payments
```

### Refund Payment

```bash
curl -X POST http://localhost:3000/payments/123/refund
```

### Update Payment

```bash
curl -X PUT http://localhost:3000/payments/123 \
  -H "Content-Type: application/json" \
  -d '{"amount": 150, "currency": "USD"}'
```

### Delete Payment

```bash
curl -X DELETE http://localhost:3000/payments/123
```

### Health Check

```bash
curl http://localhost:3000/health
```
