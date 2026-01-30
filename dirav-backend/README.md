# Dirav Backend API Documentation

A comprehensive backend API for the Dirav personal finance management application, built with **Go**, **Gin**, **GORM**, and **PostgreSQL**.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Overview](#api-overview)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
- [Data Models](#data-models)
  - [User](#user)
  - [Account](#account)
  - [Transaction](#transaction)
  - [Budget](#budget)
  - [Savings Goal](#savings-goal)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Authentication](#authentication-endpoints)
  - [Users](#users)
  - [Accounts](#accounts)
  - [Transactions](#transactions)
  - [Budgets](#budgets)
  - [Savings Goals](#savings-goals)
  - [Analytics](#analytics)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Getting Started

### Prerequisites

- **Go** 1.23 or higher
- **PostgreSQL** 12 or higher
- A PostgreSQL database created for the application

### Installation

1. Clone the repository and navigate to the backend directory:

```bash
cd dirav-backend
```

2. Install dependencies:

```bash
go mod tidy
```

### Environment Variables

Create a `.env` file in the `dirav-backend` directory based on `.env.example`:

| Variable      | Description                          | Default     |
|---------------|--------------------------------------|-------------|
| `PORT`        | Server port                          | `8080`      |
| `DB_HOST`     | PostgreSQL host                      | `localhost` |
| `DB_PORT`     | PostgreSQL port                      | `5432`      |
| `DB_USER`     | PostgreSQL username                  | `dirav`     |
| `DB_PASSWORD` | PostgreSQL password                  | `password`  |
| `DB_NAME`     | PostgreSQL database name             | `dirav_db`  |
| `DB_SSL_MODE` | PostgreSQL SSL mode                  | `disable`   |
| `JWT_SECRET`  | Secret key for JWT token generation  | `change_me` |

> **Important:** Always use a strong, unique `JWT_SECRET` in production environments.

### Running the Server

```bash
go run ./cmd/api
```

The server will start on the configured port (default: `8080`). You should see:

```
Server listening on :8080
```

---

## API Overview

### Base URL

All API endpoints are prefixed with:

```
/api/v1
```

### Authentication

The API uses **JWT (JSON Web Tokens)** for authentication. After registering or logging in, you'll receive an `access_token` that must be included in the `Authorization` header for all protected endpoints.

**Header format:**

```
Authorization: Bearer <access_token>
```

**Token expiration:** 15 minutes

**Protected endpoints:** All endpoints except `/health`, `/auth/register`, and `/auth/login` require authentication.

---

## Data Models

### User

| Field         | Type      | Description                     |
|---------------|-----------|---------------------------------|
| `id`          | UUID      | Unique identifier               |
| `email`       | string    | User's email (unique)           |
| `password_hash` | string  | Hashed password (not returned)  |
| `first_name`  | string    | User's first name               |
| `last_name`   | string    | User's last name                |
| `created_at`  | timestamp | Record creation time            |
| `updated_at`  | timestamp | Last update time                |

### Account

| Field         | Type      | Description                                |
|---------------|-----------|--------------------------------------------|
| `id`          | UUID      | Unique identifier                          |
| `user_id`     | UUID      | Owner user's ID                            |
| `account_name`| string    | Name of the account                        |
| `account_type`| string    | Type (e.g., `cash`, `bank`, `credit`)      |
| `balance`     | float64   | Current balance                            |
| `currency`    | string    | Currency code (default: `USD`)             |
| `is_primary`  | boolean   | Whether this is the primary account        |
| `created_at`  | timestamp | Record creation time                       |
| `updated_at`  | timestamp | Last update time                           |

### Transaction

| Field            | Type      | Description                                       |
|------------------|-----------|---------------------------------------------------|
| `id`             | UUID      | Unique identifier                                 |
| `user_id`        | UUID      | Owner user's ID                                   |
| `account_id`     | UUID      | Associated account ID (optional)                  |
| `title`          | string    | Transaction title/description                     |
| `amount`         | float64   | Transaction amount                                |
| `type`           | string    | Type: `income` or `expense`                       |
| `category`       | string    | Category (e.g., `food`, `education`, `transport`) |
| `transaction_date`| date     | Date of the transaction                           |
| `created_at`     | timestamp | Record creation time                              |
| `updated_at`     | timestamp | Last update time                                  |

### Budget

| Field       | Type      | Description                                          |
|-------------|-----------|------------------------------------------------------|
| `id`        | UUID      | Unique identifier                                    |
| `user_id`   | UUID      | Owner user's ID                                      |
| `name`      | string    | Budget name                                          |
| `amount`    | float64   | Budget amount limit                                  |
| `period`    | string    | Period: `daily`, `weekly`, `monthly`, or `yearly`    |
| `category`  | string    | Category this budget applies to (optional)           |
| `start_date`| date      | Budget start date                                    |
| `end_date`  | date      | Budget end date (optional)                           |
| `is_active` | boolean   | Whether the budget is active                         |
| `created_at`| timestamp | Record creation time                                 |
| `updated_at`| timestamp | Last update time                                     |

### Savings Goal

| Field          | Type      | Description                        |
|----------------|-----------|------------------------------------|
| `id`           | UUID      | Unique identifier                  |
| `user_id`      | UUID      | Owner user's ID                    |
| `name`         | string    | Goal name                          |
| `target_amount`| float64   | Target amount to save              |
| `current_amount`| float64  | Current amount saved               |
| `deadline`     | date      | Target deadline (optional)         |
| `is_completed` | boolean   | Whether the goal has been reached  |
| `created_at`   | timestamp | Record creation time               |
| `updated_at`   | timestamp | Last update time                   |

---

## API Endpoints

### Health Check

#### Check Server Health

```
GET /api/v1/health
```

**Response:**

```json
{
  "status": "ok"
}
```

---

### Authentication Endpoints

#### Register a New User

```
POST /api/v1/auth/register
```

**Request Body:**

| Field       | Type   | Required | Description           |
|-------------|--------|----------|-----------------------|
| `email`     | string | Yes      | User's email address  |
| `password`  | string | Yes      | User's password       |
| `first_name`| string | Yes      | User's first name     |
| `last_name` | string | Yes      | User's last name      |

**Example Request:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Success Response (201 Created):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

#### Login

```
POST /api/v1/auth/login
```

**Request Body:**

| Field      | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| `email`    | string | Yes      | User's email address |
| `password` | string | Yes      | User's password      |

**Example Request:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

### Users

#### Get Current User Profile

```
GET /api/v1/users/me
```

**Headers:** `Authorization: Bearer <access_token>`

**Success Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

#### Update Current User Profile

```
PUT /api/v1/users/me
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

| Field       | Type   | Required | Description              |
|-------------|--------|----------|--------------------------|
| `first_name`| string | No       | New first name           |
| `last_name` | string | No       | New last name            |

**Example Request:**

```json
{
  "first_name": "Jonathan",
  "last_name": "Smith"
}
```

**Success Response (200 OK):**

```json
{
  "status": "updated"
}
```

---

### Accounts

#### List All Accounts

```
GET /api/v1/accounts
```

**Headers:** `Authorization: Bearer <access_token>`

**Success Response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "account_name": "Main Wallet",
    "account_type": "cash",
    "balance": 1500.00,
    "currency": "USD",
    "is_primary": true,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

#### Create Account

```
POST /api/v1/accounts
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

| Field         | Type    | Required | Description                         |
|---------------|---------|----------|-------------------------------------|
| `account_name`| string  | Yes      | Name of the account                 |
| `account_type`| string  | Yes      | Type: `cash`, `bank`, `credit`, etc.|
| `balance`     | float64 | Yes      | Initial balance                     |
| `currency`    | string  | No       | Currency code (default: `USD`)      |
| `is_primary`  | boolean | No       | Primary account flag (default: false)|

**Example Request:**

```json
{
  "account_name": "Savings Account",
  "account_type": "bank",
  "balance": 5000.00,
  "currency": "USD",
  "is_primary": false
}
```

**Success Response (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "account_name": "Savings Account",
  "account_type": "bank",
  "balance": 5000.00,
  "currency": "USD",
  "is_primary": false,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

#### Get Account by ID

```
GET /api/v1/accounts/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description           |
|-----------|------|-----------------------|
| `id`      | UUID | Account ID            |

**Success Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "account_name": "Savings Account",
  "account_type": "bank",
  "balance": 5000.00,
  "currency": "USD",
  "is_primary": false,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

#### Update Account

```
PUT /api/v1/accounts/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description           |
|-----------|------|-----------------------|
| `id`      | UUID | Account ID            |

**Request Body:**

| Field         | Type    | Required | Description           |
|---------------|---------|----------|-----------------------|
| `account_name`| string  | Yes      | Name of the account   |
| `account_type`| string  | Yes      | Type of account       |
| `balance`     | float64 | Yes      | Current balance       |
| `currency`    | string  | Yes      | Currency code         |
| `is_primary`  | boolean | Yes      | Primary account flag  |

**Success Response (200 OK):**

```json
{
  "status": "updated"
}
```

---

#### Delete Account

```
DELETE /api/v1/accounts/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description           |
|-----------|------|-----------------------|
| `id`      | UUID | Account ID            |

**Success Response (200 OK):**

```json
{
  "status": "deleted"
}
```

---

### Transactions

#### List Transactions

```
GET /api/v1/transactions
```

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**

| Parameter  | Type   | Required | Description                                |
|------------|--------|----------|--------------------------------------------|
| `type`     | string | No       | Filter by type: `income` or `expense`      |
| `category` | string | No       | Filter by category                         |
| `limit`    | int    | No       | Number of results (default: 50)            |

**Example:** `GET /api/v1/transactions?type=expense&category=food&limit=10`

**Success Response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "account_id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Grocery Shopping",
    "amount": 75.50,
    "type": "expense",
    "category": "food",
    "transaction_date": "2025-01-15T00:00:00Z",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

#### Create Transaction

```
POST /api/v1/transactions
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

| Field       | Type    | Required | Description                             |
|-------------|---------|----------|-----------------------------------------|
| `account_id`| UUID    | No       | Associated account ID                   |
| `title`     | string  | Yes      | Transaction description                 |
| `amount`    | float64 | Yes      | Transaction amount                      |
| `type`      | string  | Yes      | Type: `income` or `expense`             |
| `category`  | string  | No       | Transaction category                    |
| `date`      | string  | Yes      | Date in `YYYY-MM-DD` format             |

**Example Request:**

```json
{
  "account_id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Monthly Salary",
  "amount": 5000.00,
  "type": "income",
  "category": "salary",
  "date": "2025-01-01"
}
```

**Success Response (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "account_id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Monthly Salary",
  "amount": 5000.00,
  "type": "income",
  "category": "salary",
  "transaction_date": "2025-01-01T00:00:00Z",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

#### Get Transaction by ID

```
GET /api/v1/transactions/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description           |
|-----------|------|-----------------------|
| `id`      | UUID | Transaction ID        |

**Success Response (200 OK):** Returns the transaction object.

---

#### Update Transaction

```
PUT /api/v1/transactions/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description           |
|-----------|------|-----------------------|
| `id`      | UUID | Transaction ID        |

**Request Body:** Same as Create Transaction.

**Success Response (200 OK):**

```json
{
  "status": "updated"
}
```

---

#### Delete Transaction

```
DELETE /api/v1/transactions/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description           |
|-----------|------|-----------------------|
| `id`      | UUID | Transaction ID        |

**Success Response (200 OK):**

```json
{
  "status": "deleted"
}
```

---

### Budgets

#### List Budgets

```
GET /api/v1/budgets
```

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**

| Parameter | Type   | Required | Description                                        |
|-----------|--------|----------|----------------------------------------------------|
| `period`  | string | No       | Filter by period: `daily`, `weekly`, `monthly`, `yearly` |
| `active`  | string | No       | Filter by active status: `true` or `false`         |

**Success Response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Monthly Expenses",
    "amount": 2000.00,
    "period": "monthly",
    "category": "",
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": null,
    "is_active": true,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

#### Create Budget

```
POST /api/v1/budgets
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

| Field       | Type    | Required | Description                                |
|-------------|---------|----------|--------------------------------------------|
| `name`      | string  | Yes      | Budget name                                |
| `amount`    | float64 | Yes      | Budget limit amount                        |
| `period`    | string  | Yes      | Period: `daily`, `weekly`, `monthly`, `yearly` |
| `category`  | string  | No       | Category this budget applies to            |
| `start_date`| string  | Yes      | Start date in `YYYY-MM-DD` format          |
| `end_date`  | string  | No       | End date in `YYYY-MM-DD` format            |
| `is_active` | boolean | Yes      | Whether the budget is active               |

**Example Request:**

```json
{
  "name": "Food Budget",
  "amount": 500.00,
  "period": "monthly",
  "category": "food",
  "start_date": "2025-01-01",
  "is_active": true
}
```

**Success Response (201 Created):** Returns the created budget object.

---

#### Get Budget by ID

```
GET /api/v1/budgets/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description    |
|-----------|------|----------------|
| `id`      | UUID | Budget ID      |

**Success Response (200 OK):** Returns the budget object.

---

#### Update Budget

```
PUT /api/v1/budgets/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description    |
|-----------|------|----------------|
| `id`      | UUID | Budget ID      |

**Request Body:** Same as Create Budget.

**Success Response (200 OK):**

```json
{
  "status": "updated"
}
```

---

#### Delete Budget

```
DELETE /api/v1/budgets/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description    |
|-----------|------|----------------|
| `id`      | UUID | Budget ID      |

**Success Response (200 OK):**

```json
{
  "status": "deleted"
}
```

---

#### Get Budget Progress

```
GET /api/v1/budgets/:id/progress
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description    |
|-----------|------|----------------|
| `id`      | UUID | Budget ID      |

**Description:** Calculates the spending progress for a budget based on expense transactions within the budget's date range.

**Success Response (200 OK):**

```json
{
  "budget_id": "550e8400-e29b-41d4-a716-446655440005",
  "amount": 500.00,
  "spent": 325.50,
  "remaining": 174.50
}
```

---

### Savings Goals

#### List Savings Goals

```
GET /api/v1/savings
```

**Headers:** `Authorization: Bearer <access_token>`

**Success Response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440006",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Emergency Fund",
    "target_amount": 10000.00,
    "current_amount": 2500.00,
    "deadline": "2025-12-31T00:00:00Z",
    "is_completed": false,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

#### Create Savings Goal

```
POST /api/v1/savings
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

| Field          | Type    | Required | Description                          |
|----------------|---------|----------|--------------------------------------|
| `name`         | string  | Yes      | Goal name                            |
| `target_amount`| float64 | Yes      | Target amount to save                |
| `deadline`     | string  | No       | Target deadline in `YYYY-MM-DD` format |

**Example Request:**

```json
{
  "name": "Vacation Fund",
  "target_amount": 3000.00,
  "deadline": "2025-06-30"
}
```

**Success Response (201 Created):** Returns the created savings goal object.

---

#### Update Savings Goal

```
PUT /api/v1/savings/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description       |
|-----------|------|-------------------|
| `id`      | UUID | Savings goal ID   |

**Request Body:** Same as Create Savings Goal.

**Success Response (200 OK):**

```json
{
  "status": "updated"
}
```

---

#### Delete Savings Goal

```
DELETE /api/v1/savings/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description       |
|-----------|------|-------------------|
| `id`      | UUID | Savings goal ID   |

**Success Response (200 OK):**

```json
{
  "status": "deleted"
}
```

---

#### Contribute to Savings Goal

```
POST /api/v1/savings/:id/contribute
```

**Headers:** `Authorization: Bearer <access_token>`

**URL Parameters:**

| Parameter | Type | Description       |
|-----------|------|-------------------|
| `id`      | UUID | Savings goal ID   |

**Request Body:**

| Field    | Type    | Required | Description               |
|----------|---------|----------|---------------------------|
| `amount` | float64 | Yes      | Amount to contribute      |

**Example Request:**

```json
{
  "amount": 250.00
}
```

**Description:** Adds the specified amount to the current savings. If `current_amount` reaches or exceeds `target_amount`, the goal is automatically marked as completed.

**Success Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440006",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Vacation Fund",
  "target_amount": 3000.00,
  "current_amount": 2750.00,
  "deadline": "2025-06-30T00:00:00Z",
  "is_completed": false,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-20T14:30:00Z"
}
```

---

### Analytics

#### Get Financial Summary

```
GET /api/v1/analytics/summary
```

**Headers:** `Authorization: Bearer <access_token>`

**Description:** Provides a comprehensive financial overview for the authenticated user, including total balance across all accounts, total savings, monthly budget allowance, and spending for the current month.

**Success Response (200 OK):**

```json
{
  "balance": 6500.00,
  "savings": 2500.00,
  "monthly_allowance": 2000.00,
  "spent_this_month": 875.50,
  "remaining_this_month": 1124.50,
  "delta_percent": 0
}
```

**Response Fields:**

| Field                 | Type    | Description                                              |
|-----------------------|---------|----------------------------------------------------------|
| `balance`             | float64 | Total balance across all accounts                        |
| `savings`             | float64 | Total current amount saved across all savings goals      |
| `monthly_allowance`   | float64 | Maximum amount from active monthly budgets               |
| `spent_this_month`    | float64 | Total expenses for the current calendar month            |
| `remaining_this_month`| float64 | Amount remaining from monthly allowance                  |
| `delta_percent`       | float64 | Percentage change (currently returns 0)                  |

---

## Error Handling

All endpoints return consistent error responses in the following format:

```json
{
  "error": "error message"
}
```

### Common HTTP Status Codes

| Status Code | Description                                           |
|-------------|-------------------------------------------------------|
| `200`       | OK - Request successful                               |
| `201`       | Created - Resource created successfully               |
| `400`       | Bad Request - Invalid payload or missing fields       |
| `401`       | Unauthorized - Missing or invalid authentication      |
| `404`       | Not Found - Resource not found                        |
| `500`       | Internal Server Error - Database or server error      |

### Common Error Messages

| Error Message          | Description                                      |
|------------------------|--------------------------------------------------|
| `invalid payload`      | Request body is malformed or has invalid JSON    |
| `missing fields`       | Required fields are not provided                 |
| `missing token`        | Authorization header is missing                  |
| `invalid token`        | JWT token is invalid or expired                  |
| `invalid credentials`  | Email or password is incorrect                   |
| `user already exists`  | Email is already registered                      |
| `not found`            | Requested resource doesn't exist                 |
| `invalid id`           | Provided ID is not a valid UUID                  |
| `invalid date`         | Date format is incorrect (use `YYYY-MM-DD`)      |
| `database error`       | Internal database operation failed               |

---

## Examples

### Complete Workflow Example

Here's a complete example of using the API with curl:

```bash
# 1. Register a new user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "myPassword123",
    "first_name": "Jane",
    "last_name": "Doe"
  }'

# Save the access_token from the response
TOKEN="your_access_token_here"

# 2. Create an account
curl -X POST http://localhost:8080/api/v1/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "account_name": "Checking Account",
    "account_type": "bank",
    "balance": 2500.00,
    "currency": "USD",
    "is_primary": true
  }'

# 3. Create a budget
curl -X POST http://localhost:8080/api/v1/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Monthly Budget",
    "amount": 1500.00,
    "period": "monthly",
    "start_date": "2025-01-01",
    "is_active": true
  }'

# 4. Record an expense
curl -X POST http://localhost:8080/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Groceries",
    "amount": 85.50,
    "type": "expense",
    "category": "food",
    "date": "2025-01-15"
  }'

# 5. Create a savings goal
curl -X POST http://localhost:8080/api/v1/savings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "New Laptop",
    "target_amount": 1500.00,
    "deadline": "2025-06-01"
  }'

# 6. Contribute to savings
curl -X POST http://localhost:8080/api/v1/savings/{savings_id}/contribute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount": 100.00}'

# 7. View financial summary
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/analytics/summary
```

---

## Project Structure

```
dirav-backend/
├── cmd/
│   └── api/
│       └── main.go           # Application entry point
├── internal/
│   ├── api/
│   │   ├── handlers/         # HTTP request handlers
│   │   │   ├── accounts.go
│   │   │   ├── analytics.go
│   │   │   ├── auth.go
│   │   │   ├── budgets.go
│   │   │   ├── handler.go
│   │   │   ├── health.go
│   │   │   ├── savings.go
│   │   │   ├── transactions.go
│   │   │   └── users.go
│   │   ├── middleware/       # HTTP middleware
│   │   │   └── auth.go       # JWT authentication
│   │   └── routes/           # Route definitions
│   │       └── routes.go
│   ├── config/               # Configuration management
│   │   └── config.go
│   ├── database/             # Database connection
│   │   └── postgres.go
│   └── models/               # Data models
│       ├── account.go
│       ├── budget.go
│       ├── savings_goal.go
│       ├── transaction.go
│       └── user.go
├── .env.example              # Environment variables template
├── go.mod                    # Go module definition
├── go.sum                    # Go dependencies checksum
├── README.md                 # This documentation
└── TESTING.md                # API testing guide
```

---

## Dependencies

| Package                       | Version | Description                    |
|-------------------------------|---------|--------------------------------|
| `github.com/gin-gonic/gin`    | v1.9.1  | HTTP web framework             |
| `github.com/golang-jwt/jwt/v5`| v5.2.1  | JWT implementation             |
| `github.com/google/uuid`      | v1.6.0  | UUID generation                |
| `golang.org/x/crypto`         | v0.21.0 | Cryptographic functions        |
| `gorm.io/driver/postgres`     | v1.5.4  | PostgreSQL driver for GORM     |
| `gorm.io/gorm`                | v1.25.7 | ORM library                    |

---

## License

This project is part of the Dirav personal finance application.
