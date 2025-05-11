# Order Service

This service handles order-related operations such as creating orders, fetching order history, updating order status, and processing payments.

---

## Running Postgres with Docker

```bash
docker run --name order-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=order_db -p 5433:5432 -d postgres:15
```

---

## API Endpoints

### 1. **Checkout (Create Order)**
- **Endpoint:** `POST /checkout`
- **Description:** Creates a new order.
- **Request Body:**
  ```json
  {
    "items": [
      {"menu_item_id": 1, "quantity": 2, "price": 10},
      {"menu_item_id": 2, "quantity": 1, "price": 5}
    ],
    "delivery_address": "123 Main Street"
  }
  ```
- **Example `curl`:**
  ```bash
  curl -X POST http://localhost:8080/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "items": [
      {"menu_item_id": 1, "quantity": 2, "price": 10},
      {"menu_item_id": 2, "quantity": 1, "price": 5}
    ],
    "delivery_address": "123 Main Street"
  }'
  ```

---

### 2. **Get Order History**
- **Endpoint:** `GET /orders`
- **Description:** Fetches the order history for the authenticated user.
- **Example `curl`:**
  ```bash
  curl -X GET http://localhost:8080/orders \
  -H "Authorization: Bearer <your-token>"
  ```

---

### 3. **Get Order by ID**
- **Endpoint:** `GET /orders/{id}`
- **Description:** Fetches details of a specific order by its ID.
- **Example `curl`:**
  ```bash
  curl -X GET http://localhost:8080/orders/1 \
  -H "Authorization: Bearer <your-token>"
  ```

---

### 4. **Update Order Status**
- **Endpoint:** `PUT /orders/{id}/status`
- **Description:** Updates the status of a specific order.
- **Request Body:**
  ```json
  {
    "status": "delivered"
  }
  ```
- **Example `curl`:**
  ```bash
  curl -X PUT http://localhost:8080/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "status": "delivered"
  }'
  ```

---

### 5. **Process Payment**
- **Endpoint:** `POST /orders/{orderId}/payment`
- **Description:** Processes payment for a specific order.
- **Request Body:**
  ```json
  {
    "payment_id": "pay_123"
  }
  ```
- **Example `curl`:**
  ```bash
  curl -X POST http://localhost:8080/orders/1/payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "payment_id": "pay_123"
  }'
  ```

---

## Running Tests

To run all tests in the project, use the following command:

```bash
go test ./...
```

For verbose output:

```bash
go test -v ./...
```

---

## Notes

- Replace `<your-token>` with the actual token if your API uses authentication.
- Replace `http://localhost:8080` with the actual base URL of your API.
- Ensure your API server is running before testing these commands.
