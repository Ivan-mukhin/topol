import React, { useState, useRef, useEffect, useMemo } from 'react';
import gunsData from '../data/guns.json';

const { GUNS } = gunsData;

interface WeaponSelectorProps {
    selectedWeapon: string;
    onSelectWeapon: (weapon: string) => void;
}

export const WeaponSelector: React.FC<WeaponSelectorProps> = ({ selectedWeapon, onSelectWeapon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const rarityColors: Record<string, string> = {
        common: 'text-gray-500 dark:text-gray-400',
        uncommon: 'text-emerald-500 dark:text-emerald-400',
        rare: 'text-blue-500 dark:text-blue-400',
        epic: 'text-purple-500 dark:text-purple-400',
        legendary: 'text-orange-500 dark:text-orange-400',
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const sortedGuns = useMemo(() => {
        if (!GUNS) return [];
        const rarityWeights: Record<string, number> = {
            legendary: 5,
            epic: 4,
            rare: 3,
            uncommon: 2,
            common: 1,
        };
        return Object.keys(GUNS).sort((a, b) => {
            const gunA = GUNS[a as keyof typeof GUNS];
            const gunB = GUNS[b as keyof typeof GUNS];
            // Use fallback '0' if rarity is missing/invalid
            const weightA = rarityWeights[gunA.rarity] || 0;
            const weightB = rarityWeights[gunB.rarity] || 0;
            return weightB - weightA; // Descending
        });
    }, []);

    if (!GUNS) {
        return <div className="text-red-500">Error loading weapon data</div>;
    }

    const selectedGunData = GUNS[selectedWeapon as keyof typeof GUNS];

    return (
        <div className="flex flex-col gap-2" ref={dropdownRef}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Weapon
            </label>

            <div className="relative">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={`Select weapon. Currently selected: ${selectedWeapon}`}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm"
                >
                    <span className="flex items-center gap-3">
                        <div className="h-6 w-10 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                                src={`/guns/${selectedGunData.image}`}
                                alt={`${selectedWeapon} weapon icon`}
                                className="h-full w-full object-contain"
                                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                            />
                        </div>
                        <span className={`block truncate font-medium ${rarityColors[selectedGunData.rarity as keyof typeof rarityColors] || 'text-gray-900'}`}>
                            {selectedWeapon.charAt(0).toUpperCase() + selectedWeapon.slice(1).replace(/_/g, ' ')}
                        </span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        {/* Chevron Icon */}
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <ul
                        role="listbox"
                        aria-label="Weapon selection"
                        className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 sm:text-sm"
                    >
                        {sortedGuns.map((gunName) => {
                            const gun = GUNS[gunName as keyof typeof GUNS];
                            const rarityColor = rarityColors[gun.rarity as keyof typeof rarityColors];

                            return (
                                <li
                                    key={gunName}
                                    role="option"
                                    aria-selected={selectedWeapon === gunName}
                                    className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedWeapon === gunName ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                                    onClick={() => {
                                        onSelectWeapon(gunName);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-6 w-10 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded overflow-hidden">
                                            <img
                                                src={`/guns/${gun.image}`}
                                                alt={`${gunName} weapon icon`}
                                                className="h-full w-full object-contain"
                                                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                            />
                                        </div>
                                        <span className={`block truncate font-medium ${rarityColor}`}>
                                            {gunName.charAt(0).toUpperCase() + gunName.slice(1).replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                    {selectedWeapon === gunName && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 dark:text-indigo-400">
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};
