package auth

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/coreos/go-oidc"
	"github.com/fajarlubis/xchat-client/internal/config"
	"golang.org/x/oauth2"
)

var oauth2Config *oauth2.Config
var verifier *oidc.IDTokenVerifier

func init() {
	config.LoadConfig()
	// Configure OIDC provider with Keycloak
	provider, err := oidc.NewProvider(context.Background(), fmt.Sprintf("%s/realms/%s", os.Getenv("KEYCLOAK_URL"), os.Getenv("KEYCLOAK_REALM")))
	if err != nil {
		log.Fatalf("Failed to get provider: %v", err)
	}

	// Configure OAuth2 with Keycloak settings
	oauth2Config = &oauth2.Config{
		ClientID:     os.Getenv("KEYCLOAK_CLIENT_ID"),
		ClientSecret: os.Getenv("KEYCLOAK_CLIENT_SECRET"),
		Endpoint:     provider.Endpoint(),
		RedirectURL:  os.Getenv("KEYCLOAK_REDIRECT_URL"),
		Scopes:       []string{oidc.ScopeOpenID, "profile", "email"},
	}

	// Set up ID token verifier
	verifier = provider.Verifier(&oidc.Config{ClientID: os.Getenv("KEYCLOAK_CLIENT_ID")})
}

// OAuth2Config returns the OAuth2 configuration
func OAuth2Config() *oauth2.Config {
	return oauth2Config
}

// Verifier returns the ID token verifier
func Verifier() *oidc.IDTokenVerifier {
	return verifier
}
