package main

import (
	"log"

	"dirav-backend/internal/api/handlers"
	"dirav-backend/internal/api/routes"
	"dirav-backend/internal/config"
	"dirav-backend/internal/database"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal(err)
	}

	r := gin.Default()
	h := &handlers.Handler{DB: db, JWTSecret: cfg.JWTSecret}

	routes.Register(r, h)

	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
