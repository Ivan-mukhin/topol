import React, { useState, useMemo } from 'react';
import gunsData from '../data/guns.json';
import { calculateTTK } from '../utils/calculator';
import type { ShieldType } from '../data/vectors';

interface WeaponLeaderboardProps {
    level: number;
    shieldType: ShieldType;
    headshotRatio: number;
}

type SortKey = 'name' | 'ttk' | 'dps' | 'bulletsFired';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

const { GUNS } = gunsData;

export const WeaponLeaderboard: React.FC<WeaponLeaderboardProps> = ({
    level,
    shieldType,
    headshotRatio,
}) => {
    if (!GUNS) {
        return <div className="p-4 text-red-500">Error: Weapon data not loaded</div>;
    }

    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'ttk', direction: 'asc' });

    const rarityColors = {
        common: 'text-gray-500 dark:text-gray-400',
        uncommon: 'text-emerald-500 dark:text-emerald-400',
        rare: 'text-blue-500 dark:text-blue-400',
        epic: 'text-purple-500 dark:text-purple-400',
        legendary: 'text-orange-500 dark:text-orange-400',
    };

    const leaderboardData = useMemo(() => {
        const data = Object.keys(GUNS).map((gunName) => {
            const result = calculateTTK(gunName, shieldType, level, headshotRatio);
            const gunData = GUNS[gunName as keyof typeof GUNS];
            return {
                name: gunName,
                image: gunData.image,
                rarity: gunData.rarity as keyof typeof rarityColors,
                // If calculation fails (shouldn't happen for valid guns), provide fallbacks that push to bottom
                ttk: result?.ttk ?? 999,
                dps: result?.dps ?? 0,
                bulletsFired: result?.bulletsFired ?? 999,
                reloads: result?.reloads ?? 0,
            };
        });

        return data.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [level, shieldType, headshotRatio, sortConfig]);

    const handleSort = (key: SortKey) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortConfig.key !== columnKey) return null;
        return <span className="text-indigo-600 dark:text-indigo-400 ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Weapon Leaderboard</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                                #
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">Weapon <SortIcon columnKey="name" /></div>
                            </th>
                            <th
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                onClick={() => handleSort('ttk')}
                            >
                                <div className="flex items-center justify-end">TTK <SortIcon columnKey="ttk" /></div>
                            </th>
                            <th
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                onClick={() => handleSort('dps')}
                            >
                                <div className="flex items-center justify-end">DPS <SortIcon columnKey="dps" /></div>
                            </th>
                            <th
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                onClick={() => handleSort('bulletsFired')}
                            >
                                <div className="flex items-center justify-end">Shots to Kill <SortIcon columnKey="bulletsFired" /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {leaderboardData.map((row, index) => (
                            <tr key={row.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                                    <div className="flex items-center gap-3">
                                        {/* Use error handling for images to not break layout if missing */}
                                        <div className="w-16 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                                            <img
                                                src={`/guns/${row.image}`}
                                                alt={row.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <span className={rarityColors[row.rarity] || 'text-gray-900 dark:text-white'}>
                                            {row.name.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-indigo-600 dark:text-indigo-400">
                                    {row.ttk.toFixed(3)}s
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-600 dark:text-emerald-400">
                                    {row.dps.toFixed(0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600 dark:text-orange-400">
                                    {row.bulletsFired}
                                    {row.reloads > 0 && <span className="ml-1 text-xs text-gray-400">(+{row.reloads} {row.reloads === 1 ? 'reload' : 'reloads'})</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
