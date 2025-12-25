package handlers

import (
	"net/http"
	"time"

	"dirav-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type budgetRequest struct {
	Name      string  `json:"name"`
	Amount    float64 `json:"amount"`
	Period    string  `json:"period"`
	Category  string  `json:"category"`
	StartDate string  `json:"start_date"`
	EndDate   string  `json:"end_date"`
	IsActive  bool    `json:"is_active"`
}

func (h *Handler) ListBudgets(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	query := h.DB.Where("user_id = ?", userID)
	if period := c.Query("period"); period != "" {
		query = query.Where("period = ?", period)
	}
	if active := c.Query("active"); active != "" {
		if active == "true" {
			query = query.Where("is_active = true")
		}
		if active == "false" {
			query = query.Where("is_active = false")
		}
	}

	var budgets []models.Budget
	if err := query.Order("created_at desc").Find(&budgets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	c.JSON(http.StatusOK, budgets)
}

func (h *Handler) CreateBudget(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req budgetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date"})
		return
	}

	var endDate *time.Time
	if req.EndDate != "" {
		parsed, err := time.Parse("2006-01-02", req.EndDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date"})
			return
		}
		endDate = &parsed
	}

	budget := models.Budget{
		UserID:    userID,
		Name:      req.Name,
		Amount:    req.Amount,
		Period:    req.Period,
		Category:  req.Category,
		StartDate: startDate,
		EndDate:   endDate,
		IsActive:  req.IsActive,
	}

	if err := h.DB.Create(&budget).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusCreated, budget)
}

func (h *Handler) GetBudget(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var budget models.Budget
	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).First(&budget).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	c.JSON(http.StatusOK, budget)
}

func (h *Handler) UpdateBudget(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req budgetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	updates := map[string]interface{}{
		"name":      req.Name,
		"amount":    req.Amount,
		"period":    req.Period,
		"category":  req.Category,
		"is_active": req.IsActive,
	}

	if req.StartDate != "" {
		startDate, err := time.Parse("2006-01-02", req.StartDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date"})
			return
		}
		updates["start_date"] = startDate
	}

	if req.EndDate != "" {
		endDate, err := time.Parse("2006-01-02", req.EndDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date"})
			return
		}
		updates["end_date"] = endDate
	}

	if err := h.DB.Model(&models.Budget{}).
		Where("id = ? AND user_id = ?", id, userID).
		Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}

func (h *Handler) DeleteBudget(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Budget{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

func (h *Handler) BudgetProgress(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var budget models.Budget
	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).First(&budget).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	start := budget.StartDate
	end := time.Now()
	if budget.EndDate != nil {
		end = *budget.EndDate
	}

	var total float64
	if err := h.DB.Model(&models.Transaction{}).
		Where("user_id = ? AND type = ? AND transaction_date >= ? AND transaction_date <= ?", userID, "expense", start, end).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"budget_id": budget.ID.String(),
		"amount":    budget.Amount,
		"spent":     total,
		"remaining": budget.Amount - total,
	})
}
