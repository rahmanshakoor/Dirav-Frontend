package routes

import (
	"dirav-backend/internal/api/handlers"
	"dirav-backend/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

func Register(r *gin.Engine, h *handlers.Handler) {
	api := r.Group("/api/v1")
	api.GET("/health", h.Health)
	api.POST("/auth/register", h.Register)
	api.POST("/auth/login", h.Login)

	authed := api.Group("/")
	authed.Use(middleware.AuthMiddleware(h.JWTSecret))

	authed.GET("/users/me", h.GetMe)
	authed.PUT("/users/me", h.UpdateMe)

	authed.GET("/accounts", h.ListAccounts)
	authed.POST("/accounts", h.CreateAccount)
	authed.GET("/accounts/:id", h.GetAccount)
	authed.PUT("/accounts/:id", h.UpdateAccount)
	authed.DELETE("/accounts/:id", h.DeleteAccount)

	authed.GET("/transactions", h.ListTransactions)
	authed.POST("/transactions", h.CreateTransaction)
	authed.GET("/transactions/:id", h.GetTransaction)
	authed.PUT("/transactions/:id", h.UpdateTransaction)
	authed.DELETE("/transactions/:id", h.DeleteTransaction)

	authed.GET("/budgets", h.ListBudgets)
	authed.POST("/budgets", h.CreateBudget)
	authed.GET("/budgets/:id", h.GetBudget)
	authed.PUT("/budgets/:id", h.UpdateBudget)
	authed.DELETE("/budgets/:id", h.DeleteBudget)
	authed.GET("/budgets/:id/progress", h.BudgetProgress)

	authed.GET("/savings", h.ListSavings)
	authed.POST("/savings", h.CreateSavings)
	authed.PUT("/savings/:id", h.UpdateSavings)
	authed.DELETE("/savings/:id", h.DeleteSavings)
	authed.POST("/savings/:id/contribute", h.ContributeSavings)

	authed.GET("/analytics/summary", h.Summary)
}
