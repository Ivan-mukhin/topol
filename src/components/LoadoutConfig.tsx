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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Headshot Ratio: {(headshotRatio * 100).toFixed(0)}%
                </label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={headshotRatio}
                    onChange={(e) => setHeadshotRatio(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
            </div>
        </div>
    );
};
