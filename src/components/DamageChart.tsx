import React from 'react';
import type { TTKResult } from '../utils/calculator';

interface DamageChartProps {
    result: TTKResult | null;
}

export const DamageChart: React.FC<DamageChartProps> = ({ result }) => {
    if (!result) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Select a weapon to see stats
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Performance Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-indigo-300 uppercase tracking-wide font-semibold">Time to Kill</p>
                    <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
                        {result.ttk.toFixed(3)}<span className="text-lg">s</span>
                    </p>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-emerald-300 uppercase tracking-wide font-semibold">Est. DPS</p>
                    <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                        {result.dps.toFixed(0)}
                    </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-orange-300 uppercase tracking-wide font-semibold">Shots to Kill</p>
                    <p className="text-4xl font-extrabold text-orange-600 dark:text-orange-400 mt-2">
                        {result.bulletsFired}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {result.reloads > 0 && `+${result.reloads} Reloads`}
                    </p>
                </div>
            </div>

        </div>
    );
};
