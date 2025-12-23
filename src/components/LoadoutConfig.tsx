import React from 'react';
import type { ShieldType } from '../data/vectors';
import gunsData from '../data/guns.json';

const { GUNS } = gunsData;

interface LoadoutConfigProps {
    selectedWeapon: string;
    level: number;
    setLevel: (level: number) => void;
    shieldType: ShieldType;
    setShieldType: (type: ShieldType) => void;
    headshotRatio: number;
    setHeadshotRatio: (ratio: number) => void;
}

export const LoadoutConfig: React.FC<LoadoutConfigProps> = ({
    selectedWeapon,
    level,
    setLevel,
    shieldType,
    setShieldType,
    headshotRatio,
    setHeadshotRatio,
}) => {
    // Check if selected weapon is legendary (cannot be upgraded)
    const gunData = GUNS[selectedWeapon as keyof typeof GUNS];
    const isLegendary = gunData?.rarity === 'legendary';

    return (
        <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weapon Level
                    {isLegendary && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 italic">
                            (Legendary weapons are locked to Level 1)
                        </span>
                    )}
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((l) => {
                        const isDisabled = isLegendary && l > 1;
                        return (
                            <button
                                key={l}
                                onClick={() => !isDisabled && setLevel(l)}
                                disabled={isDisabled}
                                aria-label={`Select weapon level ${l}${isDisabled ? ' (disabled for legendary weapons)' : ''}`}
                                aria-pressed={level === l}
                                aria-disabled={isDisabled}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    isDisabled
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                                        : level === l
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                Lvl {l}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Shield</label>
                <div className="flex gap-2">
                    {(['light', 'medium', 'heavy'] as ShieldType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setShieldType(type)}
                            aria-label={`Select ${type} shield type`}
                            aria-pressed={shieldType === type}
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
                <label 
                    htmlFor="headshot-ratio-slider"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Headshot Chance
                </label>
                <div className="flex items-center gap-4">
                    <input
                        id="headshot-ratio-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={headshotRatio}
                        onChange={(e) => setHeadshotRatio(parseFloat(e.target.value))}
                        aria-label="Headshot chance percentage"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(headshotRatio * 100)}
                        className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                    />
                    <div className="relative">
                        <input
                            id="headshot-ratio-input"
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            placeholder="0"
                            value={Math.round(headshotRatio * 100) || ''}
                            onChange={(e) => {
                                const rawValue = e.target.value;
                                if (rawValue === '') {
                                    setHeadshotRatio(0);
                                    return;
                                }
                                
                                let val = parseInt(rawValue, 10);
                                if (isNaN(val)) return;
                                
                                // Clamp immediately
                                val = Math.max(0, Math.min(100, val));
                                setHeadshotRatio(val / 100);
                            }}
                            onBlur={(e) => {
                                // Ensure value is valid on blur
                                const val = parseInt(e.target.value, 10) || 0;
                                const clamped = Math.max(0, Math.min(100, val));
                                setHeadshotRatio(clamped / 100);
                            }}
                            aria-label="Headshot chance percentage input"
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
