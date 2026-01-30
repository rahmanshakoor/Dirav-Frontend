package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Transaction struct {
	ID              uuid.UUID  `gorm:"type:uuid;primaryKey"`
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

func (t *Transaction) BeforeCreate(tx *gorm.DB) (err error) {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return
}
