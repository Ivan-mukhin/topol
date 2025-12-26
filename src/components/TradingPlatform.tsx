import { Link } from 'react-router-dom';

export const TradingPlatform = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <Link to="/" className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-500 hover:underline">
            TOPOL
          </Link>
        </div>

        <header className="text-center space-y-2 pt-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            TRADING PLATFORM
          </h1>
        </header>

        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-12 text-center">
          <div className="space-y-4">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The trading platform is currently under development.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Post buy and sell orders for items with other players.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

