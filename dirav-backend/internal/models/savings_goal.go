package models

import (
	"time"

	"github.com/google/uuid"
)

type SavingsGoal struct {
	ID            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID        uuid.UUID `gorm:"type:uuid;index;not null"`
	Name          string    `gorm:"not null"`
	TargetAmount  float64   `gorm:"not null"`
	CurrentAmount float64   `gorm:"default:0"`
	Deadline      *time.Time
	IsCompleted   bool `gorm:"default:false"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
