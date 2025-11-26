# Dirav - Financial Empowerment for Students

## 1. Project Overview

**Dirav** is a mobile application designed to empower students by providing them with tools for budgeting, financial planning, and accessing student-centric privileges. Born from an innovation bootcamp where it earned third place and secured incubation, Dirav aims to foster financial literacy and help students manage their money effectively.

This document outlines the technical specifications, development roadmap, and deployment strategy for the Minimum Viable Product (MVP) of the Dirav application.

### 1.1. MVP Features

The core features for the MVP are:

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Allowance Planning** | Students can set up and track their monthly or weekly allowance |
| 2 | **Transaction Management** | Manually add income and expenses to track their balance |
| 3 | **Opportunity Hub** | Access to a curated list of discounts, scholarships, and opportunities tailored for students |
| 4 | **AI-Powered Advice** | Receive intelligent, rule-based advice on spending and saving habits |
| 5 | **Saving Goals** | Set and monitor progress towards specific saving goals |
| 6 | **Financial Literacy Blog** | A dedicated section with articles on financial topics |
| 7 | **Manual Tracking** | The MVP will not integrate with bank accounts or payment gateways; all data entry is manual |

---

## 2. Recommended Technology Stack

This stack is chosen for its robustness, scalability, and performance, making it ideal for building and scaling the Dirav application.

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Frontend** | **React Native** | Cross-platform framework for building iOS and Android apps from a single codebase. Large ecosystem and community support. |
| **Backend** | **Go** with **Gin** framework | Excellent performance, strong typing, and built-in concurrency support. Ideal for high-performance, scalable backend services. |
| **Database** | **PostgreSQL** | Powerful, open-source relational database with excellent data integrity - crucial for financial data. |
| **AI/ML** | **Python** with **FastAPI** (Microservice) | Industry standard for machine learning. Start with rule-based system, evolve to complex ML models. |
| **Deployment** | **Docker**, **Railway/Render** (Backend), **App/Play Stores** | Docker ensures consistency across environments. Modern PaaS platforms for backend deployment. |
| **Authentication** | **JWT** (JSON Web Tokens) | Secure, stateless authentication suitable for mobile applications. |

---

## 3. System Architecture

The application follows a microservices-oriented architecture to ensure scalability and separation of concerns.

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Native Mobile App                       │
│                     (iOS & Android)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (REST API)
                              │
          ┌───────────────────┴───────────────────┐
          │                                       │
          ▼                                       ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│      Go Backend         │         │   Python AI Service     │
│    (Gin Framework)      │         │     (FastAPI)           │
│                         │         │                         │
│ • User Authentication   │         │ • Financial Advice      │
│ • Transaction Logic     │◄───────►│ • Spending Analysis     │
│ • Goals & Budgets       │         │ • Savings Recommendations│
│ • Blog Content API      │         │                         │
│ • Opportunities API     │         └─────────────────────────┘
└─────────────────────────┘
          │
          │ SQL Connection
          ▼
┌─────────────────────────┐
│   PostgreSQL Database   │
│                         │
│ • Users                 │
│ • Transactions          │
│ • Goals & Budgets       │
│ • Blog Posts            │
│ • Opportunities         │
└─────────────────────────┘
```

---

## 4. Database Schema Design

### 4.1. Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │───────│ transactions │       │   budgets    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ email        │       │ user_id (FK) │       │ user_id (FK) │
│ password_hash│       │ type         │       │ period       │
│ full_name    │       │ amount       │       │ amount       │
│ created_at   │       │ category     │       │ start_date   │
│ updated_at   │       │ description  │       │ end_date     │
└──────────────┘       │ date         │       │ created_at   │
        │              │ created_at   │       └──────────────┘
        │              └──────────────┘               │
        │                                             │
        │              ┌──────────────┐               │
        └──────────────│ saving_goals │───────────────┘
                       ├──────────────┤
                       │ id (PK)      │
                       │ user_id (FK) │
                       │ goal_name    │
                       │ target_amount│
                       │ current_amount│
                       │ deadline     │
                       │ created_at   │
                       └──────────────┘

┌──────────────┐       ┌──────────────┐
│  blog_posts  │       │ opportunities│
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ title        │       │ title        │
│ content      │       │ description  │
│ author       │       │ type         │
│ category     │       │ eligibility  │
│ published_at │       │ link         │
│ created_at   │       │ deadline     │
└──────────────┘       │ created_at   │
                       └──────────────┘
```

### 4.2. SQL Schema

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets Table
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly')),
    amount DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saving Goals Table
CREATE TABLE saving_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    goal_name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0,
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    category VARCHAR(100),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities Table (Discounts, Scholarships, etc.)
CREATE TABLE opportunities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('discount', 'scholarship', 'opportunity')),
    eligibility TEXT,
    link VARCHAR(500),
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_saving_goals_user_id ON saving_goals(user_id);
CREATE INDEX idx_opportunities_type ON opportunities(type);
```

---

## 5. Step-by-Step Development Plan

### Phase 1: Backend Development (Go & PostgreSQL)

#### Step 1: Setup Environment

```bash
# Install Go (https://golang.org/doc/install)
# Verify installation
go version

# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql postgresql-contrib

# Create project directory
mkdir dirav-backend && cd dirav-backend

# Initialize Go module
go mod init github.com/your-username/dirav-backend

# Install dependencies
go get -u github.com/gin-gonic/gin
go get -u github.com/jackc/pgx/v5
go get -u github.com/golang-jwt/jwt/v5
go get -u github.com/joho/godotenv
go get -u golang.org/x/crypto/bcrypt
```

#### Step 2: Project Structure

```
dirav-backend/
├── main.go
├── go.mod
├── go.sum
├── .env
├── config/
│   └── database.go
├── models/
│   ├── user.go
│   ├── transaction.go
│   ├── budget.go
│   ├── goal.go
│   ├── blog.go
│   └── opportunity.go
├── handlers/
│   ├── auth.go
│   ├── transaction.go
│   ├── budget.go
│   ├── goal.go
│   ├── blog.go
│   └── opportunity.go
├── middleware/
│   └── auth.go
├── routes/
│   └── routes.go
└── utils/
    └── helpers.go
```

#### Step 3: Sample Code - Main Entry Point

```go
// main.go
package main

import (
    "log"
    "os"

    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
    "github.com/your-username/dirav-backend/config"
    "github.com/your-username/dirav-backend/routes"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }

    // Initialize database connection
    config.ConnectDB()

    // Setup Gin router
    router := gin.Default()

    // Setup CORS
    router.Use(CORSMiddleware())

    // Initialize routes
    routes.SetupRoutes(router)

    // Get port from environment
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    // Start server
    log.Printf("Server starting on port %s", port)
    router.Run(":" + port)
}

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    }
}
```

#### Step 4: Database Configuration

```go
// config/database.go
package config

import (
    "context"
    "log"
    "os"

    "github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB() {
    var err error
    dbURL := os.Getenv("DATABASE_URL")
    
    DB, err = pgxpool.New(context.Background(), dbURL)
    if err != nil {
        log.Fatal("Unable to connect to database:", err)
    }
    
    log.Println("Connected to PostgreSQL database")
}
```

#### Step 5: User Model and Authentication

```go
// models/user.go
package models

import "time"

type User struct {
    ID           int       `json:"id"`
    Email        string    `json:"email"`
    PasswordHash string    `json:"-"`
    FullName     string    `json:"full_name"`
    CreatedAt    time.Time `json:"created_at"`
    UpdatedAt    time.Time `json:"updated_at"`
}

type RegisterInput struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
    FullName string `json:"full_name" binding:"required"`
}

type LoginInput struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}
```

```go
// handlers/auth.go
package handlers

import (
    "context"
    "net/http"
    "os"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    "github.com/your-username/dirav-backend/config"
    "github.com/your-username/dirav-backend/models"
    "golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
    var input models.RegisterInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    // Insert user into database
    var userID int
    err = config.DB.QueryRow(context.Background(),
        "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id",
        input.Email, string(hashedPassword), input.FullName).Scan(&userID)
    
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully", "user_id": userID})
}

func Login(c *gin.Context) {
    var input models.LoginInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
    err := config.DB.QueryRow(context.Background(),
        "SELECT id, email, password_hash, full_name FROM users WHERE email = $1",
        input.Email).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.FullName)
    
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // Verify password
    if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // Generate JWT token
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID,
        "email":   user.Email,
        "exp":     time.Now().Add(time.Hour * 24 * 7).Unix(),
    })

    tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "token": tokenString,
        "user": gin.H{
            "id":        user.ID,
            "email":     user.Email,
            "full_name": user.FullName,
        },
    })
}
```

#### Step 6: Transaction Handler

```go
// models/transaction.go
package models

import "time"

type Transaction struct {
    ID          int       `json:"id"`
    UserID      int       `json:"user_id"`
    Type        string    `json:"type"` // "income" or "expense"
    Amount      float64   `json:"amount"`
    Category    string    `json:"category"`
    Description string    `json:"description"`
    Date        time.Time `json:"date"`
    CreatedAt   time.Time `json:"created_at"`
}

type TransactionInput struct {
    Type        string  `json:"type" binding:"required,oneof=income expense"`
    Amount      float64 `json:"amount" binding:"required,gt=0"`
    Category    string  `json:"category"`
    Description string  `json:"description"`
    Date        string  `json:"date" binding:"required"`
}
```

```go
// handlers/transaction.go
package handlers

import (
    "context"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/your-username/dirav-backend/config"
    "github.com/your-username/dirav-backend/models"
)

func CreateTransaction(c *gin.Context) {
    userID := c.GetInt("user_id")
    
    var input models.TransactionInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var transactionID int
    err := config.DB.QueryRow(context.Background(),
        `INSERT INTO transactions (user_id, type, amount, category, description, date) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        userID, input.Type, input.Amount, input.Category, input.Description, input.Date).Scan(&transactionID)
    
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Transaction created", "id": transactionID})
}

func GetTransactions(c *gin.Context) {
    userID := c.GetInt("user_id")
    
    rows, err := config.DB.Query(context.Background(),
        `SELECT id, type, amount, category, description, date, created_at 
         FROM transactions WHERE user_id = $1 ORDER BY date DESC`, userID)
    
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions"})
        return
    }
    defer rows.Close()

    var transactions []models.Transaction
    for rows.Next() {
        var t models.Transaction
        t.UserID = userID
        if err := rows.Scan(&t.ID, &t.Type, &t.Amount, &t.Category, &t.Description, &t.Date, &t.CreatedAt); err != nil {
            continue
        }
        transactions = append(transactions, t)
    }

    c.JSON(http.StatusOK, transactions)
}

func GetBalance(c *gin.Context) {
    userID := c.GetInt("user_id")
    
    var income, expense float64
    
    config.DB.QueryRow(context.Background(),
        `SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = $1 AND type = 'income'`,
        userID).Scan(&income)
    
    config.DB.QueryRow(context.Background(),
        `SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = $1 AND type = 'expense'`,
        userID).Scan(&expense)

    c.JSON(http.StatusOK, gin.H{
        "total_income":  income,
        "total_expense": expense,
        "balance":       income - expense,
    })
}

func DeleteTransaction(c *gin.Context) {
    userID := c.GetInt("user_id")
    transactionID, _ := strconv.Atoi(c.Param("id"))
    
    result, err := config.DB.Exec(context.Background(),
        "DELETE FROM transactions WHERE id = $1 AND user_id = $2",
        transactionID, userID)
    
    if err != nil || result.RowsAffected() == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Transaction deleted"})
}
```

#### Step 7: Routes Setup

```go
// routes/routes.go
package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/your-username/dirav-backend/handlers"
    "github.com/your-username/dirav-backend/middleware"
)

func SetupRoutes(router *gin.Engine) {
    // Public routes
    auth := router.Group("/api/auth")
    {
        auth.POST("/register", handlers.Register)
        auth.POST("/login", handlers.Login)
    }

    // Protected routes
    api := router.Group("/api")
    api.Use(middleware.AuthMiddleware())
    {
        // Transactions
        api.POST("/transactions", handlers.CreateTransaction)
        api.GET("/transactions", handlers.GetTransactions)
        api.DELETE("/transactions/:id", handlers.DeleteTransaction)
        api.GET("/balance", handlers.GetBalance)

        // Budgets
        api.POST("/budgets", handlers.CreateBudget)
        api.GET("/budgets", handlers.GetBudgets)
        api.PUT("/budgets/:id", handlers.UpdateBudget)
        api.DELETE("/budgets/:id", handlers.DeleteBudget)

        // Saving Goals
        api.POST("/goals", handlers.CreateGoal)
        api.GET("/goals", handlers.GetGoals)
        api.PUT("/goals/:id", handlers.UpdateGoal)
        api.DELETE("/goals/:id", handlers.DeleteGoal)
        api.POST("/goals/:id/contribute", handlers.ContributeToGoal)
    }

    // Public content routes
    content := router.Group("/api")
    {
        content.GET("/blogs", handlers.GetBlogs)
        content.GET("/blogs/:id", handlers.GetBlog)
        content.GET("/opportunities", handlers.GetOpportunities)
        content.GET("/opportunities/:id", handlers.GetOpportunity)
    }

    // AI Advice route (protected)
    api.GET("/advice", handlers.GetAIAdvice)
}
```

#### Step 8: Authentication Middleware

```go
// middleware/auth.go
package middleware

import (
    "net/http"
    "os"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
        
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
            c.Abort()
            return
        }

        c.Set("user_id", int(claims["user_id"].(float64)))
        c.Set("email", claims["email"].(string))
        c.Next()
    }
}
```

---

### Phase 2: Frontend Development (React Native)

#### Step 1: Setup Environment

```bash
# Install Node.js (https://nodejs.org/)
node --version
npm --version

# Install React Native CLI
npm install -g @react-native-community/cli

# Create new project
npx react-native init DiravApp

# Navigate to project
cd DiravApp

# Install dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install axios @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install @reduxjs/toolkit react-redux
```

#### Step 2: Project Structure

```
DiravApp/
├── App.tsx
├── src/
│   ├── api/
│   │   └── axios.ts
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── TransactionItem.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionsScreen.tsx
│   │   │   └── AddTransactionScreen.tsx
│   │   ├── budget/
│   │   │   └── BudgetScreen.tsx
│   │   ├── goals/
│   │   │   └── GoalsScreen.tsx
│   │   ├── opportunities/
│   │   │   └── OpportunitiesScreen.tsx
│   │   └── blog/
│   │       └── BlogScreen.tsx
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   └── transactionSlice.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── storage.ts
```

#### Step 3: API Configuration

```typescript
// src/api/axios.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-backend-url.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Step 4: Redux Store Setup

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transactionReducer from './transactionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  email: string;
  full_name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; full_name: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

#### Step 5: Sample Screen - Home Dashboard

```typescript
// src/screens/home/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import api from '../../api/axios';

interface Balance {
  total_income: number;
  total_expense: number;
  balance: number;
}

const HomeScreen = ({ navigation }) => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/balance');
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBalance();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to Dirav</Text>
        <Text style={styles.subtitle}>Your Financial Companion</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>
          ${balance?.balance.toFixed(2) || '0.00'}
        </Text>
        <View style={styles.balanceDetails}>
          <View style={styles.balanceItem}>
            <Text style={styles.incomeLabel}>Income</Text>
            <Text style={styles.incomeAmount}>
              +${balance?.total_income.toFixed(2) || '0.00'}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.expenseLabel}>Expenses</Text>
            <Text style={styles.expenseAmount}>
              -${balance?.total_expense.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddTransaction', { type: 'income' })}
        >
          <Text style={styles.actionButtonText}>+ Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.expenseButton]}
          onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
        >
          <Text style={styles.actionButtonText}>- Add Expense</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Budget')}
        >
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuLabel}>Budget</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Goals')}
        >
          <Text style={styles.menuIcon}>🎯</Text>
          <Text style={styles.menuLabel}>Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Opportunities')}
        >
          <Text style={styles.menuIcon}>💎</Text>
          <Text style={styles.menuLabel}>Opportunities</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Blog')}
        >
          <Text style={styles.menuIcon}>📚</Text>
          <Text style={styles.menuLabel}>Learn</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  balanceCard: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 25,
    borderRadius: 15,
    elevation: 5,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 5,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  balanceItem: {
    flex: 1,
  },
  incomeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  incomeAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  expenseLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  expenseAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  expenseButton: {
    backgroundColor: '#FF5722',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    marginTop: 10,
  },
  menuItem: {
    width: '50%',
    padding: 10,
  },
  menuIcon: {
    fontSize: 40,
    textAlign: 'center',
  },
  menuLabel: {
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
    fontWeight: '500',
  },
});

export default HomeScreen;
```

---

### Phase 3: AI Service Development (Python/FastAPI)

#### Step 1: Setup Environment

```bash
# Create project directory
mkdir dirav-ai-service && cd dirav-ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pydantic httpx python-dotenv
```

#### Step 2: Project Structure

```
dirav-ai-service/
├── main.py
├── requirements.txt
├── .env
├── models/
│   └── schemas.py
├── services/
│   └── advice_engine.py
└── utils/
    └── helpers.py
```

#### Step 3: Main Application

```python
# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from services.advice_engine import AdviceEngine

app = FastAPI(title="Dirav AI Service", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaction(BaseModel):
    type: str  # "income" or "expense"
    amount: float
    category: Optional[str] = None
    date: str

class AdviceRequest(BaseModel):
    transactions: List[Transaction]
    monthly_budget: Optional[float] = None
    saving_goal: Optional[float] = None

class AdviceResponse(BaseModel):
    advice: List[str]
    spending_analysis: dict
    recommendations: List[str]

advice_engine = AdviceEngine()

@app.get("/")
async def root():
    return {"message": "Dirav AI Service is running"}

@app.post("/api/advice", response_model=AdviceResponse)
async def get_financial_advice(request: AdviceRequest):
    try:
        result = advice_engine.analyze(
            transactions=request.transactions,
            monthly_budget=request.monthly_budget,
            saving_goal=request.saving_goal
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
```

#### Step 4: Advice Engine

```python
# services/advice_engine.py
from typing import List, Optional
from collections import defaultdict

class AdviceEngine:
    def __init__(self):
        self.spending_categories = {
            "food": {"budget_ratio": 0.30, "tips": [
                "Consider meal prepping to save on food costs",
                "Use student discounts at local restaurants",
                "Buy groceries in bulk with roommates"
            ]},
            "transport": {"budget_ratio": 0.15, "tips": [
                "Use public transportation or bike when possible",
                "Look for student transit passes",
                "Carpool with classmates"
            ]},
            "entertainment": {"budget_ratio": 0.10, "tips": [
                "Take advantage of free campus events",
                "Use student streaming discounts",
                "Host movie nights instead of going out"
            ]},
            "education": {"budget_ratio": 0.20, "tips": [
                "Buy used textbooks or rent them",
                "Use the library for resources",
                "Share subscriptions with classmates"
            ]},
            "other": {"budget_ratio": 0.25, "tips": [
                "Track every small expense",
                "Set up automatic savings",
                "Review subscriptions monthly"
            ]}
        }

    def analyze(self, transactions: List, monthly_budget: Optional[float] = None, 
                saving_goal: Optional[float] = None) -> dict:
        # Calculate totals
        total_income = sum(t.amount for t in transactions if t.type == "income")
        total_expense = sum(t.amount for t in transactions if t.type == "expense")
        balance = total_income - total_expense

        # Categorize expenses
        category_spending = defaultdict(float)
        for t in transactions:
            if t.type == "expense":
                category = t.category.lower() if t.category else "other"
                category_spending[category] += t.amount

        # Generate spending analysis
        spending_analysis = {
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": balance,
            "savings_rate": (balance / total_income * 100) if total_income > 0 else 0,
            "category_breakdown": dict(category_spending)
        }

        # Generate advice
        advice = []
        recommendations = []

        # Savings rate advice
        savings_rate = spending_analysis["savings_rate"]
        if savings_rate < 10:
            advice.append("⚠️ Your savings rate is below 10%. Try to save at least 20% of your income.")
        elif savings_rate < 20:
            advice.append("📈 You're saving, but aim for 20% or more for better financial security.")
        else:
            advice.append("✅ Great job! You're saving a healthy portion of your income.")

        # Budget comparison
        if monthly_budget and total_expense > monthly_budget:
            overspend = total_expense - monthly_budget
            advice.append(f"🚨 You've exceeded your budget by ${overspend:.2f}. Review your expenses.")
        elif monthly_budget and total_expense < monthly_budget * 0.9:
            advice.append("💪 You're under budget! Consider putting the extra into savings.")

        # Saving goal progress
        if saving_goal:
            progress = (balance / saving_goal * 100) if saving_goal > 0 else 0
            if progress >= 100:
                advice.append("🎉 Congratulations! You've reached your saving goal!")
            else:
                advice.append(f"🎯 You're {progress:.1f}% towards your saving goal. Keep going!")

        # Category-specific recommendations
        for category, amount in category_spending.items():
            if total_expense > 0:
                ratio = amount / total_expense
                expected_ratio = self.spending_categories.get(category, {}).get("budget_ratio", 0.25)
                
                if ratio > expected_ratio * 1.2:  # 20% over expected
                    tips = self.spending_categories.get(category, {}).get("tips", [])
                    if tips:
                        recommendations.append(f"📍 High {category} spending detected: {tips[0]}")

        # Add general tips if few recommendations
        if len(recommendations) < 3:
            recommendations.extend([
                "💡 Set up an emergency fund with 3-6 months of expenses",
                "💡 Review and cancel unused subscriptions",
                "💡 Look for student discounts wherever you shop"
            ])

        return {
            "advice": advice[:5],  # Limit to top 5 advice items
            "spending_analysis": spending_analysis,
            "recommendations": recommendations[:5]  # Limit to top 5 recommendations
        }
```

---

## 6. API Documentation

### 6.1. Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

#### Register User
```json
// POST /api/auth/register
// Request Body
{
  "email": "student@university.edu",
  "password": "securepassword123",
  "full_name": "John Doe"
}

// Response (201 Created)
{
  "message": "User registered successfully",
  "user_id": 1
}
```

#### Login
```json
// POST /api/auth/login
// Request Body
{
  "email": "student@university.edu",
  "password": "securepassword123"
}

// Response (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@university.edu",
    "full_name": "John Doe"
  }
}
```

### 6.2. Transaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/transactions` | Create transaction | Yes |
| GET | `/api/transactions` | Get all transactions | Yes |
| DELETE | `/api/transactions/:id` | Delete transaction | Yes |
| GET | `/api/balance` | Get balance summary | Yes |

### 6.3. Budget Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/budgets` | Create budget | Yes |
| GET | `/api/budgets` | Get all budgets | Yes |
| PUT | `/api/budgets/:id` | Update budget | Yes |
| DELETE | `/api/budgets/:id` | Delete budget | Yes |

### 6.4. Saving Goals Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/goals` | Create saving goal | Yes |
| GET | `/api/goals` | Get all goals | Yes |
| PUT | `/api/goals/:id` | Update goal | Yes |
| DELETE | `/api/goals/:id` | Delete goal | Yes |
| POST | `/api/goals/:id/contribute` | Add to goal amount | Yes |

### 6.5. Content Endpoints (Public)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blogs` | Get all blog posts | No |
| GET | `/api/blogs/:id` | Get single blog post | No |
| GET | `/api/opportunities` | Get all opportunities | No |
| GET | `/api/opportunities/:id` | Get single opportunity | No |

### 6.6. AI Advice Endpoint

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/advice` | Get AI financial advice | Yes |

---

## 7. Deployment Guide

### 7.1. Backend Deployment (Docker + Railway/Render)

#### Dockerfile for Go Backend

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Production stage
FROM alpine:latest

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/main .

# Expose port
EXPOSE 8080

# Run the application
CMD ["./main"]
```

#### Environment Variables (.env)

```env
# Database
DATABASE_URL=postgres://user:password@host:5432/dirav_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server
PORT=8080

# AI Service
AI_SERVICE_URL=https://dirav-ai.railway.app
```

### 7.2. AI Service Deployment

#### Dockerfile for Python AI Service

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### requirements.txt

```
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.2
python-dotenv==1.0.0
httpx==0.25.2
```

### 7.3. Deployment Steps

#### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables
railway variables set DATABASE_URL=your_postgres_url
railway variables set JWT_SECRET=your_jwt_secret
```

#### Mobile App Release

##### Android (Google Play Store)

```bash
# Generate release keystore
keytool -genkeypair -v -storetype PKCS12 -keystore dirav-release-key.keystore -alias dirav-key -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
cd android
./gradlew assembleRelease

# Build AAB for Play Store
./gradlew bundleRelease
```

##### iOS (App Store)

1. Open project in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Distribute App → App Store Connect
5. Upload to App Store Connect

---

## 8. Testing Strategy

### 8.1. Backend Testing (Go)

```go
// handlers/auth_test.go
package handlers

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
)

func TestRegister(t *testing.T) {
    gin.SetMode(gin.TestMode)
    router := gin.Default()
    router.POST("/api/auth/register", Register)

    body := map[string]string{
        "email":     "test@example.com",
        "password":  "password123",
        "full_name": "Test User",
    }
    jsonBody, _ := json.Marshal(body)

    req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonBody))
    req.Header.Set("Content-Type", "application/json")

    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusCreated, w.Code)
}
```

### 8.2. Frontend Testing (React Native)

```typescript
// __tests__/HomeScreen.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/home/HomeScreen';

jest.mock('../src/api/axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: { total_income: 1000, total_expense: 500, balance: 500 }
  }))
}));

describe('HomeScreen', () => {
  it('displays balance correctly', async () => {
    const { getByText } = render(<HomeScreen navigation={{}} />);
    
    await waitFor(() => {
      expect(getByText('$500.00')).toBeTruthy();
    });
  });
});
```

---

## 9. Security Considerations

### 9.1. Authentication & Authorization

- Use JWT tokens with short expiration (7 days for mobile)
- Implement refresh token rotation
- Store tokens securely using platform-specific secure storage
- Validate all JWT claims on the server

### 9.2. Data Protection

- Hash passwords using bcrypt with minimum 10 rounds
- Use HTTPS for all API communications
- Implement rate limiting on authentication endpoints
- Sanitize all user inputs to prevent SQL injection

### 9.3. Mobile Security

- Enable certificate pinning for API calls
- Use secure storage (Keychain for iOS, Keystore for Android)
- Implement app integrity checks
- Obfuscate code in release builds

---

## 10. Future Enhancements

After MVP launch, consider these features for future versions:

1. **Bank Integration** - Connect to bank accounts via Plaid or similar services
2. **Push Notifications** - Budget alerts, goal milestones, new opportunities
3. **Social Features** - Share saving goals with friends, financial challenges
4. **Advanced AI** - Machine learning-based predictions and personalized advice
5. **Multi-currency Support** - For international students
6. **Receipt Scanning** - OCR to automatically log expenses
7. **Investment Education** - Introduce basic investment concepts
8. **Community Forums** - Peer support and financial tips sharing

---

## 11. Contact & Support

For questions, issues, or contributions to the Dirav project:

- **GitHub Repository**: [github.com/your-username/dirav](https://github.com/your-username/dirav)
- **Documentation**: [docs.dirav.app](https://docs.dirav.app)
- **Email**: support@dirav.app

---

*This documentation is maintained by the Dirav development team. Last updated: 2024*
