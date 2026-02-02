# Dirav Backend Architecture - Go Implementation

**Last Updated:** December 19, 2025  
**Backend Language:** Go (Golang)  
**Status:** Not Started (0% complete)

---

## ✅ Tracking Docs
- Implementation checklist: `BACKEND_TODO.md`
- Frontend↔Backend contract: `FRONTEND_BACKEND_CONTRACT.md`

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Apps                              │
│              (iOS / Android / Web)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS/REST API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  API Gateway / Load Balancer                 │
│                     (Nginx/Cloudflare)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Go Backend Server                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication Middleware (JWT)                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  Auth Service  │  │  User Service  │  │ Transaction  │  │
│  │                │  │                │  │   Service    │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Budget Service │  │ Savings Service│  │ Opportunity  │  │
│  │                │  │                │  │   Service    │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  AI Service    │  │ Notification   │  │  Analytics   │  │
│  │  (OpenAI API)  │  │   Service      │  │   Service    │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼────────┐
│  PostgreSQL  │ │    Redis    │ │  S3 Storage  │
│  (Primary)   │ │   (Cache)   │ │  (Files)     │
└──────────────┘ └─────────────┘ └──────────────┘
```

---

## 📁 Project Structure

```
dirav-backend/
│
├── cmd/
│   └── api/
│       └── main.go                 # Application entry point
│
├── internal/
│   ├── api/                        # API layer
│   │   ├── handlers/               # HTTP handlers
│   │   │   ├── auth.go
│   │   │   ├── user.go
│   │   │   ├── transaction.go
│   │   │   ├── budget.go
│   │   │   ├── savings.go
│   │   │   ├── opportunity.go
│   │   │   └── ai.go
│   │   │
│   │   ├── middleware/             # HTTP middleware
│   │   │   ├── auth.go
│   │   │   ├── cors.go
│   │   │   ├── logger.go
│   │   │   └── rate_limit.go
│   │   │
│   │   └── routes/                 # Route definitions
│   │       └── routes.go
│   │
│   ├── services/                   # Business logic
│   │   ├── auth_service.go
│   │   ├── user_service.go
│   │   ├── transaction_service.go
│   │   ├── budget_service.go
│   │   ├── savings_service.go
│   │   ├── opportunity_service.go
│   │   ├── ai_service.go
│   │   └── notification_service.go
│   │
│   ├── repository/                 # Data access layer
│   │   ├── user_repository.go
│   │   ├── transaction_repository.go
│   │   ├── budget_repository.go
│   │   └── opportunity_repository.go
│   │
│   ├── models/                     # Data models
│   │   ├── user.go
│   │   ├── transaction.go
│   │   ├── budget.go
│   │   ├── savings.go
│   │   └── opportunity.go
│   │
│   ├── database/                   # Database setup
│   │   ├── postgres.go
│   │   ├── redis.go
│   │   └── migrations/
│   │       ├── 001_init.sql
│   │       ├── 002_transactions.sql
│   │       └── ...
│   │
│   └── utils/                      # Utility functions
│       ├── jwt.go
│       ├── hash.go
│       ├── validator.go
│       └── response.go
│
├── pkg/                            # Public packages
│   ├── logger/
│   └── config/
│
├── config/                         # Configuration files
│   ├── config.yaml
│   └── config.go
│
├── scripts/                        # Helper scripts
│   ├── migrate.sh
│   └── seed.sh
│
├── tests/                          # Tests
│   ├── integration/
│   └── unit/
│
├── docs/                           # Documentation
│   ├── api/
│   │   └── swagger.yaml
│   └── README.md
│
├── .env.example                    # Environment variables template
├── .gitignore
├── go.mod                          # Go dependencies
├── go.sum
├── Dockerfile
├── docker-compose.yml
└── Makefile                        # Build commands
```

---

## 🗃️ Database Schema

### **Users Table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    student_verified BOOLEAN DEFAULT FALSE,
    university VARCHAR(255),
    student_id VARCHAR(100),
    profile_picture_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_verified ON users(student_verified);
```

### **Accounts Table** (Financial accounts)
```sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'checking', 'savings', 'cash', 'allowance'
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
```

### **Transactions Table**
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'income', 'expense'
    category VARCHAR(50), -- 'food', 'transport', 'education', 'entertainment', etc.
    transaction_date DATE NOT NULL,
    receipt_url TEXT,
    location VARCHAR(255),
    merchant VARCHAR(255),
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
```

### **Budgets Table**
```sql
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    period VARCHAR(20) NOT NULL, -- 'weekly', 'monthly', 'yearly'
    category VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    alert_threshold DECIMAL(5, 2) DEFAULT 90.00, -- Alert at 90% spent
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_period ON budgets(period);
```

### **Savings Goals Table**
```sql
CREATE TABLE savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0.00,
    deadline DATE,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    category VARCHAR(50), -- 'emergency', 'travel', 'gadget', 'tuition'
    icon VARCHAR(50),
    color VARCHAR(20),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX idx_savings_goals_completed ON savings_goals(is_completed);
```

### **Opportunities Table** (Deals/Discounts)
```sql
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    discount_type VARCHAR(50), -- 'percentage', 'fixed', 'bogo', 'grant'
    discount_value VARCHAR(50), -- '40%', '$200', 'Buy 1 Get 1'
    provider VARCHAR(255) NOT NULL, -- Merchant/company name
    category VARCHAR(50), -- 'tech', 'food', 'travel', 'education'
    requirements TEXT, -- 'Student ID required'
    terms_url TEXT,
    redemption_url TEXT,
    redemption_code VARCHAR(100),
    valid_from DATE,
    valid_until DATE,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    claim_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_opportunities_category ON opportunities(category);
CREATE INDEX idx_opportunities_featured ON opportunities(is_featured);
CREATE INDEX idx_opportunities_active ON opportunities(is_active);
CREATE INDEX idx_opportunities_valid ON opportunities(valid_from, valid_until);
```

### **User Opportunities Table** (Tracking user claims)
```sql
CREATE TABLE user_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP,
    savings_amount DECIMAL(15, 2),
    notes TEXT,
    UNIQUE(user_id, opportunity_id)
);

CREATE INDEX idx_user_opportunities_user_id ON user_opportunities(user_id);
CREATE INDEX idx_user_opportunities_opportunity_id ON user_opportunities(opportunity_id);
```

### **AI Conversations Table**
```sql
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
```

### **AI Messages Table**
```sql
CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant'
    content TEXT NOT NULL,
    tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);
```

### **Notifications Table**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'budget_alert', 'savings_milestone', 'new_opportunity'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

### **Session Tokens Table** (For JWT refresh tokens)
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

---

## 🔐 API Endpoints

### **Authentication**
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login user
POST   /api/v1/auth/logout            # Logout user
POST   /api/v1/auth/refresh           # Refresh access token
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password
GET    /api/v1/auth/verify-email      # Verify email address
```

### **User Profile**
```
GET    /api/v1/users/me               # Get current user profile
PUT    /api/v1/users/me               # Update user profile
DELETE /api/v1/users/me               # Delete user account
POST   /api/v1/users/me/verify-student # Upload student verification
GET    /api/v1/users/me/stats         # Get user financial stats
```

### **Accounts**
```
GET    /api/v1/accounts               # List all user accounts
POST   /api/v1/accounts               # Create new account
GET    /api/v1/accounts/:id           # Get account details
PUT    /api/v1/accounts/:id           # Update account
DELETE /api/v1/accounts/:id           # Delete account
```

### **Transactions**
```
GET    /api/v1/transactions           # List transactions (with filters)
POST   /api/v1/transactions           # Create transaction
GET    /api/v1/transactions/:id       # Get transaction details
PUT    /api/v1/transactions/:id       # Update transaction
DELETE /api/v1/transactions/:id       # Delete transaction
GET    /api/v1/transactions/export    # Export transactions (CSV/PDF)
POST   /api/v1/transactions/bulk      # Bulk import transactions
```

### **Budgets**
```
GET    /api/v1/budgets                # List all budgets
POST   /api/v1/budgets                # Create budget
GET    /api/v1/budgets/:id            # Get budget details
PUT    /api/v1/budgets/:id            # Update budget
DELETE /api/v1/budgets/:id            # Delete budget
GET    /api/v1/budgets/:id/progress   # Get budget progress
```

### **Savings Goals**
```
GET    /api/v1/savings                # List all savings goals
POST   /api/v1/savings                # Create savings goal
GET    /api/v1/savings/:id            # Get savings goal details
PUT    /api/v1/savings/:id            # Update savings goal
DELETE /api/v1/savings/:id            # Delete savings goal
POST   /api/v1/savings/:id/contribute # Add contribution to goal
```

### **Opportunities (Student Deals)**
```
GET    /api/v1/opportunities          # List all opportunities (public)
GET    /api/v1/opportunities/featured # Get featured opportunities
GET    /api/v1/opportunities/:id      # Get opportunity details
POST   /api/v1/opportunities/:id/claim # Claim opportunity
GET    /api/v1/opportunities/claimed  # List user's claimed opportunities
GET    /api/v1/opportunities/categories # Get categories
```

### **AI Advisor**
```
GET    /api/v1/ai/conversations       # List conversations
POST   /api/v1/ai/conversations       # Create new conversation
GET    /api/v1/ai/conversations/:id   # Get conversation history
POST   /api/v1/ai/conversations/:id/messages # Send message
DELETE /api/v1/ai/conversations/:id   # Delete conversation
POST   /api/v1/ai/insights            # Get financial insights
```

### **Notifications**
```
GET    /api/v1/notifications          # List notifications
PUT    /api/v1/notifications/:id/read # Mark as read
PUT    /api/v1/notifications/read-all # Mark all as read
DELETE /api/v1/notifications/:id      # Delete notification
```

### **Analytics**
```
GET    /api/v1/analytics/summary      # Financial summary
GET    /api/v1/analytics/spending     # Spending analysis
GET    /api/v1/analytics/income       # Income analysis
GET    /api/v1/analytics/trends       # Trends over time
GET    /api/v1/analytics/categories   # Category breakdown
```

---

## 🔧 Technology Stack

### **Core Framework**
```
Framework:      Gin (github.com/gin-gonic/gin)
Alternative:    Fiber (if you prefer Express-like syntax)
```

### **Database**
```
Database:       PostgreSQL 15+
ORM:            GORM (gorm.io/gorm)
Migration Tool: golang-migrate or GORM AutoMigrate
Cache:          Redis
```

### **Authentication**
```
JWT:            golang-jwt/jwt (github.com/golang-jwt/jwt/v5)
Password:       bcrypt (golang.org/x/crypto/bcrypt)
Validation:     validator (github.com/go-playground/validator/v10)
```

### **External Services**
```
AI:             OpenAI Go SDK (github.com/sashabaranov/go-openai)
Email:          SendGrid or AWS SES
Storage:        AWS S3 SDK (github.com/aws/aws-sdk-go-v2)
Push:           Firebase Admin SDK
```

### **Utilities**
```
Config:         Viper (github.com/spf13/viper)
Logging:        Zap (go.uber.org/zap)
Testing:        Testify (github.com/stretchr/testify)
API Docs:       Swagger (github.com/swaggo/swag)
Environment:    godotenv (github.com/joho/godotenv)
```

---

## 🚀 Implementation Roadmap

### **Week 1-2: Project Setup**
- [ ] Initialize Go project
- [ ] Set up project structure
- [ ] Configure PostgreSQL database
- [ ] Set up Redis
- [ ] Create database migrations
- [ ] Configure environment variables
- [ ] Set up logging
- [ ] Create Makefile for common commands

### **Week 3-4: Authentication System**
- [ ] User registration endpoint
- [ ] Email validation
- [ ] Password hashing
- [ ] JWT token generation
- [ ] Login endpoint
- [ ] Token refresh mechanism
- [ ] Password reset flow
- [ ] Auth middleware
- [ ] Rate limiting

### **Week 5-6: Core Features**
- [ ] User profile CRUD
- [ ] Account management
- [ ] Transaction CRUD
- [ ] Category management
- [ ] File upload (receipts, profile pics)
- [ ] Transaction filtering & search
- [ ] Data validation

### **Week 7-8: Budget & Savings**
- [ ] Budget creation and management
- [ ] Budget progress tracking
- [ ] Budget alerts
- [ ] Savings goals CRUD
- [ ] Savings contributions
- [ ] Goal completion tracking
- [ ] Analytics calculations

### **Week 9-10: Opportunities System**
- [ ] Opportunities CRUD (admin)
- [ ] Public opportunity listing
- [ ] Opportunity claiming
- [ ] Usage tracking
- [ ] Search and filtering
- [ ] Featured opportunities

### **Week 11-12: AI Integration**
- [ ] OpenAI API integration
- [ ] Conversation management
- [ ] Context building (user financial data)
- [ ] Message history
- [ ] Token usage tracking
- [ ] Financial insights generation
- [ ] Spending pattern analysis

### **Week 13-14: Notifications & Analytics**
- [ ] Notification system
- [ ] Push notification integration
- [ ] Email notifications
- [ ] Budget alerts
- [ ] Savings milestones
- [ ] Analytics endpoints
- [ ] Spending reports
- [ ] Income/expense trends

### **Week 15-16: Testing & Documentation**
- [ ] Unit tests for services
- [ ] Integration tests
- [ ] API documentation (Swagger)
- [ ] Postman collection
- [ ] Error handling
- [ ] Security audit
- [ ] Performance optimization
- [ ] Load testing

---

## 📝 Environment Variables (.env)

```env
# Server Configuration
PORT=8080
ENV=development # development, staging, production
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=dirav
DB_PASSWORD=your_password
DB_NAME=dirav_db
DB_SSL_MODE=disable

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=dirav-storage

# Email (SendGrid)
SENDGRID_API_KEY=SG....
FROM_EMAIL=noreply@dirav.com
FROM_NAME=Dirav Finance

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=dirav-app
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=1m

# Student Verification (Optional)
SHEERID_API_KEY=...

# Logging
LOG_LEVEL=debug # debug, info, warn, error
```

---

## 🔒 Security Checklist

- [ ] HTTPS only in production
- [ ] JWT token expiration
- [ ] Password strength validation
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all endpoints
- [ ] Secure headers (helmet equivalent)
- [ ] Secrets in environment variables
- [ ] Database connection pooling
- [ ] Error messages don't leak sensitive info
- [ ] File upload size limits
- [ ] File type validation
- [ ] API versioning

---

## 📦 Deployment

### **Docker Setup**
```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main cmd/api/main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .
EXPOSE 8080
CMD ["./main"]
```

### **Docker Compose**
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: dirav
      POSTGRES_PASSWORD: password
      POSTGRES_DB: dirav_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 🧪 Testing Commands

```bash
# Run all tests
make test

# Run with coverage
make test-coverage

# Run specific package tests
go test ./internal/services/...

# Integration tests
make test-integration

# Load testing (using k6)
k6 run tests/load/scenario.js
```

---

## 📊 Monitoring & Logging

### **Recommended Tools**
```
Error Tracking:    Sentry
APM:               New Relic or Datadog
Logging:           ELK Stack or CloudWatch
Metrics:           Prometheus + Grafana
Uptime:            UptimeRobot or Pingdom
```

---

## 🎯 Next Immediate Steps

1. **Create Project Repository**
   ```bash
   mkdir dirav-backend
   cd dirav-backend
   go mod init github.com/yourusername/dirav-backend
   ```

2. **Install Core Dependencies**
   ```bash
   go get -u github.com/gin-gonic/gin
   go get -u gorm.io/gorm
   go get -u gorm.io/driver/postgres
   go get -u github.com/golang-jwt/jwt/v5
   go get -u golang.org/x/crypto/bcrypt
   ```

3. **Set Up Database**
   ```bash
   # Install PostgreSQL locally or use Docker
   docker run --name dirav-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

4. **Create First Endpoint**
   - Health check endpoint
   - User registration
   - User login

5. **Test API**
   - Use Postman or curl
   - Write basic tests

---

This backend architecture provides a solid foundation for your Dirav mobile app. Focus on building it incrementally, starting with authentication and core features before moving to advanced functionality.
