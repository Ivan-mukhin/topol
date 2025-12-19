import gunsData from '../data/guns.json';
import type { GunStats, ShieldType } from '../data/vectors';

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
            durability: 100, // Base durability
            rarity: baseStats.rarity as any,
            image: baseStats.image
        };

        const upgrades = GUN_UPGRADES[gunName as keyof typeof GUN_UPGRADES];

        if (upgrades) {
            for (const level of [2, 3, 4]) {
                const strLevel = level.toString();
                // @ts-ignore - JSON keys are strings
                if (upgrades[strLevel]) {
                    // @ts-ignore
                    const upgrade = upgrades[strLevel];
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
                        rarity: baseStats.rarity as any,
                        image: baseStats.image
                    };
                } else {
                    GUN_STATS_BY_LEVEL[gunName][level] = { ...GUN_STATS_BY_LEVEL[gunName][level - 1] };
                }
            }
        } else {
            // No upgrades, copy base stats
            for (const level of [2, 3, 4]) {
                GUN_STATS_BY_LEVEL[gunName][level] = { ...GUN_STATS_BY_LEVEL[gunName][1] };
            }
        }
    }
}

// Initialize on load
try {
    calculateGunStatsByLevel();
} catch (e) {
    console.error("Failed to calculate gun stats:", e);
}

export function getGunStats(gunName: string, level: number = 1): GunStats | null {
    if (!GUN_STATS_BY_LEVEL[gunName]) return null;
    if (level < 1 || level > 4) return null;
    return GUN_STATS_BY_LEVEL[gunName][level];
}

export interface TTKResult {
    ttk: number;
    bulletsFired: number;
    reloads: number;
    damageLog: any[];
    shieldType: ShieldType;
    gunName: string;
    level: number;
    headshotRatio: number;
    dps: number;
}

export function calculateTTK(
    gunName: string,
    shieldType: ShieldType = 'light',
    level: number = 1,
    headshotRatio: number = 0.0
): TTKResult | null {
    if (!GUNS[gunName as keyof typeof GUNS]) return null;

    const gunStats = getGunStats(gunName, level);
    if (!gunStats) return null;

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
    const damageLog = [];

    const timePerBullet = 1.0 / fireRate;

    while (currentHealth > 0) {
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
