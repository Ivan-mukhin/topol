import { Link } from 'react-router-dom';
import { NavigationMenu } from './NavigationMenu';

export const TradingPlatform = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 relative">
      <NavigationMenu />

      <div className="absolute top-8 left-8">
        <Link to="/" className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-500 hover:underline">
          TOPOL
        </Link>
      </div>

      <div className="absolute top-8 right-8">
        <Link
          to="/login"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-900 dark:bg-indigo-950 text-white hover:bg-indigo-800 dark:hover:bg-indigo-900 transition-colors"
          aria-label="User Profile"
          title="Login"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
        <header className="text-center space-y-2 pt-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            TRADING PLATFORM
          </h1>
        </header>

        {/* Orders Placeholder */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Buy & Sell Orders
              </h2>
            </div>
            
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-600 dark:text-gray-400">
                Orders will be displayed here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Buy and sell orders from players will appear in this area
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

