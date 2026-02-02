# Frontend ↔ Backend Contract (Draft)

This document defines the API surface and data shapes needed by the current frontend pages. It allows frontend and backend work in parallel with a clear contract.

## Base
- Base URL: `/api/v1`
- Auth: Bearer `Authorization: Bearer <access_token>`
- Dates: ISO `YYYY-MM-DD` unless noted
- Money: decimal string in JSON (avoid float precision issues)

## 1) Auth
### Register
- `POST /auth/register`
- Request: `{ email, password, first_name, last_name }`
- Response: `{ access_token, refresh_token, user }`

### Login
- `POST /auth/login`
- Request: `{ email, password }`
- Response: `{ access_token, refresh_token, user }`

### Refresh
- `POST /auth/refresh`
- Request: `{ refresh_token }`
- Response: `{ access_token, refresh_token }`

## 2) Dashboard (src/pages/Dashboard.jsx)
### Summary
- `GET /analytics/summary`
- Response:
```
{
  "balance": "2450.00",
  "savings": "1200.00",
  "monthly_allowance": "3000.00",
  "spent_this_month": "1340.00",
  "remaining_this_month": "1660.00",
  "delta_percent": 12
}
```

### Recent Transactions
- `GET /transactions?limit=5&sort=-date`
- Response:
```
[
  {"id":"...","title":"Textbooks","date":"2025-10-03","amount":"-150.00","type":"expense"}
]
```

### Featured Opportunities
- `GET /opportunities/featured`
- Response:
```
[
  {"id":"...","title":"Back to School Tech","discount":"40% OFF","provider":"ElectroWorld","type":"discount"}
]
```

## 3) Planning (src/pages/Planning.jsx)
### Monthly Allowance + Current Spend
- `GET /budgets?period=monthly&active=true`
- Response:
```
[{"id":"...","name":"Monthly Allowance","amount":"3000.00","period":"monthly","start_date":"2025-10-01"}]
```

### Add Transaction
- `POST /transactions`
- Request: `{ title, amount, type, date }`
- Response: `{ id, title, amount, type, date }`

## 4) Savings (src/pages/Savings.jsx)
### List Goals
- `GET /savings`
- Response:
```
[
  {"id":"...","name":"New Laptop","target_amount":"2000.00","current_amount":"850.00","is_completed":false}
]
```

### Create Goal
- `POST /savings`
- Request: `{ name, target_amount, deadline?, category? }`

### Contribute
- `POST /savings/:id/contribute`
- Request: `{ amount }`

## 5) Opportunities (src/pages/Opportunities.jsx)
### List + Filters
- `GET /opportunities?category=education&query=...`
- Response:
```
[
  {"id":"...","title":"50% Off Textbooks","provider":"BookWorld","category":"education","type":"discount","location":"Online","amount":"50%"}
]
```

### Categories
- `GET /opportunities/categories`
- Response: `["education","food","tech","travel"]`

## 6) AI Advisor (src/pages/AIAdvisor.jsx)
### List Conversations
- `GET /ai/conversations`

### Create Conversation
- `POST /ai/conversations`
- Request: `{ title? }`
- Response: `{ id, title }`

### Send Message
- `POST /ai/conversations/:id/messages`
- Request: `{ content }`
- Response:
```
{
  "message": {"id":"...","role":"assistant","content":"..."},
  "usage": {"tokens": 123}
}
```

## 7) Blogs (src/pages/Blogs.jsx)
### List Articles
- `GET /blogs?featured=true`
- Response:
```
[
  {"id":"...","title":"...","excerpt":"...","category":"Budgeting","read_time":"5 min read","image_url":"...","featured":true}
]
```

### Article Detail
- `GET /blogs/:id`
- Response:
```
{
  "id":"...",
  "title":"...",
  "content":"...",
  "category":"Budgeting",
  "read_time":"5 min read",
  "image_url":"..."
}
```

## 8) Notifications (global)
- `GET /notifications`
- `PUT /notifications/:id/read`
- `PUT /notifications/read-all`

## 9) Common Response Format (recommended)
```
{
  "data": { ... },
  "meta": { "request_id": "..." }
}
```

