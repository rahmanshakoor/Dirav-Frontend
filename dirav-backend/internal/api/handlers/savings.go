package handlers

import (
	"net/http"
	"time"

	"dirav-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type savingsRequest struct {
	Name         string  `json:"name"`
	TargetAmount float64 `json:"target_amount"`
	Deadline     string  `json:"deadline"`
}

type contributeRequest struct {
	Amount float64 `json:"amount"`
}

func (h *Handler) ListSavings(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var goals []models.SavingsGoal
	if err := h.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&goals).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	c.JSON(http.StatusOK, goals)
}

func (h *Handler) CreateSavings(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req savingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	var deadline *time.Time
	if req.Deadline != "" {
		parsed, err := time.Parse("2006-01-02", req.Deadline)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid deadline"})
			return
		}
		deadline = &parsed
	}

	goal := models.SavingsGoal{
		UserID:       userID,
		Name:         req.Name,
		TargetAmount: req.TargetAmount,
		Deadline:     deadline,
	}

	if err := h.DB.Create(&goal).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusCreated, goal)
}

func (h *Handler) UpdateSavings(c *gin.Context) {
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

	var req savingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	updates := map[string]interface{}{
		"name":          req.Name,
		"target_amount": req.TargetAmount,
	}

	if req.Deadline != "" {
		deadline, err := time.Parse("2006-01-02", req.Deadline)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid deadline"})
			return
		}
		updates["deadline"] = deadline
	}

	if err := h.DB.Model(&models.SavingsGoal{}).
		Where("id = ? AND user_id = ?", id, userID).
		Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}

func (h *Handler) DeleteSavings(c *gin.Context) {
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

	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.SavingsGoal{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

func (h *Handler) ContributeSavings(c *gin.Context) {
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

	var req contributeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	var goal models.SavingsGoal
	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).First(&goal).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	goal.CurrentAmount += req.Amount
	if goal.CurrentAmount >= goal.TargetAmount {
		goal.IsCompleted = true
	}

	if err := h.DB.Save(&goal).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, goal)
}
