# Dirav Backend - Quick Start Guide

**Getting Started with Go Backend Development**

---

## ⚡ Quick Setup (5 Minutes)

### **Prerequisites**
- Go 1.21+ installed ([Download](https://golang.org/dl/))
- PostgreSQL installed ([Download](https://www.postgresql.org/download/))
- Git installed
- Code editor (VS Code recommended)

### **Verify Installation**
```bash
go version          # Should show go1.21 or higher
psql --version      # Should show PostgreSQL 15+
```

---

## 🚀 Create Your First Backend

### **Step 1: Initialize Project**
```bash
# Create project directory
mkdir dirav-backend
cd dirav-backend

# Initialize Go module
go mod init github.com/yourusername/dirav-backend

# Create project structure
mkdir -p cmd/api internal/api/handlers internal/models config
```

### **Step 2: Install Dependencies**
```bash
# Core framework
go get -u github.com/gin-gonic/gin

# Database
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres

# Authentication
go get -u github.com/golang-jwt/jwt/v5
go get -u golang.org/x/crypto/bcrypt

# Configuration
go get -u github.com/joho/godotenv

# Validation
go get -u github.com/go-playground/validator/v10
```

### **Step 3: Create Database**
```bash
# Connect to PostgreSQL
psql -U postgres

# In psql:
CREATE DATABASE dirav_db;
CREATE USER dirav WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE dirav_db TO dirav;
\q
```

### **Step 4: Create .env File**
```bash
cat > .env << EOL
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=dirav
DB_PASSWORD=your_password
DB_NAME=dirav_db
JWT_SECRET=your_super_secret_key_change_this_in_production
EOL
```

---

## 📝 Minimal Working Example

### **File: cmd/api/main.go**
```go
package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID        uint   `gorm:"primaryKey"`
	Email     string `gorm:"unique;not null"`
	FirstName string
	LastName  string
}

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Database connection
	dsn := "host=" + os.Getenv("DB_HOST") +
		" user=" + os.Getenv("DB_USER") +
		" password=" + os.Getenv("DB_PASSWORD") +
		" dbname=" + os.Getenv("DB_NAME") +
		" port=" + os.Getenv("DB_PORT") +
		" sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate
	db.AutoMigrate(&User{})

	// Create Gin router
	r := gin.Default()

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Dirav API is running",
		})
	})

	// Get all users
	r.GET("/api/v1/users", func(c *gin.Context) {
		var users []User
		db.Find(&users)
		c.JSON(200, gin.H{
			"users": users,
		})
	})

	// Create user
	r.POST("/api/v1/users", func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		db.Create(&user)
		c.JSON(201, gin.H{
			"message": "User created",
			"user":    user,
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s...", port)
	r.Run(":" + port)
}
```

### **Run Your Server**
```bash
go run cmd/api/main.go
```

### **Test Your API**
```bash
# Health check
curl http://localhost:8080/health

# Create a user
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"John","lastName":"Doe"}'

# Get all users
curl http://localhost:8080/api/v1/users
```

---

## 🔐 Add Authentication (Step-by-Step)

### **File: internal/models/user.go**
```go
package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Email        string         `gorm:"unique;not null" json:"email" binding:"required,email"`
	PasswordHash string         `gorm:"not null" json:"-"`
	FirstName    string         `json:"firstName" binding:"required"`
	LastName     string         `json:"lastName" binding:"required"`
	StudentVerified bool        `json:"studentVerified"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
```

### **File: internal/api/handlers/auth.go**
```go
package handlers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"github.com/yourusername/dirav-backend/internal/models"
)

type AuthHandler struct {
	DB *gorm.DB
}

type RegisterRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=8"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string       `json:"token"`
	User  models.User  `json:"user"`
}

// Register creates a new user
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var existingUser models.User
	if err := h.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create user
	user := models.User{
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		FirstName:    req.FirstName,
		LastName:     req.LastName,
	}

	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate JWT token
	token, err := generateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, AuthResponse{
		Token: token,
		User:  user,
	})
}

// Login authenticates a user
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user
	var user models.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT token
	token, err := generateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token: token,
		User:  user,
	})
}

func generateJWT(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
```

### **File: internal/api/middleware/auth.go**
```go
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

		// Extract token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token required"})
			c.Abort()
			return
		}

		// Parse token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Extract user ID from token
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("user_id", uint(claims["user_id"].(float64)))
		}

		c.Next()
	}
}
```

### **Update main.go to use authentication**
```go
package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/yourusername/dirav-backend/internal/api/handlers"
	"github.com/yourusername/dirav-backend/internal/api/middleware"
	"github.com/yourusername/dirav-backend/internal/models"
)

func main() {
	// Load .env
	godotenv.Load()

	// Database connection
	dsn := "host=" + os.Getenv("DB_HOST") +
		" user=" + os.Getenv("DB_USER") +
		" password=" + os.Getenv("DB_PASSWORD") +
		" dbname=" + os.Getenv("DB_NAME") +
		" port=" + os.Getenv("DB_PORT") +
		" sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate
	db.AutoMigrate(&models.User{})

	// Initialize handlers
	authHandler := &handlers.AuthHandler{DB: db}

	// Router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Public routes
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := r.Group("/api/v1")
	{
		// Auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/users/me", func(c *gin.Context) {
				userID := c.GetUint("user_id")
				var user models.User
				db.First(&user, userID)
				c.JSON(200, user)
			})
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s...", port)
	r.Run(":" + port)
}
```

---

## 🧪 Test Authentication

### **Register a user**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### **Login**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

### **Access protected route**
```bash
curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📦 Create Makefile for Common Commands

```makefile
# Makefile
.PHONY: run build test clean migrate

run:
	go run cmd/api/main.go

build:
	go build -o bin/api cmd/api/main.go

test:
	go test -v ./...

clean:
	rm -rf bin/

install:
	go mod download

dev:
	air # requires air to be installed (go install github.com/cosmtrek/air@latest)

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

db-create:
	docker exec -it dirav-postgres psql -U postgres -c "CREATE DATABASE dirav_db;"

db-migrate:
	go run cmd/api/main.go migrate

lint:
	golangci-lint run
```

---

## 🛠 Development Tools

### **Install Hot Reload (Optional)**
```bash
go install github.com/cosmtrek/air@latest
```

Create `.air.toml`:
```toml
root = "."
tmp_dir = "tmp"

[build]
  cmd = "go build -o ./tmp/main ./cmd/api"
  bin = "tmp/main"
  include_ext = ["go"]
  exclude_dir = ["tmp"]
  delay = 1000
```

Run with hot reload:
```bash
air
```

### **VS Code Extensions**
- Go (official Go extension)
- REST Client or Thunder Client (for API testing)
- PostgreSQL (for database management)

---

## 📚 Next Steps

1. **Add More Models**
   - Transaction
   - Budget
   - Savings Goal

2. **Create Services Layer**
   - Separate business logic from handlers
   - Make code more testable

3. **Add Validation**
   - Use validator package
   - Custom validation rules

4. **Error Handling**
   - Create custom error types
   - Standardized error responses

5. **Testing**
   - Write unit tests
   - Integration tests
   - Mock database

6. **Documentation**
   - Add Swagger/OpenAPI
   - API documentation

---

## 🐛 Common Issues & Solutions

### **Issue: Cannot connect to PostgreSQL**
```bash
# Check if PostgreSQL is running
psql -U postgres

# If not, start it:
# macOS (with Homebrew):
brew services start postgresql

# Linux:
sudo systemctl start postgresql
```

### **Issue: Port already in use**
```bash
# Find process using port 8080
lsof -i :8080

# Kill it
kill -9 <PID>
```

### **Issue: JWT secret not found**
Make sure `.env` file exists and `JWT_SECRET` is set.

---

## 📊 Progress Checklist

- [ ] Go installed and working
- [ ] PostgreSQL installed and running
- [ ] Project initialized
- [ ] Dependencies installed
- [ ] Database created
- [ ] Basic server running
- [ ] Health check endpoint works
- [ ] User registration working
- [ ] User login working
- [ ] JWT authentication working
- [ ] Protected routes working

---

## 🎯 Your Action Plan

**Today:**
1. Set up Go environment
2. Create basic server
3. Test health check endpoint

**This Week:**
1. Implement authentication
2. Create user model
3. Test with Postman

**Next Week:**
1. Add transactions model
2. Create transaction endpoints
3. Write tests

---

You're now ready to start building your Dirav backend! Start simple, test often, and gradually add more features. Good luck! 🚀
