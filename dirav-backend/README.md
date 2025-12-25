# Dirav Backend (MVP)

This is the MVP backend for Dirav, built with Go + Gin + GORM + PostgreSQL.

## Run locally
1) Start Postgres (or use your own)
2) Set env vars from `.env.example`
3) Run the API

```bash
go mod tidy

go run ./cmd/api
```

## Health
- `GET /api/v1/health`

## MVP Routes
- Auth: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- Users: `GET/PUT /api/v1/users/me`
- Accounts: CRUD on `/api/v1/accounts`
- Transactions: CRUD on `/api/v1/transactions`
- Budgets: CRUD on `/api/v1/budgets` + `/api/v1/budgets/:id/progress`
- Savings: CRUD on `/api/v1/savings` + `/api/v1/savings/:id/contribute`
- Summary: `GET /api/v1/analytics/summary`
