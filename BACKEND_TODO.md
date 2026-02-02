# Dirav Backend TODO (Implementation Tracker)

Use this as the single checklist for backend progress. Check items as they are implemented, tested, and integrated.

## 0) Foundations
- [x] Repo created for backend service
- [x] Go module initialized
- [x] Base project structure created (cmd/, internal/, config/, docs/)
- [x] Config loader + environment validation
- [ ] Logger wired (dev + prod configs)
- [ ] Dockerfile + docker-compose for dev
- [x] Health check endpoint

## 1) Database & Migrations
- [x] Postgres connection setup
- [ ] Migration tool configured
- [ ] Schema: users
- [ ] Schema: accounts
- [ ] Schema: transactions
- [ ] Schema: budgets
- [ ] Schema: savings_goals
- [ ] Schema: opportunities
- [ ] Schema: user_opportunities
- [ ] Schema: ai_conversations
- [ ] Schema: ai_messages
- [ ] Schema: notifications
- [ ] Schema: refresh_tokens
- [ ] Seed data for opportunities + blogs

## 2) Auth & Users
- [x] Register endpoint
- [x] Login endpoint
- [ ] JWT access + refresh tokens
- [ ] Logout + refresh token revocation
- [ ] Password reset flow
- [ ] Email verification flow
- [x] Auth middleware
- [x] User profile endpoints
- [ ] Student verification upload flow

## 3) Finance Core (Dashboard + Planning)
- [x] Account CRUD
- [x] Transaction CRUD
- [x] Transaction filters (date, type, category)
- [x] Budget CRUD
- [x] Budget progress endpoint
- [x] Monthly summary endpoint (balance, savings, allowance, spent, remaining)

## 4) Savings Goals
- [x] Savings goals CRUD
- [x] Contribute to goal endpoint
- [x] Auto-complete when target reached

## 5) Opportunities
- [ ] Public list endpoint
- [ ] Featured opportunities endpoint
- [ ] Claim opportunity endpoint
- [ ] Claimed list endpoint
- [ ] Categories endpoint
- [ ] Admin CRUD for opportunities

## 6) AI Advisor
- [ ] Conversation list/create
- [ ] Send message endpoint
- [ ] Conversation history endpoint
- [ ] Token usage logging
- [ ] Insights endpoint (summary + tips)

## 7) Notifications
- [ ] Notification list
- [ ] Mark read / read-all
- [ ] Notification triggers (budget alert, savings milestone, new opportunity)

## 8) Analytics
- [ ] Summary endpoint
- [ ] Spending analysis
- [ ] Income analysis
- [ ] Trend analysis
- [ ] Category breakdown

## 9) Content (Blogs)
- [ ] Blog list endpoint
- [ ] Blog detail endpoint
- [ ] Blog categories endpoint
- [ ] Admin CRUD for blogs

## 10) Non-Functional
- [ ] Input validation layer
- [ ] Rate limiting
- [ ] Error response standardization
- [ ] Observability (logs + metrics)
- [ ] Swagger/OpenAPI docs
- [ ] Unit tests for services
- [ ] Integration tests for routes

## 11) Frontend Integration
- [ ] Contract file finalized (`FRONTEND_BACKEND_CONTRACT.md`)
- [ ] Frontend API client stub created
- [ ] CORS settings aligned with frontend URLs
- [ ] Staging environment config
