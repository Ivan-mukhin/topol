import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DamageChart } from './DamageChart';
import type { TTKResult } from '../utils/calculator';

describe('DamageChart', () => {
    const mockResult: TTKResult = {
        ttk: 2.5,
        bulletsFired: 10,
        reloads: 1,
        damageLog: [],
        shieldType: 'medium',
        gunName: 'bobcat',
        level: 1,
        headshotRatio: 0.0,
        dps: 100,
    };
    
    it('should render performance statistics when result is provided', () => {
        render(<DamageChart result={mockResult} />);
        
        expect(screen.getByText('Performance Statistics')).toBeInTheDocument();
        expect(screen.getByText('Time to Kill')).toBeInTheDocument();
        expect(screen.getByText('Est. DPS')).toBeInTheDocument();
        expect(screen.getByText('Shots to Kill')).toBeInTheDocument();
        
        // Check for specific values in their sections
        expect(screen.getByText(/2\.500/)).toBeInTheDocument(); // TTK with 3 decimals
        // DPS is shown as 100 (from mockResult.dps = 100)
        expect(screen.getByText('100')).toBeInTheDocument();
        // Bullets fired is shown as 10
        const shotsSection = screen.getByText('Shots to Kill').closest('div');
        expect(shotsSection).toHaveTextContent('10');
    });
    
    it('should show placeholder when result is null', () => {
        render(<DamageChart result={null} />);
        
        expect(screen.getByText(/Select a weapon to see stats/i)).toBeInTheDocument();
    });
    
    it('should show error message when error is provided', () => {
        render(<DamageChart result={null} error="Calculation error" />);
        
        expect(screen.getByText(/Calculation error/i)).toBeInTheDocument();
    });
    
    it('should display reloads count when reloads > 0', () => {
        render(<DamageChart result={mockResult} />);
        
        // Reloads are shown as "+1 Reload" or "+N Reloads"
        expect(screen.getByText(/\+1 Reload/)).toBeInTheDocument();
    });
    
    it('should not display reloads when reloads is 0', () => {
        const resultNoReloads = { ...mockResult, reloads: 0 };
        render(<DamageChart result={resultNoReloads} />);
        
        // Should not show reload text when reloads is 0
        expect(screen.queryByText(/Reload/)).not.toBeInTheDocument();
    });
    
    it('should format TTK with 3 decimal places', () => {
        const resultWithDecimal = { ...mockResult, ttk: 2.567 };
        render(<DamageChart result={resultWithDecimal} />);
        
        // Should show 2.567s
        expect(screen.getByText(/2\.567/)).toBeInTheDocument();
    });
});

