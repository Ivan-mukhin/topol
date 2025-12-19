import React from 'react';
import type { ShieldType } from '../data/vectors';

interface LoadoutConfigProps {
    level: number;
    setLevel: (level: number) => void;
    shieldType: ShieldType;
    setShieldType: (type: ShieldType) => void;
    headshotRatio: number;
    setHeadshotRatio: (ratio: number) => void;
}

export const LoadoutConfig: React.FC<LoadoutConfigProps> = ({
    level,
    setLevel,
    shieldType,
    setShieldType,
    headshotRatio,
    setHeadshotRatio,
}) => {
    return (
        <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weapon Level</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLevel(l)}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${level === l
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            Lvl {l}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Shield</label>
                <div className="flex gap-2">
                    {(['light', 'medium', 'heavy'] as ShieldType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setShieldType(type)}
                            className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${shieldType === type
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Headshot Chance
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={headshotRatio}
                        onChange={(e) => setHeadshotRatio(parseFloat(e.target.value))}
                        className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                    />
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={Math.round(headshotRatio * 100) || ''}
                            onChange={(e) => {
                                let val = parseInt(e.target.value) || 0;
                                if (val < 0) val = 0;
                                if (val > 100) val = 100;
                                setHeadshotRatio(val / 100);
                            }}
                            className="w-16 px-2 pr-6 py-1 text-right border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white no-spinner"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs hidden">
                            %
                        </span>
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm pointer-events-none pr-1">
                            %
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
