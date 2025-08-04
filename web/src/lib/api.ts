// API service layer for RookieNumbers frontend

const API_BASE_URL = 'http://localhost:8080/api';

// Types matching our Go backend responses
export interface StockData {
  ticker: string;
  company_name: string;
  description: string;
  market_cap: number;
  market_cap_text: string;
  exchange: string;
  employees: number;
  website: string;
  logo_url: string;
  industry: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    error: string;
    message?: string;
    code: number;
  };
}

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
  version: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public apiError?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Stock API functions
export const stockApi = {
  // Get stock data by ticker symbol
  async getStock(ticker: string): Promise<StockData> {
    if (!ticker || ticker.trim() === '') {
      throw new ApiError('Ticker symbol is required', 400);
    }

    const cleanTicker = ticker.trim().toUpperCase();
    
    try {
      const response = await fetch(`${API_BASE_URL}/stock/${cleanTicker}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: ApiResponse<StockData> = await response.json();

      if (!response.ok) {
        throw new ApiError(
          result.error?.message || 'Failed to fetch stock data',
          response.status,
          result.error?.error
        );
      }

      if (!result.success || !result.data) {
        throw new ApiError(
          result.error?.message || 'Invalid response format',
          500
        );
      }

      return result.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Unable to connect to server. Please check if the backend is running.',
          0
        );
      }

      throw new ApiError(
        'An unexpected error occurred while fetching stock data',
        500
      );
    }
  },

  // Health check
  async healthCheck(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new ApiError('Health check failed', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('Unable to check API health', 0);
    }
  }
};

// Utility function to format error messages for display
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Utility function to validate ticker symbols
export function validateTicker(ticker: string): { valid: boolean; message?: string } {
  if (!ticker || ticker.trim() === '') {
    return { valid: false, message: 'Please enter a stock ticker symbol' };
  }

  const cleanTicker = ticker.trim().toUpperCase();
  
  if (cleanTicker.length < 1 || cleanTicker.length > 6) {
    return { valid: false, message: 'Ticker must be 1-6 characters long' };
  }

  if (!/^[A-Z.]+$/.test(cleanTicker)) {
    return { valid: false, message: 'Ticker can only contain letters and dots' };
  }

  return { valid: true };
}