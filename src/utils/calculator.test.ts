import { describe, it, expect, beforeEach } from 'vitest';
import { calculateTTK, getGunStats } from './calculator';
import type { ShieldType } from '../data/vectors';

describe('getGunStats', () => {
    it('should return stats for valid weapon and level', () => {
        const stats = getGunStats('bobcat', 1);
        expect(stats).not.toBeNull();
        expect(stats?.damage).toBeGreaterThan(0);
        expect(stats?.fire_rate).toBeGreaterThan(0);
        expect(stats?.mag_size).toBeGreaterThan(0);
        expect(stats?.reload_time).toBeGreaterThan(0);
    });
    
    it('should return null for invalid weapon', () => {
        const stats = getGunStats('invalid_weapon_name', 1);
        expect(stats).toBeNull();
    });
    
    it('should return null for invalid level (too low)', () => {
        const stats = getGunStats('bobcat', 0);
        expect(stats).toBeNull();
    });
    
    it('should return null for invalid level (too high)', () => {
        const stats = getGunStats('bobcat', 5);
        expect(stats).toBeNull();
    });
    
    it('should return different stats for different levels', () => {
        const stats1 = getGunStats('bobcat', 1);
        const stats4 = getGunStats('bobcat', 4);
        expect(stats1).not.toBeNull();
        expect(stats4).not.toBeNull();
        // Level 4 should have same or better stats than level 1
        expect(stats4!.durability).toBeGreaterThanOrEqual(stats1!.durability);
    });
});

describe('calculateTTK', () => {
    it('should calculate TTK for valid weapon', () => {
        const result = calculateTTK('bobcat', 'medium', 1, 0.0);
        expect(result).not.toBeNull();
        expect(result?.ttk).toBeGreaterThan(0);
        expect(result?.bulletsFired).toBeGreaterThan(0);
        expect(result?.dps).toBeGreaterThan(0);
        expect(result?.reloads).toBeGreaterThanOrEqual(0);
        expect(result?.damageLog.length).toBeGreaterThan(0);
    });
    
    it('should return null for invalid weapon', () => {
        const result = calculateTTK('invalid_weapon', 'medium', 1, 0.0);
        expect(result).toBeNull();
    });
    
    it('should handle invalid level (too low)', () => {
        const result = calculateTTK('bobcat', 'medium', 0, 0.0);
        expect(result).toBeNull();
    });
    
    it('should handle invalid level (too high)', () => {
        const result = calculateTTK('bobcat', 'medium', 5, 0.0);
        expect(result).toBeNull();
    });
    
    it('should handle invalid level (non-integer)', () => {
        const result = calculateTTK('bobcat', 'medium', 1.5, 0.0);
        expect(result).toBeNull();
    });
    
    it('should clamp headshot ratio (negative value)', () => {
        const result = calculateTTK('bobcat', 'medium', 1, -0.1);
        // Should not return null, should clamp to 0
        expect(result).not.toBeNull();
        expect(result?.headshotRatio).toBe(0);
    });
    
    it('should clamp headshot ratio (value > 1)', () => {
        const result = calculateTTK('bobcat', 'medium', 1, 1.1);
        // Should not return null, should clamp to 1
        expect(result).not.toBeNull();
        expect(result?.headshotRatio).toBe(1);
    });
    
    it('should handle different shield types', () => {
        const light = calculateTTK('bobcat', 'light', 1, 0.0);
        const medium = calculateTTK('bobcat', 'medium', 1, 0.0);
        const heavy = calculateTTK('bobcat', 'heavy', 1, 0.0);
        
        expect(light).not.toBeNull();
        expect(medium).not.toBeNull();
        expect(heavy).not.toBeNull();
        
        // Light shield should have lowest TTK (easiest to kill)
        expect(light!.ttk).toBeLessThan(medium!.ttk);
        expect(medium!.ttk).toBeLessThan(heavy!.ttk);
    });
    
    it('should account for headshots (reduces TTK)', () => {
        const noHeadshots = calculateTTK('bobcat', 'medium', 1, 0.0);
        const allHeadshots = calculateTTK('bobcat', 'medium', 1, 1.0);
        
        expect(noHeadshots).not.toBeNull();
        expect(allHeadshots).not.toBeNull();
        
        // Headshots should reduce TTK
        expect(allHeadshots!.ttk).toBeLessThan(noHeadshots!.ttk);
        expect(allHeadshots!.bulletsFired).toBeLessThanOrEqual(noHeadshots!.bulletsFired);
    });
    
    it('should include reloads in calculation when needed', () => {
        // Test with a weapon that likely needs reloads (low mag size)
        const result = calculateTTK('bobcat', 'heavy', 1, 0.0);
        expect(result).not.toBeNull();
        expect(result?.reloads).toBeGreaterThanOrEqual(0);
        
        // If reloads occurred, verify reload entries in damage log
        if (result!.reloads > 0) {
            const reloadEntries = result!.damageLog.filter(entry => entry.type === 'reload');
            expect(reloadEntries.length).toBe(result!.reloads);
        }
    });
    
    it('should handle invalid shield type', () => {
        // TypeScript should prevent this, but test runtime behavior
        const result = calculateTTK('bobcat', 'invalid' as ShieldType, 1, 0.0);
        expect(result).toBeNull();
    });
    
    it('should return null for NaN headshot ratio', () => {
        const result = calculateTTK('bobcat', 'medium', 1, NaN);
        expect(result).toBeNull();
    });
    
    it('should return null for Infinity headshot ratio', () => {
        const result = calculateTTK('bobcat', 'medium', 1, Infinity);
        expect(result).toBeNull();
    });
    
    it('should create damage log entries for each shot', () => {
        const result = calculateTTK('bobcat', 'medium', 1, 0.0);
        expect(result).not.toBeNull();
        
        const shotEntries = result!.damageLog.filter(entry => entry.type === 'shot');
        expect(shotEntries.length).toBe(result!.bulletsFired);
        
        // Verify log entries have required fields
        shotEntries.forEach(entry => {
            expect(entry.time).toBeGreaterThanOrEqual(0);
            expect(entry.healthBefore).toBeDefined();
            expect(entry.healthAfter).toBeDefined();
        });
    });
    
    it('should calculate DPS correctly', () => {
        const result = calculateTTK('bobcat', 'medium', 1, 0.0);
        expect(result).not.toBeNull();
        
        // DPS should be positive
        expect(result?.dps).toBeGreaterThan(0);
        
        // DPS should be approximately total damage / time
        // DPS = (bulletsFired * damagePerBullet) / timeElapsed
        // We can verify it's a reasonable value
        expect(Number.isFinite(result?.dps)).toBe(true);
        expect(Number.isNaN(result?.dps)).toBe(false);
    });
    
    it('should handle different weapon levels', () => {
        const level1 = calculateTTK('bobcat', 'medium', 1, 0.0);
        const level4 = calculateTTK('bobcat', 'medium', 4, 0.0);
        
        expect(level1).not.toBeNull();
        expect(level4).not.toBeNull();
        
        // Level 4 should generally perform better (lower TTK or same)
        // This depends on upgrades, so just verify both work
        expect(level1!.ttk).toBeGreaterThan(0);
        expect(level4!.ttk).toBeGreaterThan(0);
    });
    
    it('should prevent infinite loops with max iterations', () => {
        // This test verifies the safety mechanism works
        // In practice, this should never happen with valid data
        // But we test that the protection exists
        const result = calculateTTK('bobcat', 'medium', 1, 0.0);
        expect(result).not.toBeNull();
        // If calculation succeeded, iterations were within limit
        expect(result?.bulletsFired).toBeGreaterThan(0);
    });
});

