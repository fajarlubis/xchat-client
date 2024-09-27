package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ShowHomePage renders the home page
func ShowHomePage(c *gin.Context) {
	c.HTML(http.StatusOK, "base.html", nil)
}
