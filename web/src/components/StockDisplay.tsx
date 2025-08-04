'use client';

import { StockData } from '@/lib/api';

interface StockDisplayProps {
  stock: StockData;
}

export default function StockDisplay({ stock }: StockDisplayProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatWebsiteUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with company info */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {stock.logo_url && (
              <img 
                src={stock.logo_url} 
                alt={`${stock.company_name} logo`}
                className="w-16 h-16 rounded-lg bg-white p-2 object-contain"
                onError={(e) => {
                  // Hide image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{stock.ticker}</h1>
              <h2 className="text-xl opacity-90">{stock.company_name}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Market Cap</p>
            <p className="text-2xl font-bold">{stock.market_cap_text}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6 space-y-6">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Exchange</h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stock.exchange || 'N/A'}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Employees</h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stock.employees ? formatNumber(stock.employees) : 'N/A'}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Industry</h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stock.industry || 'N/A'}
            </p>
          </div>
        </div>

        {/* Company Description */}
        {stock.description && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              What does {stock.company_name} do?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {stock.description}
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {stock.website && (
              <a
                href={formatWebsiteUrl(stock.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Company Website
              </a>
            )}
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Market Cap:</span> ${formatNumber(stock.market_cap)}
            </div>
          </div>
        </div>

        {/* Beginner Tips */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Remember: This is just basic company info!
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Stock prices change constantly. This data shows you what the company does and how big it is, 
                but you&apos;ll need current price data and financial analysis before making any investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}