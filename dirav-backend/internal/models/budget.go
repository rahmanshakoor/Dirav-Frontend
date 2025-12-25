package models

import (
	"time"

	"github.com/google/uuid"
)

type Budget struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;index;not null"`
	Name      string    `gorm:"not null"`
	Amount    float64   `gorm:"not null"`
	Period    string    `gorm:"not null"`
	Category  string
	StartDate time.Time `gorm:"not null"`
	EndDate   *time.Time
	IsActive  bool `gorm:"default:true"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
