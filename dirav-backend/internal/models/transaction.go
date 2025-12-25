package models

import (
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID              uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID          uuid.UUID  `gorm:"type:uuid;index;not null"`
	AccountID       *uuid.UUID `gorm:"type:uuid"`
	Title           string     `gorm:"not null"`
	Amount          float64    `gorm:"not null"`
	Type            string     `gorm:"not null"`
	Category        string
	TransactionDate time.Time `gorm:"not null"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
}
