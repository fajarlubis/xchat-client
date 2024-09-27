package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/fajarlubis/xchat-client/internal/auth"
	"github.com/gin-gonic/gin"
)

// Handle the OAuth2 callback from Keycloak
func CallbackHandler(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.String(http.StatusBadRequest, "Code not found")
		return
	}

	// Exchange code for token
	token, err := auth.OAuth2Config().Exchange(context.Background(), code)
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to exchange token: %v", err)
		return
	}

	// Extract ID token
	rawIDToken, ok := token.Extra("id_token").(string)
	if !ok {
		c.String(http.StatusInternalServerError, "No id_token field in token")
		return
	}

	// Verify ID token
	idToken, err := auth.Verifier().Verify(context.Background(), rawIDToken)
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to verify ID token: %v", err)
		return
	}

	log.Println(idToken)

	// Set session cookie
	c.SetCookie("session_token", rawIDToken, 3600, "/", auth.GetDomainName(os.Getenv("BASE_URL")), false, true)
	c.Redirect(http.StatusFound, "/") // Redirect to the main page after successful login
}

// Logout handler
func LogoutHandler(c *gin.Context) {
	// Clear the session token cookie
	c.SetCookie("session_token", "", -1, "/", auth.GetDomainName(os.Getenv("BASE_URL")), false, true)

	// Redirect to Keycloak logout URL
	logoutURL := fmt.Sprintf("%s/realms/%s/protocol/openid-connect/logout?client_id=%s&post_logout_redirect_uri=%s",
		os.Getenv("KEYCLOAK_URL"), os.Getenv("KEYCLOAK_REALM"), os.Getenv("KEYCLOAK_CLIENT_ID"), fmt.Sprintf("%s/login", os.Getenv("BASE_URL")))
	c.Redirect(http.StatusFound, logoutURL)
}

func LoginHandler(c *gin.Context) {
	// Redirect to Keycloak login page immediately after logout
	authURL := auth.OAuth2Config().AuthCodeURL("random_state")
	c.Redirect(http.StatusFound, authURL)
}
