package auth

import (
	"net/url"
	"strings"
)

func GetDomainName(rawURL string) string {
	// Parse the URL
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		return ""
	}

	// Extract the hostname (domain) without the port
	hostname := parsedURL.Hostname()

	// Trim any leading "www." if needed
	hostname = strings.TrimPrefix(hostname, "www.")

	return hostname
}
