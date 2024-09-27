package auth

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Middleware to enforce authentication
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Retrieve the session token from the cookie
		sessionToken, err := c.Cookie("session_token")
		if err != nil || sessionToken == "" {
			// Redirect to Keycloak login if no session token is found
			redirectToLogin(c)
			return
		}

		// Verify the session token with Keycloak
		_, err = verifier.Verify(context.Background(), sessionToken)
		if err != nil {
			// If verification fails, redirect to Keycloak login
			redirectToLogin(c)
			return
		}

		// Proceed if token is valid
		c.Next()
	}
}

// RedirectToLogin redirects the user to Keycloak login page
func redirectToLogin(c *gin.Context) {
	authURL := OAuth2Config().AuthCodeURL("random_state")
	c.Redirect(http.StatusFound, authURL)
	c.Abort()
}

// NoCacheMiddleware prevents caching of responses
func NoCacheMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, private")
		c.Writer.Header().Set("Pragma", "no-cache")
		c.Writer.Header().Set("Expires", "0")
		c.Next()
	}
}
