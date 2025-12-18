export interface Gun {
    damage: number;
    fire_rate: number;
    mag_size: number;
    reload_time: number;
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
