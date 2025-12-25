package handlers

import (
	"net/http"
	"time"

	"dirav-backend/internal/models"
	"github.com/gin-gonic/gin"
)

func (h *Handler) Summary(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var balance float64
	if err := h.DB.Model(&models.Account{}).
		Where("user_id = ?", userID).
		Select("COALESCE(SUM(balance), 0)").
		Scan(&balance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	var savings float64
	if err := h.DB.Model(&models.SavingsGoal{}).
		Where("user_id = ?", userID).
		Select("COALESCE(SUM(current_amount), 0)").
		Scan(&savings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	var allowance float64
	if err := h.DB.Model(&models.Budget{}).
		Where("user_id = ? AND period = ? AND is_active = true", userID, "monthly").
		Select("COALESCE(MAX(amount), 0)").
		Scan(&allowance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	start := time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 1, 0)

	var spent float64
	if err := h.DB.Model(&models.Transaction{}).
		Where("user_id = ? AND type = ? AND transaction_date >= ? AND transaction_date < ?", userID, "expense", start, end).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&spent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	remaining := allowance - spent
	if remaining < 0 {
		remaining = 0
	}

	c.JSON(http.StatusOK, gin.H{
		"balance":              balance,
		"savings":              savings,
		"monthly_allowance":    allowance,
		"spent_this_month":     spent,
		"remaining_this_month": remaining,
		"delta_percent":        0,
	})
}
