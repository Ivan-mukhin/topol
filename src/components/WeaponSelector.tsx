import React from 'react';
import gunsData from '../data/guns.json';


const { GUNS } = gunsData;

interface WeaponSelectorProps {
    selectedWeapon: string;
    onSelectWeapon: (weapon: string) => void;
}

export const WeaponSelector: React.FC<WeaponSelectorProps> = ({ selectedWeapon, onSelectWeapon }) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="weapon-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Weapon
            </label>
            <select
                id="weapon-select"
                value={selectedWeapon}
                onChange={(e) => onSelectWeapon(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm p-2 border"
            >
                {Object.keys(GUNS).map((gunName) => (
                    <option key={gunName} value={gunName}>
                        {gunName.charAt(0).toUpperCase() + gunName.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};
