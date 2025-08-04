package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/betsy/RookieNumbers/pkg/stock"
	"github.com/betsy/RookieNumbers/internal/handlers"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	polygonAPIKey := os.Getenv("POLYGON_API_KEY")
	if polygonAPIKey == "" {
		log.Println("Warning: POLYGON_API_KEY not set in environment")
	} else {
		fmt.Printf("Polygon API key loaded successfully (length: %d)\n", len(polygonAPIKey))
	}

	// Initialize Polygon client and handlers
	polygonClient := stock.NewPolygonClient(polygonAPIKey)
	stockHandler := handlers.NewStockHandler(polygonClient)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		fmt.Fprintf(w, "Welcome to RookieNumbers - helping beginners invest!")
	})

	// API routes with CORS middleware
	http.HandleFunc("/api/health", handlers.EnableCORS(stockHandler.HealthCheck))
	http.HandleFunc("/api/stock/", handlers.EnableCORS(stockHandler.GetStock))
	http.HandleFunc("/api/search", handlers.EnableCORS(stockHandler.GetStockSearch))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Starting RookieNumbers server on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}