export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">RookieNumbers</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 text-sm font-medium">Stock Search</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 text-sm font-medium">How It Works</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 text-sm font-medium">Examples</a>
                <button className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600">
                  Try It Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Because we gotta pump
            <span className="text-green-600 dark:text-green-400 block">those rookie numbers up</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Finally understand stocks without the jargon. Get clear financial data, projections, and insights about publicly traded companies - designed for complete beginners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/analyze"
              className="bg-green-600 dark:bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-center"
            >
              Analyze Stocks
            </a>
            <a
              href="/analyze"
              className="border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-center"
            >
              See Example
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Stock Analysis Made Simple</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Transform complex financial data into easy-to-understand insights</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No-Jargon Financial Data</h3>
              <p className="text-gray-600 dark:text-gray-300">See company earnings, revenue, and growth trends explained in plain English that actually makes sense.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔮</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Clear Projections</h3>
              <p className="text-gray-600 dark:text-gray-300">Understand where analysts think a stock is heading, with visual charts and simple explanations.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Beginner-Friendly Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">Get the key insights that matter most, without drowning in complex financial ratios and metrics.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">RookieNumbers</h3>
              <p className="text-gray-400 dark:text-gray-500">Making stock analysis accessible to everyone</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
