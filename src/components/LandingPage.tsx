import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
            TOPOL
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Arc Raiders Tools & Trading Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            to="/ttk-calculator"
            className="group bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="space-y-4">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                TTK Calculator
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Calculate Time-to-Kill statistics for all weapons
              </p>
              <div className="text-sm text-indigo-600 dark:text-indigo-400 group-hover:underline">
                Go to Calculator →
              </div>
            </div>
          </Link>

          <Link
            to="/trading"
            className="group bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="space-y-4">
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                Trading Platform
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Buy and sell items with other players
              </p>
              <div className="text-sm text-emerald-600 dark:text-emerald-400 group-hover:underline">
                Go to Trading →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

