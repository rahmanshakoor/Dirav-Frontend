package handlers

import (
	"net/http"

	"dirav-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type accountRequest struct {
	AccountName string  `json:"account_name"`
	AccountType string  `json:"account_type"`
	Balance     float64 `json:"balance"`
	Currency    string  `json:"currency"`
	IsPrimary   bool    `json:"is_primary"`
}

func (h *Handler) ListAccounts(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var accounts []models.Account
	if err := h.DB.Where("user_id = ?", userID).Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	c.JSON(http.StatusOK, accounts)
}

func (h *Handler) CreateAccount(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req accountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	account := models.Account{
		UserID:      userID,
		AccountName: req.AccountName,
		AccountType: req.AccountType,
		Balance:     req.Balance,
		Currency:    req.Currency,
		IsPrimary:   req.IsPrimary,
	}

	if err := h.DB.Create(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	c.JSON(http.StatusCreated, account)
}

func (h *Handler) GetAccount(c *gin.Context) {
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

	var account models.Account
	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).First(&account).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, account)
}

func (h *Handler) UpdateAccount(c *gin.Context) {
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

	var req accountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	updates := map[string]interface{}{
		"account_name": req.AccountName,
		"account_type": req.AccountType,
		"balance":      req.Balance,
		"currency":     req.Currency,
		"is_primary":   req.IsPrimary,
	}

	if err := h.DB.Model(&models.Account{}).
		Where("id = ? AND user_id = ?", id, userID).
		Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}

func (h *Handler) DeleteAccount(c *gin.Context) {
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

	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Account{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
