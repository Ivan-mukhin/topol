import React, { useState, useMemo, useEffect, useRef } from 'react';
import gunsData from '../data/guns.json';
import { calculateTTK } from '../utils/calculator';
import type { ShieldType } from '../data/vectors';
import { logger } from '../utils/logger';
import { FALLBACK_TTK, FALLBACK_BULLETS, FALLBACK_DPS, DEBOUNCE_DELAY_MS } from '../data/constants';
import { useDebounce } from '../hooks/useDebounce';

interface WeaponLeaderboardProps {
    level: number;
    shieldType: ShieldType;
    headshotRatio: number;
    selectedWeapon?: string;
}

type SortKey = 'name' | 'ttk' | 'dps' | 'bulletsFired';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

const { GUNS } = gunsData;

// SortIcon component moved outside to avoid creating during render
const SortIcon = ({ columnKey, sortConfig }: { columnKey: SortKey; sortConfig: SortConfig }) => {
    if (sortConfig.key !== columnKey) return null;
    return <span className="text-indigo-600 dark:text-indigo-400 ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
};

// WeaponRow component with pulsing animation and visibility detection
interface WeaponRowProps {
    row: {
        name: string;
        image: string;
        rarity: string;
        ttk: number;
        dps: number;
        bulletsFired: number;
        reloads: number;
        hasError: boolean;
    };
    index: number;
    rarityColors: Record<string, string>;
    isSelected: boolean;
}

const WeaponRow: React.FC<WeaponRowProps> = ({ row, index, rarityColors, isSelected }) => {
    const rowRef = useRef<HTMLTableRowElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);
    const animationTimeoutRef = useRef<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const hasStartedAnimationRef = useRef(false);

    // Animation duration matches CSS animation (5 seconds)
    const ANIMATION_DURATION_MS = 5000;

    useEffect(() => {
        if (!isSelected) {
            // Reset states when deselected
            setIsVisible(false);
            setAnimationComplete(false);
            hasStartedAnimationRef.current = false;
            if (animationTimeoutRef.current !== null) {
                clearTimeout(animationTimeoutRef.current);
                animationTimeoutRef.current = null;
            }
            return;
        }

        // Reset animation state when selection changes
        setIsVisible(false);
        setAnimationComplete(false);
        hasStartedAnimationRef.current = false;
        if (animationTimeoutRef.current !== null) {
            clearTimeout(animationTimeoutRef.current);
            animationTimeoutRef.current = null;
        }

        // Check if element is already visible
        const checkInitialVisibility = () => {
            if (rowRef.current) {
                const rect = rowRef.current.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            }
            return false;
        };

        // Function to start the animation
        const startAnimation = () => {
            if (hasStartedAnimationRef.current) return; // Prevent multiple starts
            hasStartedAnimationRef.current = true;
            setIsVisible(true);
            // Start animation timer: run for exactly 5 seconds
            animationTimeoutRef.current = window.setTimeout(() => {
                setAnimationComplete(true);
            }, ANIMATION_DURATION_MS);
        };

        // Set up Intersection Observer to detect when row becomes visible
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasStartedAnimationRef.current) {
                        startAnimation();
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of row is visible
                rootMargin: '0px',
            }
        );

        // Use setTimeout to ensure React commits the reset state before starting animation
        // requestAnimationFrame alone isn't enough as React may batch updates
        const timeoutId = window.setTimeout(() => {
            if (checkInitialVisibility()) {
                startAnimation();
            } else if (rowRef.current && observerRef.current) {
                observerRef.current.observe(rowRef.current);
            }
        }, 50);

        return () => {
            clearTimeout(timeoutId);
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
            if (animationTimeoutRef.current !== null) {
                clearTimeout(animationTimeoutRef.current);
                animationTimeoutRef.current = null;
            }
        };
    }, [isSelected]); // Only depend on isSelected

    const isPulsing = isSelected && isVisible && !animationComplete;
    const isHighlighted = isSelected && animationComplete;

    return (
        <tr
            ref={rowRef}
            className={`${isSelected ? '' : 'transition-all duration-300'} ${
                isPulsing
                    ? 'animate-selected-row border-l-4 border-solid'
                    : isHighlighted
                    ? 'animate-selected-row border-l-4 border-solid'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
        >
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                        <img
                            src={`/guns/${row.image}`}
                            alt={`${row.name} weapon icon`}
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
                {row.hasError || !isFinite(row.ttk) ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-200">
                        Error
                    </span>
                ) : (
                    `${row.ttk.toFixed(3)}s`
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-600 dark:text-emerald-400">
                {row.hasError || !isFinite(row.dps) ? '—' : row.dps.toFixed(0)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600 dark:text-orange-400">
                {row.hasError || !isFinite(row.bulletsFired) ? '—' : row.bulletsFired}
                {!row.hasError && row.reloads > 0 && <span className="ml-1 text-xs text-gray-400">(+{row.reloads} {row.reloads === 1 ? 'reload' : 'reloads'})</span>}
            </td>
        </tr>
    );
};

export const WeaponLeaderboard: React.FC<WeaponLeaderboardProps> = ({
    level,
    shieldType,
    headshotRatio,
    selectedWeapon,
}) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'ttk', direction: 'asc' });
    const [isCalculating, setIsCalculating] = useState(false);
    
    // Debounce headshot ratio to avoid recalculating on every keystroke
    const debouncedHeadshotRatio = useDebounce(headshotRatio, DEBOUNCE_DELAY_MS);
    
    useEffect(() => {
        // Loading state management - acceptable pattern for this use case
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsCalculating(true);
        // Use requestAnimationFrame to allow UI to update before heavy calculation
        const frame = requestAnimationFrame(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsCalculating(false);
        });
        return () => cancelAnimationFrame(frame);
    }, [level, shieldType, debouncedHeadshotRatio]);

    const rarityColors = {
        common: 'text-gray-500 dark:text-gray-400',
        uncommon: 'text-emerald-500 dark:text-emerald-400',
        rare: 'text-blue-500 dark:text-blue-400',
        epic: 'text-purple-500 dark:text-purple-400',
        legendary: 'text-orange-500 dark:text-orange-400',
    };

    // Early return if GUNS data is not available
    if (!GUNS) {
        return <div className="p-4 text-red-500">Error: Weapon data not loaded</div>;
    }

    const leaderboardData = useMemo(() => {
        const startTime = performance.now();
        
        const data = Object.keys(GUNS).map((gunName) => {
            // Use debounced headshot ratio
            try {
                const result = calculateTTK(gunName, shieldType, level, debouncedHeadshotRatio);
                const gunData = GUNS[gunName as keyof typeof GUNS];
                
                if (!result) {
                    // Log but don't break UI
                    logger.warn(`Failed to calculate TTK for ${gunName}`);
                }
                
                return {
                    name: gunName,
                    image: gunData.image,
                    rarity: gunData.rarity as keyof typeof rarityColors,
                    ttk: result?.ttk ?? FALLBACK_TTK,
                    dps: result?.dps ?? FALLBACK_DPS,
                    bulletsFired: result?.bulletsFired ?? FALLBACK_BULLETS,
                    reloads: result?.reloads ?? 0,
                    hasError: result === null,
                };
            } catch (error) {
                logger.error(`Unexpected TTK error for ${gunName}`, error);
                const gunData = GUNS[gunName as keyof typeof GUNS];
                return {
                    name: gunName,
                    image: gunData.image,
                    rarity: gunData.rarity as keyof typeof rarityColors,
                    ttk: FALLBACK_TTK,
                    dps: FALLBACK_DPS,
                    bulletsFired: FALLBACK_BULLETS,
                    reloads: 0,
                    hasError: true,
                };
            }
        });

        const sorted = data.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
        const endTime = performance.now();
        const calculationTime = endTime - startTime;
        
        // Log performance in development mode
        if (import.meta.env.DEV) {
            logger.info(`Leaderboard calculation took ${calculationTime.toFixed(2)}ms for ${data.length} weapons`);
        }
        
        return sorted;
    }, [shieldType, level, debouncedHeadshotRatio, sortConfig]);

    const handleSort = (key: SortKey) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 relative">
            {isCalculating && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            )}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Weapon Leaderboard</h3>
            </div>
            <div className="overflow-x-auto">
                <table
                    role="table"
                    aria-label="Weapon performance leaderboard"
                    className="min-w-full divide-y divide-gray-200 dark:divide-gray-800"
                >
                    <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                                #
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">Weapon <SortIcon columnKey="name" sortConfig={sortConfig} /></div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                onClick={() => handleSort('ttk')}
                            >
                                <div className="flex items-center justify-end">TTK <SortIcon columnKey="ttk" sortConfig={sortConfig} /></div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                onClick={() => handleSort('dps')}
                            >
                                <div className="flex items-center justify-end">DPS <SortIcon columnKey="dps" sortConfig={sortConfig} /></div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                onClick={() => handleSort('bulletsFired')}
                            >
                                <div className="flex items-center justify-end">Shots to Kill <SortIcon columnKey="bulletsFired" sortConfig={sortConfig} /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {leaderboardData.map((row, index) => (
                            <WeaponRow
                                key={row.name}
                                row={row}
                                index={index}
                                rarityColors={rarityColors}
                                isSelected={selectedWeapon === row.name}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
