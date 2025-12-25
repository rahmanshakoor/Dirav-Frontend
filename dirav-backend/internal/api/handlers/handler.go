package handlers

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Handler struct {
	DB        *gorm.DB
	JWTSecret string
}

func getUserID(c *gin.Context) (uuid.UUID, error) {
	raw, ok := c.Get("user_id")
	if !ok {
		return uuid.Nil, errors.New("missing user_id")
	}
	idStr, ok := raw.(string)
	if !ok {
		return uuid.Nil, errors.New("invalid user_id type")
	}
	return uuid.Parse(idStr)
}
