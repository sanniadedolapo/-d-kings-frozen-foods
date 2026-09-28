# D Kings Frozen Foods

Full-stack e-commerce and cold-chain order management platform for **D Kings Frozen Foods**.

---

## Features

- **Live Product Catalogue**: Blast-frozen chicken, turkey, seafood, Atlantic fish, prime cuts, and pastries with category filtering, real-time search, and price sorting.
- **Cart & Order Management**: Interactive cart drawer with stock validation, localStorage persistence, and delivery fee calculation.
- **Multi-Channel Checkout**:
  - **WhatsApp Direct Ordering**: Instant pre-formatted WhatsApp order dispatch sent to the D Kings merchant desk.
  - **Paystack Online Payment**: Card and bank transfer simulation with verification endpoint.
  - **Pay on Delivery / Bank Transfer**: Cash/POS on delivery confirmation.
- **Order Tracking**: Visual dispatch progress timeline from order placement to delivery (`/track`).
- **Store Owner Dashboard**: Real-time sales KPIs (revenue, orders, inventory alerts), order status lifecycle manager, and catalog inventory controls (`/admin`).
- **Zero-Config Standalone Execution**: Embedded H2 database runs immediately without requiring Docker or MySQL. Production MySQL 8.4 configuration is retained via Spring profiles.

---

## How to Run Locally

### 1. Backend (Spring Boot 3.4 & Java 24)

From the `backend/` directory:

```bash
mvn spring-boot:run
```

- **Default Profile (H2 In-Memory)**: Automatically seeds 6 categories, 15 realistic frozen food items, and sample demo order.
- **H2 Web Console**: Access `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:dkings_frozen_foods`, User: `sa`, Password: *empty*).
- **Production MySQL Profile**:
  ```bash
  mvn spring-boot:run -Dspring-boot.run.profiles=mysql
  ```
- **Run Backend Tests**:
  ```bash
  mvn clean test
  ```

### 2. Frontend (React 18 + Vite)

From the `frontend/` directory:

```bash
npm install
npm run dev
```

- Storefront will run at `http://localhost:5173`.
- The Vite development server automatically proxies `/api` requests to `http://localhost:8080`.

---

## REST API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service and database health check |
| `GET` | `/api/categories` | List all product categories |
| `GET` | `/api/products` | Query products (`?category=`, `?search=`, `?featured=`) |
| `GET` | `/api/products/{id}` | Get single product details |
| `POST` | `/api/products` | Add a new product (Admin) |
| `PUT` | `/api/products/{id}` | Update product details (Admin) |
| `DELETE` | `/api/products/{id}` | Remove a product (Admin) |
| `POST` | `/api/orders` | Place a customer order |
| `GET` | `/api/orders/{orderNumber}` | Track customer order by reference |
| `GET` | `/api/orders` | List all orders (Admin, optional `?status=`) |
| `PATCH` | `/api/orders/{id}/status` | Update order dispatch / payment status |
| `POST` | `/api/orders/{orderNumber}/verify-payment` | Verify and confirm Paystack reference |
| `GET` | `/api/admin/stats` | Retrieve store KPIs and inventory stats |
