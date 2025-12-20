import gunsData from './guns.json';
import type { Gun, Shield, ShieldType, Rarity } from './vectors';
import { logger } from '../utils/logger';

const RARITY_VALUES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const SHIELD_TYPES: ShieldType[] = ['light', 'medium', 'heavy'];

function isValidRarity(value: unknown): value is Rarity {
    return typeof value === 'string' && RARITY_VALUES.includes(value as Rarity);
}

function isValidGun(data: unknown): data is Gun {
    if (typeof data !== 'object' || data === null) return false;
    const gun = data as Record<string, unknown>;
    
    return (
        typeof gun.damage === 'number' &&
        typeof gun.fire_rate === 'number' &&
        typeof gun.mag_size === 'number' &&
        typeof gun.reload_time === 'number' &&
        typeof gun.image === 'string' &&
        isValidRarity(gun.rarity)
    );
}

function isValidShield(data: unknown): data is Shield {
    if (typeof data !== 'object' || data === null) return false;
    const shield = data as Record<string, unknown>;
    
    return (
        typeof shield.shield_damage_reduction === 'number' &&
        typeof shield.shield_health === 'number'
    );
}

export function validateGunsData(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const { GUNS, SHIELDS, BASE_HEALTH } = gunsData;
    
    // Validate GUNS
    if (typeof GUNS !== 'object' || GUNS === null) {
        errors.push('GUNS is not an object');
    } else {
        for (const [name, gun] of Object.entries(GUNS)) {
            if (!isValidGun(gun)) {
                errors.push(`Invalid gun data for ${name}`);
            }
        }
    }
    
    // Validate SHIELDS
    if (typeof SHIELDS !== 'object' || SHIELDS === null) {
        errors.push('SHIELDS is not an object');
    } else {
        for (const [type, shield] of Object.entries(SHIELDS)) {
            if (!SHIELD_TYPES.includes(type as ShieldType)) {
                errors.push(`Invalid shield type: ${type}`);
            }
            if (!isValidShield(shield)) {
                errors.push(`Invalid shield data for ${type}`);
            }
        }
    }
    
    // Validate BASE_HEALTH
    if (typeof BASE_HEALTH !== 'number' || BASE_HEALTH <= 0) {
        errors.push('BASE_HEALTH must be a positive number');
    }
    
    return {
        valid: errors.length === 0,
        errors,
    };
}

// Call on module load
const validation = validateGunsData();
if (!validation.valid) {
    logger.error('Guns data validation failed:', validation.errors);
    // In production, you might want to throw or show error UI
}

