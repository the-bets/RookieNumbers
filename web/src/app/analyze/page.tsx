'use client';

import { useState } from 'react';
import { stockApi, StockData, getErrorMessage } from '@/lib/api';
import StockSearch from '@/components/StockSearch';
import StockDisplay from '@/components/StockDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function AnalyzePage() {
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string>('');
  const [lastSearchedTicker, setLastSearchedTicker] = useState<string>('');

  const handleSearch = async (ticker: string) => {
    setLoading(true);
    setError('');
    setStockData(null);
    setLastSearchedTicker(ticker);

    try {
      const data = await stockApi.getStock(ticker);
      setStockData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastSearchedTicker) {
      handleSearch(lastSearchedTicker);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Analysis</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Get easy-to-understand information about any publicly traded stock
              </p>
            </div>
            <a
              href="/"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Search Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Enter a Stock Ticker Symbol
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Try popular stocks like AAPL, GOOGL, MSFT, or search for any company you&apos;re curious about
            </p>
            <StockSearch onSearch={handleSearch} loading={loading} />
          </div>

          {/* Results Section */}
          <div className="mt-12">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fetching stock data for {lastSearchedTicker}...
                  </p>
                </div>
              </div>
            )}

            {error && !loading && (
              <ErrorDisplay error={error} onRetry={handleRetry} />
            )}

            {stockData && !loading && !error && (
              <div className="animate-fade-in">
                <StockDisplay stock={stockData} />
              </div>
            )}

            {!stockData && !loading && !error && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Enter a ticker symbol above to get started
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  We&apos;ll show you everything about the company in simple terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">RookieNumbers</h3>
            <p className="text-gray-400 dark:text-gray-500">
              Making stock analysis accessible to everyone
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}