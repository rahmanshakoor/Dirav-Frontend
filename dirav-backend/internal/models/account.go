package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Account struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID      uuid.UUID `gorm:"type:uuid;index;not null"`
	AccountName string    `gorm:"not null"`
	AccountType string    `gorm:"not null"`
	Balance     float64   `gorm:"not null"`
	Currency    string    `gorm:"default:USD"`
	IsPrimary   bool      `gorm:"default:false"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (a *Account) BeforeCreate(tx *gorm.DB) (err error) {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return
}
