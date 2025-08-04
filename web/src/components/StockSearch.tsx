'use client';

import { useState } from 'react';
import { validateTicker } from '@/lib/api';

interface StockSearchProps {
  onSearch: (ticker: string) => void;
  loading: boolean;
}

export default function StockSearch({ onSearch, loading }: StockSearchProps) {
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateTicker(ticker);
    if (!validation.valid) {
      setError(validation.message || 'Invalid ticker');
      return;
    }

    setError('');
    onSearch(ticker.trim().toUpperCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setTicker(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Stock Ticker Symbol
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="ticker"
              value={ticker}
              onChange={handleInputChange}
              placeholder="e.g., AAPL, GOOGL, MSFT"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white text-lg"
              disabled={loading}
              maxLength={6}
            />
            <button
              type="submit"
              disabled={loading || !ticker.trim()}
              className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </form>

      {/* Popular Stocks Quick Links */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Popular stocks to try:</p>
        <div className="flex flex-wrap gap-2">
          {popularStocks.map((symbol) => (
            <button
              key={symbol}
              onClick={() => {
                setTicker(symbol);
                setError('');
                onSearch(symbol);
              }}
              disabled={loading}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}