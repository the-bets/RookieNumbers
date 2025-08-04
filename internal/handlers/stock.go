package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/betsy/RookieNumbers/pkg/stock"
)

// StockHandler handles stock-related HTTP requests
type StockHandler struct {
	PolygonClient *stock.PolygonClient
}

// NewStockHandler creates a new stock handler
func NewStockHandler(polygonClient *stock.PolygonClient) *StockHandler {
	return &StockHandler{
		PolygonClient: polygonClient,
	}
}

// APIError represents an error response
type APIError struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
	Code    int    `json:"code"`
}

// StockResponse represents the formatted response for frontend
type StockResponse struct {
	Success bool                   `json:"success"`
	Data    *stock.SimplifiedStock `json:"data,omitempty"`
	Error   *APIError              `json:"error,omitempty"`
}

// SearchResponse represents search results for stock lookup
type SearchResponse struct {
	Success bool                     `json:"success"`
	Data    []stock.SimplifiedStock  `json:"data,omitempty"`
	Error   *APIError                `json:"error,omitempty"`
}

// GetStock handles GET /api/stock/{ticker} requests
func (h *StockHandler) GetStock(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow GET requests
	if r.Method != "GET" {
		h.sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract ticker from URL path
	path := strings.TrimPrefix(r.URL.Path, "/api/stock/")
	ticker := strings.ToUpper(strings.TrimSpace(path))

	// Validate ticker
	if err := h.validateTicker(ticker); err != nil {
		h.sendError(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Log the request
	log.Printf("Fetching stock data for ticker: %s", ticker)

	// Fetch stock data with timeout
	ctx := r.Context()
	
	// Create a channel to handle the response
	type result struct {
		stock *stock.SimplifiedStock
		err   error
	}
	
	resultChan := make(chan result, 1)
	
	// Fetch data in a goroutine
	go func() {
		overview, err := h.PolygonClient.GetTickerOverview(ticker)
		if err != nil {
			resultChan <- result{nil, err}
			return
		}
		
		simplifiedStock := stock.SimplifyForBeginners(overview)
		resultChan <- result{simplifiedStock, nil}
	}()

	// Wait for result or timeout
	select {
	case res := <-resultChan:
		if res.err != nil {
			log.Printf("Error fetching stock data for %s: %v", ticker, res.err)
			h.sendError(w, "Failed to fetch stock data. Please check the ticker symbol.", http.StatusNotFound)
			return
		}
		
		// Send successful response
		h.sendSuccess(w, res.stock)
		
	case <-ctx.Done():
		log.Printf("Request timeout for ticker: %s", ticker)
		h.sendError(w, "Request timeout", http.StatusRequestTimeout)
		return
	}
}

// GetStockSearch handles GET /api/search?q={query} requests (future feature)
func (h *StockHandler) GetStockSearch(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// For now, return a placeholder response
	h.sendError(w, "Search functionality coming soon", http.StatusNotImplemented)
}

// validateTicker validates the stock ticker format
func (h *StockHandler) validateTicker(ticker string) error {
	if ticker == "" {
		return fmt.Errorf("stock ticker is required")
	}
	
	if len(ticker) < 1 || len(ticker) > 6 {
		return fmt.Errorf("ticker must be between 1-6 characters")
	}
	
	// Check for valid characters (letters and some special cases)
	for _, char := range ticker {
		if !((char >= 'A' && char <= 'Z') || char == '.') {
			return fmt.Errorf("ticker contains invalid characters")
		}
	}
	
	return nil
}

// sendError sends an error response to the client
func (h *StockHandler) sendError(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(statusCode)
	
	response := StockResponse{
		Success: false,
		Error: &APIError{
			Error:   http.StatusText(statusCode),
			Message: message,
			Code:    statusCode,
		},
	}
	
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding error response: %v", err)
	}
}

// sendSuccess sends a successful response to the client
func (h *StockHandler) sendSuccess(w http.ResponseWriter, data *stock.SimplifiedStock) {
	w.WriteHeader(http.StatusOK)
	
	response := StockResponse{
		Success: true,
		Data:    data,
	}
	
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding success response: %v", err)
		h.sendError(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
	
	log.Printf("Successfully returned data for %s", data.Ticker)
}

// HealthCheck handles GET /api/health requests
func (h *StockHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Content-Type", "application/json")
	
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	health := map[string]interface{}{
		"status":    "ok",
		"message":   "RookieNumbers API is running",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"version":   "1.0.0",
	}
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(health)
}