import { Link } from 'react-router-dom';

export const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="text-3xl font-black tracking-tight text-indigo-600 dark:text-indigo-500 hover:underline">
            TOPOL
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
          <div className="space-y-4 text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Login
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Login functionality coming soon
            </p>
            <Link
              to="/trading"
              className="inline-block mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              ← Back to Trading
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

