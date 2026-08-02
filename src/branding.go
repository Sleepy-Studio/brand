package branding

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sync"
	"time"
)

// Asset represents a branding asset
type Asset struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Added       string     `json:"added"`
	Variants    []Variant  `json:"variants"`
}

// Variant represents an asset format variant
type Variant struct {
	Format  string `json:"format"`
	File    string `json:"file"`
	SizeKB  int    `json:"size_kb"`
	URL     string `json:"url"`
	MIME    string `json:"mime"`
}

// Manifest contains all assets
type Manifest struct {
	Assets []Asset `json:"assets"`
}

// Client is the Branding API client
type Client struct {
	BaseURL    string
	HTTPClient *http.Client
	
	manifestMu    sync.RWMutex
	manifest      *Manifest
	manifestTime  time.Time
	cacheTTL      time.Duration
}

// NewClient creates a new Branding client
func NewClient(baseURL string) *Client {
	if baseURL == "" {
		baseURL = "https://branding.sleepystudio.xyz"
	}

	return &Client{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		cacheTTL: 1 * time.Hour,
	}
}

// GetAsset fetches a single asset by ID
func (c *Client) GetAsset(assetID string, format ...string) (*Variant, error) {
	url := fmt.Sprintf("%s/api/v1/assets/%s", c.BaseURL, assetID)
	
	resp, err := c.HTTPClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch asset: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, fmt.Errorf("asset not found: %s", assetID)
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("unexpected status %d: %s", resp.StatusCode, string(body))
	}

	var asset Asset
	if err := json.NewDecoder(resp.Body).Decode(&asset); err != nil {
		return nil, fmt.Errorf("failed to decode asset: %w", err)
	}

	// Filter by format if specified
	if len(format) > 0 {
		for _, v := range asset.Variants {
			if v.Format == format[0] {
				return &v, nil
			}
		}
		return nil, fmt.Errorf("format not found: %s", format[0])
	}

	if len(asset.Variants) > 0 {
		return &asset.Variants[0], nil
	}

	return nil, fmt.Errorf("no variants found for asset: %s", assetID)
}

// GetAssets fetches all assets
func (c *Client) GetAssets() ([]Asset, error) {
	manifest, err := c.GetManifest()
	if err != nil {
		return nil, err
	}
	return manifest.Assets, nil
}

// Search searches for assets
func (c *Client) Search(query string, opts ...SearchOption) ([]Asset, error) {
	u, err := url.Parse(fmt.Sprintf("%s/api/v1/search", c.BaseURL))
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	params := url.Values{}
	params.Set("q", query)
	params.Set("limit", "20")

	// Apply options
	for _, opt := range opts {
		opt(params)
	}

	u.RawQuery = params.Encode()

	resp, err := c.HTTPClient.Get(u.String())
	if err != nil {
		return nil, fmt.Errorf("failed to search: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %d", resp.StatusCode)
	}

	var results []Asset
	if err := json.NewDecoder(resp.Body).Decode(&results); err != nil {
		return nil, fmt.Errorf("failed to decode results: %w", err)
	}

	return results, nil
}

// GetManifest fetches the manifest with caching
func (c *Client) GetManifest() (*Manifest, error) {
	c.manifestMu.RLock()
	
	// Check cache
	if c.manifest != nil && time.Since(c.manifestTime) < c.cacheTTL {
		defer c.manifestMu.RUnlock()
		return c.manifest, nil
	}
	c.manifestMu.RUnlock()

	// Fetch fresh manifest
	url := fmt.Sprintf("%s/assets.json", c.BaseURL)
	resp, err := c.HTTPClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch manifest: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %d", resp.StatusCode)
	}

	var manifest Manifest
	if err := json.NewDecoder(resp.Body).Decode(&manifest); err != nil {
		return nil, fmt.Errorf("failed to decode manifest: %w", err)
	}

	// Update cache
	c.manifestMu.Lock()
	c.manifest = &manifest
	c.manifestTime = time.Now()
	c.manifestMu.Unlock()

	return &manifest, nil
}

// ClearCache clears the cached manifest
func (c *Client) ClearCache() {
	c.manifestMu.Lock()
	c.manifest = nil
	c.manifestMu.Unlock()
}

// SearchOption is a functional option for search
type SearchOption func(url.Values)

// WithFormat filters search results by format
func WithFormat(format string) SearchOption {
	return func(v url.Values) {
		v.Set("format", format)
	}
}

// WithLimit sets the maximum number of results
func WithLimit(limit int) SearchOption {
	return func(v url.Values) {
		v.Set("limit", fmt.Sprintf("%d", limit))
	}
}

// Example usage
func Example() {
	client := NewClient("")

	// Get asset
	variant, err := client.GetAsset("logo-black", "svg")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	fmt.Printf("Asset URL: %s\n", variant.URL)

	// Search
	results, err := client.Search("logo", WithFormat("svg"))
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	fmt.Printf("Found %d results\n", len(results))

	// Get all
	assets, err := client.GetAssets()
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	fmt.Printf("Total assets: %d\n", len(assets))
}
