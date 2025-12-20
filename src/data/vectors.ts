// Rarity type with const assertion
export const RARITY_VALUES = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
export type Rarity = typeof RARITY_VALUES[number];

export interface Gun {
    damage: number;
    fire_rate: number;
    mag_size: number;
    reload_time: number;
    rarity: Rarity;
    image: string;
}

export interface Shield {
    shield_damage_reduction: number;
    shield_health: number;
}

export interface UpgradeLevel {
    fire_rate_increase?: number;
    reload_reduction?: number;
    mag_size_bonus?: number;
    durability_bonus?: number;
}

export type ShieldType = 'light' | 'medium' | 'heavy';

export interface GunStats extends Gun {
    durability: number;
}

// Damage log entry type
export interface DamageLogEntry {
    type: 'shot' | 'reload';
    bullet?: number;
    time: number;
    shieldHealthBefore?: number;
    shieldHealthAfter?: number;
    healthBefore?: number;
    healthAfter?: number;
    shieldActive?: boolean;
    bulletsRemaining?: number;
    reloadNumber?: number;
}
