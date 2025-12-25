package handlers

import (
	"net/http"
	"strconv"
	"time"

	"dirav-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type transactionRequest struct {
	AccountID *uuid.UUID `json:"account_id"`
	Title     string     `json:"title"`
	Amount    float64    `json:"amount"`
	Type      string     `json:"type"`
	Category  string     `json:"category"`
	Date      string     `json:"date"`
}

func (h *Handler) ListTransactions(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	query := h.DB.Where("user_id = ?", userID)
	if t := c.Query("type"); t != "" {
		query = query.Where("type = ?", t)
	}
	if cat := c.Query("category"); cat != "" {
		query = query.Where("category = ?", cat)
	}

	limit := 50
	if l := c.Query("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil {
			limit = v
		}
	}

	var txs []models.Transaction
	if err := query.Order("transaction_date desc").Limit(limit).Find(&txs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, txs)
}

func (h *Handler) CreateTransaction(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req transactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date"})
		return
	}

	tx := models.Transaction{
		UserID:          userID,
		AccountID:       req.AccountID,
		Title:           req.Title,
		Amount:          req.Amount,
		Type:            req.Type,
		Category:        req.Category,
		TransactionDate: date,
	}

	if err := h.DB.Create(&tx).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusCreated, tx)
}

func (h *Handler) GetTransaction(c *gin.Context) {
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

	var tx models.Transaction
	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).First(&tx).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	c.JSON(http.StatusOK, tx)
}

func (h *Handler) UpdateTransaction(c *gin.Context) {
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

	var req transactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date"})
		return
	}

	updates := map[string]interface{}{
		"account_id":       req.AccountID,
		"title":            req.Title,
		"amount":           req.Amount,
		"type":             req.Type,
		"category":         req.Category,
		"transaction_date": date,
	}

	if err := h.DB.Model(&models.Transaction{}).
		Where("id = ? AND user_id = ?", id, userID).
		Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}

func (h *Handler) DeleteTransaction(c *gin.Context) {
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

	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Transaction{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
