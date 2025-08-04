package stock

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// PolygonClient handles interactions with Polygon.io API
type PolygonClient struct {
	APIKey  string
	BaseURL string
	Client  *http.Client
}

// NewPolygonClient creates a new Polygon.io API client
func NewPolygonClient(apiKey string) *PolygonClient {
	return &PolygonClient{
		APIKey:  apiKey,
		BaseURL: "https://api.polygon.io",
		Client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// TickerOverview represents the ticker overview response from Polygon.io
type TickerOverview struct {
	Ticker               string  `json:"ticker"`
	Name                 string  `json:"name"`
	Market               string  `json:"market"`
	Locale               string  `json:"locale"`
	PrimaryExchange      string  `json:"primary_exchange"`
	Type                 string  `json:"type"`
	Active               bool    `json:"active"`
	CurrencyName         string  `json:"currency_name"`
	CIK                  string  `json:"cik"`
	CompositeFIGI        string  `json:"composite_figi"`
	ShareClassFIGI       string  `json:"share_class_figi"`
	MarketCap            float64 `json:"market_cap"`
	PhoneNumber          string  `json:"phone_number"`
	Address              Address `json:"address"`
	Description          string  `json:"description"`
	SICCode              string  `json:"sic_code"`
	SICDescription       string  `json:"sic_description"`
	TickerRoot           string  `json:"ticker_root"`
	HomepageURL          string  `json:"homepage_url"`
	TotalEmployees       int     `json:"total_employees"`
	ListDate             string  `json:"list_date"`
	Branding             Branding `json:"branding"`
	ShareClassSharesOutstanding float64 `json:"share_class_shares_outstanding"`
	WeightedSharesOutstanding   float64 `json:"weighted_shares_outstanding"`
}

// Address represents company address information
type Address struct {
	Address1   string `json:"address1"`
	City       string `json:"city"`
	State      string `json:"state"`
	PostalCode string `json:"postal_code"`
}

// Branding represents company branding information
type Branding struct {
	LogoURL    string `json:"logo_url"`
	IconURL    string `json:"icon_url"`
}

// PolygonResponse represents the API response wrapper
type PolygonResponse struct {
	Status     string          `json:"status"`
	RequestID  string          `json:"request_id"`
	Results    TickerOverview  `json:"results"`
	Count      int             `json:"count"`
	NextURL    string          `json:"next_url"`
}

// GetTickerOverview fetches ticker overview data from Polygon.io
func (c *PolygonClient) GetTickerOverview(ticker string) (*TickerOverview, error) {
	url := fmt.Sprintf("%s/v3/reference/tickers/%s?apikey=%s", c.BaseURL, ticker, c.APIKey)
	
	resp, err := c.Client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status %d", resp.StatusCode)
	}

	var polygonResp PolygonResponse
	if err := json.NewDecoder(resp.Body).Decode(&polygonResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	if polygonResp.Status != "OK" {
		return nil, fmt.Errorf("API returned non-OK status: %s", polygonResp.Status)
	}

	return &polygonResp.Results, nil
}

// SimplifiedStock represents a simplified view of stock data for beginners
type SimplifiedStock struct {
	Ticker          string  `json:"ticker"`
	CompanyName     string  `json:"company_name"`
	Description     string  `json:"description"`
	MarketCap       float64 `json:"market_cap"`
	MarketCapText   string  `json:"market_cap_text"`
	Exchange        string  `json:"exchange"`
	Employees       int     `json:"employees"`
	Website         string  `json:"website"`
	LogoURL         string  `json:"logo_url"`
	Industry        string  `json:"industry"`
}

// formatMarketCap converts market cap to human-readable format
func formatMarketCap(marketCap float64) string {
	if marketCap >= 1e12 {
		return fmt.Sprintf("$%.1fT", marketCap/1e12)
	} else if marketCap >= 1e9 {
		return fmt.Sprintf("$%.1fB", marketCap/1e9)
	} else if marketCap >= 1e6 {
		return fmt.Sprintf("$%.1fM", marketCap/1e6)
	} else if marketCap >= 1e3 {
		return fmt.Sprintf("$%.1fK", marketCap/1e3)
	}
	return fmt.Sprintf("$%.0f", marketCap)
}

// simplifyDescription truncates description to be more digestible
func simplifyDescription(description string) string {
	if len(description) > 300 {
		// Find the last sentence within 300 characters
		for i := 299; i > 200; i-- {
			if description[i] == '.' {
				return description[:i+1]
			}
		}
		return description[:300] + "..."
	}
	return description
}

// SimplifyForBeginners converts complex ticker data into beginner-friendly format
func SimplifyForBeginners(overview *TickerOverview) *SimplifiedStock {
	marketCap := overview.MarketCap
	
	return &SimplifiedStock{
		Ticker:          overview.Ticker,
		CompanyName:     overview.Name,
		Description:     simplifyDescription(overview.Description),
		MarketCap:       marketCap,
		MarketCapText:   formatMarketCap(marketCap),
		Exchange:        overview.PrimaryExchange,
		Employees:       overview.TotalEmployees,
		Website:         overview.HomepageURL,
		LogoURL:         overview.Branding.LogoURL,
		Industry:        overview.SICDescription,
	}
}