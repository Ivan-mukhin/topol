import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeaponLeaderboard } from './WeaponLeaderboard';
import type { TTKResult } from '../utils/calculator';
import { calculateTTK } from '../utils/calculator';

vi.mock('../utils/calculator', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../utils/calculator')>();
    return {
        ...actual,
        calculateTTK: vi.fn(),
    };
});

describe('WeaponLeaderboard', () => {
    const mockCalculateTTK = vi.mocked(calculateTTK);

    const baseResult: TTKResult = {
        ttk: 1.234,
        bulletsFired: 5,
        reloads: 0,
        damageLog: [],
        shieldType: 'medium',
        gunName: 'bobcat',
        level: 1,
        headshotRatio: 0,
        dps: 100,
    };

    beforeEach(() => {
        mockCalculateTTK.mockReset();
        mockCalculateTTK.mockReturnValue(baseResult);
    });

    it('renders an error badge when a calculation returns null (Infinity fallback)', async () => {
        mockCalculateTTK.mockImplementationOnce(() => null);

        render(
            <WeaponLeaderboard
                level={1}
                shieldType="medium"
                headshotRatio={0}
                selectedWeapon="bobcat"
            />
        );

        expect(await screen.findByText('Error')).toBeInTheDocument();
    });

    it('renders an error badge when a calculation throws', async () => {
        mockCalculateTTK.mockImplementationOnce(() => {
            throw new Error('boom');
        });

        render(
            <WeaponLeaderboard
                level={1}
                shieldType="medium"
                headshotRatio={0}
                selectedWeapon="bobcat"
            />
        );

        expect(await screen.findByText('Error')).toBeInTheDocument();
    });
});

