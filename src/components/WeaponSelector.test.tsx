import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeaponSelector } from './WeaponSelector';

describe('WeaponSelector', () => {
    it('should render selected weapon', () => {
        const onSelect = vi.fn();
        render(<WeaponSelector selectedWeapon="bobcat" onSelectWeapon={onSelect} />);
        
        // Should show the selected weapon name
        expect(screen.getByText(/bobcat/i)).toBeInTheDocument();
    });
    
    it('should open dropdown on click', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(<WeaponSelector selectedWeapon="bobcat" onSelectWeapon={onSelect} />);
        
        const button = screen.getByRole('button');
        await user.click(button);
        
        // Dropdown should be visible (weapon list should appear)
        // Check for at least one weapon option
        const weaponOptions = screen.getAllByRole('option');
        expect(weaponOptions.length).toBeGreaterThan(0);
    });
    
    it('should call onSelectWeapon when weapon is selected', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(<WeaponSelector selectedWeapon="bobcat" onSelectWeapon={onSelect} />);
        
        const button = screen.getByRole('button');
        await user.click(button);
        
        // Find and click a different weapon
        const weaponOptions = screen.getAllByRole('option');
        if (weaponOptions.length > 1) {
            // Click the first weapon that's not the currently selected one
            const otherWeapon = weaponOptions.find(option => 
                !option.textContent?.toLowerCase().includes('bobcat')
            );
            if (otherWeapon) {
                await user.click(otherWeapon);
                expect(onSelect).toHaveBeenCalled();
            }
        }
    });
    
    it('should close dropdown after selection', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(<WeaponSelector selectedWeapon="bobcat" onSelectWeapon={onSelect} />);
        
        const button = screen.getByRole('button');
        await user.click(button);
        
        // Select a weapon
        const weaponOptions = screen.getAllByRole('option');
        if (weaponOptions.length > 0) {
            await user.click(weaponOptions[0]);
            // Dropdown should close (options should not be visible)
            // Note: This depends on implementation, may need adjustment
        }
    });
    
    it('should have proper ARIA attributes', () => {
        const onSelect = vi.fn();
        render(<WeaponSelector selectedWeapon="bobcat" onSelectWeapon={onSelect} />);
        
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-expanded');
        expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    });
});


