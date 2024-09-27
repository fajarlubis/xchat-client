package main

import (
	"os"

	"github.com/fajarlubis/xchat-client/internal/auth"
	"github.com/fajarlubis/xchat-client/internal/config"
	"github.com/fajarlubis/xchat-client/internal/handlers"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()

	// Set up the Gin router
	r := gin.Default()
	r.SetTrustedProxies(nil)
	r.LoadHTMLGlob("internal/templates/*")
	r.Static("/static", "./static")

	// Apply authentication and no-cache middleware globally
	r.Use(auth.NoCacheMiddleware()) // Middleware to prevent caching of responses

	// Define routes
	r.GET("/", auth.AuthMiddleware(), handlers.ShowHomePage) // Route for the home page
	r.GET("/login", handlers.LoginHandler)                   // Logout route
	r.GET("/logout", handlers.LogoutHandler)                 // Logout route
	r.GET("/callback", handlers.CallbackHandler)             // OAuth2 callback route

	// Run the server
	r.Run(os.Getenv("PORT"))
}
