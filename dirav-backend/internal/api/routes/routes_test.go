package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"dirav-backend/internal/api/handlers"
	"github.com/gin-gonic/gin"
)

func TestHealth(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	h := &handlers.Handler{JWTSecret: "test"}
	Register(r, h)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
}
