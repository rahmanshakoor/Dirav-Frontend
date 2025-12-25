package config

import (
	"os"
)

type Config struct {
	Port      string
	DBHost    string
	DBPort    string
	DBUser    string
	DBPass    string
	DBName    string
	DBSSLMode string
	JWTSecret string
}

func Load() Config {
	return Config{
		Port:      getEnv("PORT", "8080"),
		DBHost:    getEnv("DB_HOST", "localhost"),
		DBPort:    getEnv("DB_PORT", "5432"),
		DBUser:    getEnv("DB_USER", "dirav"),
		DBPass:    getEnv("DB_PASSWORD", "password"),
		DBName:    getEnv("DB_NAME", "dirav_db"),
		DBSSLMode: getEnv("DB_SSL_MODE", "disable"),
		JWTSecret: getEnv("JWT_SECRET", "change_me"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
