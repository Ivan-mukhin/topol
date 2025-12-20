import gunsData from '../data/guns.json';
import type { GunStats, ShieldType, Rarity, UpgradeLevel, DamageLogEntry } from '../data/vectors';
import { logger } from './logger';
import { ValidationError, CalculationError } from './errors';
import {
    BASE_DURABILITY,
    MAX_ITERATIONS,
    MIN_LEVEL,
    MAX_LEVEL,
    MIN_HEADSHOT_RATIO,
    MAX_HEADSHOT_RATIO,
    MIN_DAMAGE,
    MIN_FIRE_RATE,
} from '../data/constants';

const { GUNS, SHIELDS, HEADSHOT_MULTIPLIERS, GUN_UPGRADES, BASE_HEALTH } = gunsData;

// Map for memoizing gun stats by level
const GUN_STATS_BY_LEVEL: Record<string, Record<number, GunStats>> = {};

export function calculateGunStatsByLevel() {
    // Clear existing cache
    Object.keys(GUN_STATS_BY_LEVEL).forEach(key => delete GUN_STATS_BY_LEVEL[key]);

    for (const [gunName, baseStats] of Object.entries(GUNS)) {
        GUN_STATS_BY_LEVEL[gunName] = {};

        // Level 1: Base stats
        GUN_STATS_BY_LEVEL[gunName][1] = {
            damage: baseStats.damage,
            fire_rate: baseStats.fire_rate,
            mag_size: baseStats.mag_size,
            reload_time: baseStats.reload_time,
            durability: BASE_DURABILITY,
            rarity: baseStats.rarity as Rarity,
            image: baseStats.image
        };

        const upgrades = GUN_UPGRADES[gunName as keyof typeof GUN_UPGRADES] as Record<string, UpgradeLevel> | undefined;

        if (upgrades) {
            for (const level of [2, 3, 4] as const) {
                const strLevel = level.toString();
                const upgrade = upgrades[strLevel];
                if (upgrade) {
                    const prevLevelStats = GUN_STATS_BY_LEVEL[gunName][level - 1];

                    // Fire rate increase
                    let newFireRate = prevLevelStats.fire_rate;
                    if (upgrade.fire_rate_increase) {
                        newFireRate = baseStats.fire_rate * (1 + upgrade.fire_rate_increase);
                    }

                    // Mag size bonus
                    let newMagSize = prevLevelStats.mag_size;
                    if (upgrade.mag_size_bonus) {
                        newMagSize = baseStats.mag_size + upgrade.mag_size_bonus;
                    }

                    // Reload time reduction
                    let newReloadTime = prevLevelStats.reload_time;
                    if (upgrade.reload_reduction) {
                        newReloadTime = baseStats.reload_time * (1 - upgrade.reload_reduction);
                    }

                    // Durability bonus
                    let newDurability = prevLevelStats.durability;
                    if (upgrade.durability_bonus) {
                        newDurability = GUN_STATS_BY_LEVEL[gunName][1].durability + upgrade.durability_bonus;
                    }

                    GUN_STATS_BY_LEVEL[gunName][level] = {
                        damage: prevLevelStats.damage,
                        fire_rate: newFireRate,
                        mag_size: Math.floor(newMagSize),
                        reload_time: newReloadTime,
                        durability: newDurability,
                        rarity: baseStats.rarity as Rarity,
                        image: baseStats.image
                    };
                } else {
                    GUN_STATS_BY_LEVEL[gunName][level] = { ...GUN_STATS_BY_LEVEL[gunName][level - 1] };
                }
            }
        } else {
            // No upgrades, copy base stats
            for (const level of [2, 3, 4] as const) {
                GUN_STATS_BY_LEVEL[gunName][level] = { ...GUN_STATS_BY_LEVEL[gunName][1] };
            }
        }
    }
}

// Initialize on load
try {
    calculateGunStatsByLevel();
} catch (e) {
    logger.error("Failed to calculate gun stats:", e);
}

export function getGunStats(gunName: string, level: number = 1): GunStats | null {
    if (!GUN_STATS_BY_LEVEL[gunName]) return null;
    if (level < MIN_LEVEL || level > MAX_LEVEL) return null;
    return GUN_STATS_BY_LEVEL[gunName][level];
}

export interface TTKResult {
    ttk: number;
    bulletsFired: number;
    reloads: number;
    damageLog: DamageLogEntry[];
    shieldType: ShieldType;
    gunName: string;
    level: number;
    headshotRatio: number;
    dps: number;
}

// Validation function - throws ValidationError for invalid inputs
function validateInputs(
    gunName: string,
    shieldType: ShieldType,
    level: number,
    headshotRatio: number
): void {
    if (!GUNS[gunName as keyof typeof GUNS]) {
        throw new ValidationError(`Invalid gun name: ${gunName}`, 'gunName');
    }
    if (!['light', 'medium', 'heavy'].includes(shieldType)) {
        throw new ValidationError(`Invalid shield type: ${shieldType}`, 'shieldType');
    }
    if (level < MIN_LEVEL || level > MAX_LEVEL || !Number.isInteger(level)) {
        throw new ValidationError(`Invalid level: ${level}. Must be an integer between ${MIN_LEVEL} and ${MAX_LEVEL}`, 'level');
    }
    // Only reject if not finite - clamped values are acceptable
    if (!isFinite(headshotRatio)) {
        throw new ValidationError(`Invalid headshot ratio: ${headshotRatio}. Must be a finite number`, 'headshotRatio');
    }
    
    // Validate gun stats exist
    const gunStats = getGunStats(gunName, level);
    if (!gunStats) {
        throw new ValidationError(`Gun stats not found for ${gunName} at level ${level}`, 'gunStats');
    }
    
    // Validate weapon damage (critical for preventing infinite loops)
    if (gunStats.damage < MIN_DAMAGE || !isFinite(gunStats.damage)) {
        throw new ValidationError(`Invalid damage value for ${gunName}: ${gunStats.damage}`, 'damage');
    }
    
    // Validate fire rate
    if (gunStats.fire_rate < MIN_FIRE_RATE || !isFinite(gunStats.fire_rate)) {
        throw new ValidationError(`Invalid fire rate for ${gunName}: ${gunStats.fire_rate}`, 'fireRate');
    }
}

export function calculateTTK(
    gunName: string,
    shieldType: ShieldType = 'light',
    level: number = 1,
    headshotRatio: number = 0.0
): TTKResult | null {
    // Clamp headshotRatio first (defensive programming - allow out-of-range but clamp)
    const clampedHeadshotRatio = Math.max(MIN_HEADSHOT_RATIO, Math.min(MAX_HEADSHOT_RATIO, headshotRatio));
    
    try {
        // Validate inputs - throws ValidationError if invalid
        // Use clamped value for validation, but check if original was out of range
        if (headshotRatio !== clampedHeadshotRatio && isFinite(headshotRatio)) {
            // Value was clamped but is finite, so allow it through
            headshotRatio = clampedHeadshotRatio;
        }
        validateInputs(gunName, shieldType, level, headshotRatio);
    } catch (error) {
        // Catch validation errors and log them, then return null
        if (error instanceof ValidationError) {
            logger.warn(`Validation error: ${error.message}`, { field: error.field, gunName });
            return null;
        }
        // Re-throw unexpected errors
        throw error;
    }
    
    // Use clamped value
    headshotRatio = clampedHeadshotRatio;
    
    // Get gun stats (already validated above, but get again for use)
    const gunStats = getGunStats(gunName, level);
    if (!gunStats) return null; // Should never happen after validation, but defensive

    const baseDamage = gunStats.damage;
    const headshotMultiplier = HEADSHOT_MULTIPLIERS[gunName as keyof typeof HEADSHOT_MULTIPLIERS] || 1.0;
    const damagePerBullet = baseDamage * (1 - headshotRatio) + baseDamage * headshotRatio * headshotMultiplier;

    const fireRate = gunStats.fire_rate;
    const magSize = gunStats.mag_size;
    const reloadTime = gunStats.reload_time;

    const shieldConfig = SHIELDS[shieldType];
    const shieldDamageReduction = shieldConfig.shield_damage_reduction;
    const shieldHealthTotal = shieldConfig.shield_health;

    let currentShieldHealth = shieldHealthTotal;
    let currentHealth = BASE_HEALTH;
    let timeElapsed = 0.0;
    let bulletsFired = 0;
    let bulletsInCurrentMag = magSize;
    let reloads = 0;
    const damageLog: DamageLogEntry[] = [];

    const timePerBullet = 1.0 / fireRate;

    // Add iteration counter to prevent infinite loops
    let iterations = 0;

    while (currentHealth > 0 && iterations < MAX_ITERATIONS) {
        iterations++;

        // Reload check
        if (bulletsInCurrentMag === 0) {
            timeElapsed += reloadTime;
            bulletsInCurrentMag = magSize;
            reloads++;
            damageLog.push({ type: 'reload', time: timeElapsed, reloadNumber: reloads });
        }

        // Time passes (except for first shot of mag)
        if (bulletsInCurrentMag < magSize) {
            timeElapsed += timePerBullet;
        }

        bulletsFired++;
        bulletsInCurrentMag--;

        if (currentShieldHealth > 0) {
            const shieldBefore = currentShieldHealth;
            const healthBefore = currentHealth;

            currentShieldHealth -= damagePerBullet;
            // Shield takes full damage

            // Health takes reduced damage
            const healthDamage = damagePerBullet * (1 - shieldDamageReduction);
            currentHealth -= healthDamage;

            if (currentShieldHealth < 0) currentShieldHealth = 0;

            damageLog.push({
                type: 'shot',
                bullet: bulletsFired,
                time: timeElapsed,
                shieldHealthBefore: shieldBefore,
                shieldHealthAfter: currentShieldHealth,
                healthBefore: healthBefore,
                healthAfter: currentHealth,
                shieldActive: true,
                bulletsRemaining: bulletsInCurrentMag
            });

        } else {
            const healthBefore = currentHealth;
            currentHealth -= damagePerBullet;

            damageLog.push({
                type: 'shot',
                bullet: bulletsFired,
                time: timeElapsed,
                shieldHealthBefore: 0,
                shieldHealthAfter: 0,
                healthBefore: healthBefore,
                healthAfter: currentHealth,
                shieldActive: false,
                bulletsRemaining: bulletsInCurrentMag
            });
        }
    }

    // Check if max iterations exceeded
    if (iterations >= MAX_ITERATIONS) {
        const error = new CalculationError(`TTK calculation exceeded max iterations (${MAX_ITERATIONS})`, gunName);
        logger.error(error.message, { gunName, iterations });
        return null;
    }

    const dps = (bulletsFired * damagePerBullet) / timeElapsed;

    return {
        ttk: timeElapsed,
        bulletsFired,
        reloads,
        damageLog,
        shieldType,
        gunName,
        level,
        headshotRatio,
        dps
    };
}
