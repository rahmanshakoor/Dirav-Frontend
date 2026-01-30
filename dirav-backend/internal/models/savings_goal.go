package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SavingsGoal struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID        uuid.UUID `gorm:"type:uuid;index;not null"`
	Name          string    `gorm:"not null"`
	TargetAmount  float64   `gorm:"not null"`
	CurrentAmount float64   `gorm:"default:0"`
	Deadline      *time.Time
	IsCompleted   bool `gorm:"default:false"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func (s *SavingsGoal) BeforeCreate(tx *gorm.DB) (err error) {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return
}
