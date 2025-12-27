import { Link, useLocation } from 'react-router-dom';

export const NavigationMenu = () => {
  const location = useLocation();
  const isTTK = location.pathname === '/ttk-calculator';
  const isTrading = location.pathname === '/trading';
  const isLanding = location.pathname === '/';

  // Don't show on landing page
  if (isLanding) return null;

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-3 space-y-3 border border-gray-200 dark:border-gray-800">
        <Link
          to="/ttk-calculator"
          className={`block p-3 rounded-md transition-all duration-200 ${
            isTTK
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="TTK Calculator"
          title="TTK Calculator"
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
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </Link>

        <Link
          to="/trading"
          className={`block p-3 rounded-md transition-all duration-200 ${
            isTrading
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="Trading Platform"
          title="Trading Platform"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-6 h-6"><path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381"/><path d="m16 16 6-6"/><path d="m21.5 10.5-8-8"/><path d="m8 8 6-6"/><path d="m8.5 7.5 8 8"/></svg>

        </Link>
      </div>
    </div>
  );
};

