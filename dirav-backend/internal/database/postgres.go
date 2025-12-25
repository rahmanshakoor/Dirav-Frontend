package database

import (
	"fmt"

	"dirav-backend/internal/config"
	"dirav-backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(cfg config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.DBHost,
		cfg.DBUser,
		cfg.DBPass,
		cfg.DBName,
		cfg.DBPort,
		cfg.DBSSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := enableUUID(db); err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&models.User{},
		&models.Account{},
		&models.Transaction{},
		&models.Budget{},
		&models.SavingsGoal{},
	); err != nil {
		return nil, err
	}

	return db, nil
}

func enableUUID(db *gorm.DB) error {
	return db.Exec("CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";").Error
}
