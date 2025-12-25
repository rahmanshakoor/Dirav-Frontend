package models

import (
	"time"

	"github.com/google/uuid"
)

type Account struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID      uuid.UUID `gorm:"type:uuid;index;not null"`
	AccountName string    `gorm:"not null"`
	AccountType string    `gorm:"not null"`
	Balance     float64   `gorm:"not null"`
	Currency    string    `gorm:"default:USD"`
	IsPrimary   bool      `gorm:"default:false"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
