# API Testing Guide (MVP)

This guide shows how to run the backend locally and test the MVP endpoints with curl. Share this file with frontend devs so they can test against a running API.

## 1) Run the backend

From the backend directory:

```bash
cd /Users/shadman/Documents/Dirav-Frontend/dirav-backend

# install deps

go mod tidy

# configure env

cp .env.example .env

# run the API

go run ./cmd/api
```

Expected log: server listening on `:8080`

## 2) Health check

```bash
curl http://localhost:8080/api/v1/health
```

## 3) Register

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123","first_name":"Test","last_name":"User"}'
```

Copy the `access_token` from the response.

## 4) Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```

## 5) Auth header

All protected endpoints require:

```
Authorization: Bearer <access_token>
```

## 6) Accounts

```bash
# create
curl -X POST http://localhost:8080/api/v1/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"account_name":"Main Wallet","account_type":"cash","balance":1200,"currency":"USD","is_primary":true}'

# list
curl -H "Authorization: Bearer <access_token>" http://localhost:8080/api/v1/accounts
```

## 7) Transactions

```bash
# create
curl -X POST http://localhost:8080/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"title":"Textbooks","amount":150,"type":"expense","category":"education","date":"2025-10-03"}'

# list
curl -H "Authorization: Bearer <access_token>" http://localhost:8080/api/v1/transactions?limit=5
```

## 8) Budgets

```bash
# create
curl -X POST http://localhost:8080/api/v1/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"name":"Monthly Allowance","amount":3000,"period":"monthly","start_date":"2025-10-01","is_active":true}'

# progress
curl -H "Authorization: Bearer <access_token>" http://localhost:8080/api/v1/budgets/<budget_id>/progress
```

## 9) Savings

```bash
# create
curl -X POST http://localhost:8080/api/v1/savings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"name":"New Laptop","target_amount":2000}'

# contribute
curl -X POST http://localhost:8080/api/v1/savings/<goal_id>/contribute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"amount":100}'
```

## 10) Summary (Dashboard)

```bash
curl -H "Authorization: Bearer <access_token>" http://localhost:8080/api/v1/analytics/summary
```

## Notes
- Uses GORM AutoMigrate on startup. Make sure Postgres is running and the DB exists.
- For local Postgres, you can create a DB with:

```bash
createdb dirav_db
```

