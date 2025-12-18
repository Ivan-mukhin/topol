"""
Time to Kill (TTK) Calculator for Arc Raiders

Calculates the effective time to kill a target with base health of 100
and various shield types that provide damage reduction.
"""

# Shield configurations
SHIELDS = {
    'light': {
        'shield_damage_reduction': 0.4,
        'shield_health': 40
    },
    'medium': {
        'shield_damage_reduction': 0.425,
        'shield_health': 70
    },
    'heavy': {
        'shield_damage_reduction': 0.525,
        'shield_health': 80
    }
}

# Gun configurations
# BPS = Bullets Per Second (fire_rate)
# Note: reload_time values preserved from previous config where available, default 2.0s for new weapons
GUNS = {
    'bobcat': {
        'damage': 6,
        'fire_rate': 16.785,
        'mag_size': 20,
        'reload_time': 2.0  # Default, needs verification
    },
    'torrente': {
        'damage': 8,
        'fire_rate': 13.42,
        'mag_size': 60,
        'reload_time': 2.0  # Default, needs verification
    },
    'stitcher': {
        'damage': 7,
        'fire_rate': 11.448,
        'mag_size': 20,
        'reload_time': 2.0  # Default, needs verification
    },
    'tempest': {
        'damage': 10,
        'fire_rate': 9.315,
        'mag_size': 25,
        'reload_time': 2.0  # Default, needs verification
    },
    'kettle': {
        'damage': 10,
        'fire_rate': 7.415,
        'mag_size': 20,
        'reload_time': 3  # Preserved from previous config
    },
    'burletta': {
        'damage': 10,
        'fire_rate': 6.519,
        'mag_size': 12,
        'reload_time': 2.0  # Default, needs verification
    },
    'bettina': {
        'damage': 14,
        'fire_rate': 4.8,
        'mag_size': 20,
        'reload_time': 2.0  # Default, needs verification
    },
    'venator': {
        'damage': 18,
        'fire_rate': 3.169,
        'mag_size': 10,
        'reload_time': 1.78  # Preserved from previous config
    },
    'vulcano': {
        'damage': 49.5,
        'fire_rate': 1.899,
        'mag_size': 6,
        'reload_time': 2.0  # Default, needs verification
    },
    'renegade': {
        'damage': 35,  # Not provided in new data, preserved from previous config
        'fire_rate': 0.743,
        'mag_size': 8,
        'reload_time': 4.56  # Preserved from previous config
    },
    'toro': {
        'damage': 67.5,
        'fire_rate': 0.694,
        'mag_size': 5,
        'reload_time': 2.0  # Default, needs verification
    },
    'anvil': {
        'damage': 40,
        'fire_rate': 0.65,
        'mag_size': 6,
        'reload_time': 2.0  # Default, needs verification
    },
    'ferro': {
        'damage': 40,
        'fire_rate': 0.341,
        'mag_size': 1,
        'reload_time': 1.73  # Preserved from previous config
    }
}

# Base health constant
BASE_HEALTH = 100

# Headshot multipliers for each gun
# Damage to head is multiplied by this value (body shots = 1x)
HEADSHOT_MULTIPLIERS = {
    'bobcat': 2.0,
    'torrente': 2.0,
    'stitcher': 2.5,
    'tempest': 1.5,
    'kettle': 2.5,
    'burletta': 2.5,
    'bettina': 2.0,
    'venator': 2.5,
    'vulcano': 1.0,
    'renegade': 2.25,
    'toro': 1.0,  # Not provided, defaulting to 1x
    'anvil': 2.5,
    'ferro': 2.5
}

# Gun upgrade configurations
# Each gun can have upgrade modifiers for levels 2, 3, and 4
# Supported modifiers:
#   - fire_rate_increase: Percentage increase (e.g., 0.25 = 25% increase)
#   - reload_reduction: Percentage reduction from base (e.g., 0.13 = 13% reduction)
#   - mag_size_bonus: Absolute increase in magazine size (e.g., 10 = +10 bullets)
#   - durability_bonus: Absolute increase in durability (e.g., 10 = +10 durability)
# Note: Some upgrades mention bullet velocity, recoil, dispersion - these don't affect TTK calculations
GUN_UPGRADES = {
    'kettle': {
        2: {
            'reload_reduction': 0.13,  # 13% reduced reload time
            'durability_bonus': 10
            # 25% Increased Bullet Velocity - not used in TTK calculation
        },
        3: {
            'reload_reduction': 0.26,  # 26% reduced reload time
            'durability_bonus': 20
            # 50% Increased Bullet Velocity - not used in TTK calculation
        },
        4: {
            'reload_reduction': 0.40,  # 40% reduced reload time
            'durability_bonus': 30
            # 75% Increased Bullet Velocity - not used in TTK calculation
        }
    },
    'bobcat': {
        2: {
            'reload_reduction': 0.13,  # 13% reduced reload time
            'durability_bonus': 10
            # 15% Reduced Max Shot Dispersion, 15% Reduced Horizontal Recoil - not used in TTK
        },
        3: {
            'reload_reduction': 0.26,  # 26% reduced reload time
            'durability_bonus': 20
            # 30% Reduced Max Shot Dispersion, 30% Reduced Horizontal Recoil - not used in TTK
        },
        4: {
            'reload_reduction': 0.40,  # 40% reduced reload time
            'durability_bonus': 30
            # 50% Reduced Max Shot Dispersion, 45% Reduced Horizontal Recoil - not used in TTK
        }
    },
    'torrente': {
        2: {
            'mag_size_bonus': 10,  # +10 Magazine Size
            'reload_reduction': 0.15,  # 15% reduced reload time
            'durability_bonus': 10
        },
        3: {
            'mag_size_bonus': 20,  # +20 Magazine Size
            'reload_reduction': 0.30,  # 30% reduced reload time
            'durability_bonus': 20
        },
        4: {
            'mag_size_bonus': 30,  # +30 Magazine Size
            'reload_reduction': 0.45,  # 45% reduced reload time
            'durability_bonus': 30
        }
    },
    'stitcher': {
        2: {
            'reload_reduction': 0.13,  # 13% reduced reload time
            'durability_bonus': 10
            # 16.6% Reduced Horizontal Recoil - not used in TTK
        },
        3: {
            'reload_reduction': 0.26,  # 26% reduced reload time
            'durability_bonus': 20
            # 33.3% Reduced Horizontal Recoil - not used in TTK
        },
        4: {
            'reload_reduction': 0.40,  # 40% reduced reload time
            'durability_bonus': 30
            # 50% Reduced Horizontal Recoil - not used in TTK
        }
    },
    'tempest': {
        2: {
            'reload_reduction': 0.13,  # 13% reduced reload time
            'durability_bonus': 10
            # 16.6% Reduced Horizontal Recoil - not used in TTK
        },
        3: {
            'reload_reduction': 0.26,  # 26% reduced reload time
            'durability_bonus': 20
            # 33.3% Reduced Horizontal Recoil - not used in TTK
        },
        4: {
            'reload_reduction': 0.40,  # 40% reduced reload time
            'durability_bonus': 30
            # 50% Reduced Horizontal Recoil - not used in TTK
        }
    },
    'burletta': {
        2: {
            'reload_reduction': 0.166,  # 16.6% reduced reload time
            'durability_bonus': 10
        },
        3: {
            'reload_reduction': 0.333,  # 33.3% reduced reload time
            'durability_bonus': 20
        },
        4: {
            'reload_reduction': 0.50,  # 50% reduced reload time
            'durability_bonus': 30
        }
    },
    'bettina': {
        # No upgrade data provided
    },
    'venator': {
        2: {
            'fire_rate_increase': 0.13,  # 13% increased fire rate
            'reload_reduction': 0.16,  # 16% reduced reload time
            'durability_bonus': 10
        },
        3: {
            'fire_rate_increase': 0.26,  # 26% increased fire rate
            'reload_reduction': 0.33,  # 33% reduced reload time
            'durability_bonus': 20
        },
        4: {
            'fire_rate_increase': 0.40,  # 40% increased fire rate
            'reload_reduction': 0.50,  # 50% reduced reload time
            'durability_bonus': 30
        }
    },
    'vulcano': {
        2: {
            'fire_rate_increase': 0.10,  # 10% increased fire rate
            'reload_reduction': 0.13,  # 13% reduced reload time
            'durability_bonus': 10
        },
        3: {
            'fire_rate_increase': 0.20,  # 20% increased fire rate
            'reload_reduction': 0.26,  # 26% reduced reload time
            'durability_bonus': 20
        },
        4: {
            'fire_rate_increase': 0.30,  # 30% increased fire rate
            'reload_reduction': 0.40,  # 40% reduced reload time
            'durability_bonus': 30
        }
    },
    'renegade': {
        2: {
            'fire_rate_increase': 0.25,  # 25% increased fire rate
            'durability_bonus': 10
            # 16.6% Reduced Dispersion Recovery Time - not used in TTK
        },
        3: {
            'fire_rate_increase': 0.50,  # 50% increased fire rate
            'durability_bonus': 20
            # 33.3% Reduced Dispersion Recovery Time - not used in TTK
        },
        4: {
            'fire_rate_increase': 0.75,  # 75% increased fire rate
            'durability_bonus': 30
            # 50% Reduced Dispersion Recovery Time - not used in TTK
        }
    },
    'toro': {
        2: {
            'fire_rate_increase': 0.175,  # 17.5% increased fire rate
            'mag_size_bonus': 1,  # +1 Magazine Size
            'durability_bonus': 10
        },
        3: {
            'fire_rate_increase': 0.35,  # 35% increased fire rate
            'mag_size_bonus': 2,  # +2 Magazine Size
            'durability_bonus': 20
        },
        4: {
            'fire_rate_increase': 0.50,  # 50% increased fire rate
            'mag_size_bonus': 3,  # +3 Magazine Size
            'durability_bonus': 30
        }
    },
    'anvil': {
        2: {
            'fire_rate_increase': 0.25,  # 25% increased fire rate
            'durability_bonus': 10
            # 6.5% Reduced Dispersion Recovery Time - not used in TTK
        },
        3: {
            'fire_rate_increase': 0.50,  # 50% increased fire rate
            'durability_bonus': 20
            # 12.5% Reduced Dispersion Recovery Time - not used in TTK
        },
        4: {
            'fire_rate_increase': 0.75,  # 75% increased fire rate
            'durability_bonus': 30
            # 18.75% Reduced Dispersion Recovery Time - not used in TTK
        }
    },
    'ferro': {
        2: {
            'reload_reduction': 0.13,  # 13% reduced reload time
            'durability_bonus': 10
        },
        3: {
            'reload_reduction': 0.26,  # 26% reduced reload time
            'durability_bonus': 20
        },
        4: {
            'reload_reduction': 0.39,  # 39% reduced reload time
            'durability_bonus': 30
        }
    }
}

# Pre-calculated gun stats for all levels (1-4)
# Structure: {gun_name: {level: {damage, fire_rate, mag_size, reload_time, durability}}}
GUN_STATS_BY_LEVEL = {}


def calculate_gun_stats_by_level():
    """
    Calculate and store gun stats for all levels (1-4) based on base stats and upgrades.
    This function pre-calculates all stats for reusability.
    """
    global GUN_STATS_BY_LEVEL
    GUN_STATS_BY_LEVEL = {}
    
    for gun_name, base_stats in GUNS.items():
        GUN_STATS_BY_LEVEL[gun_name] = {}
        
        # Level 1: Base stats (no modifications)
        GUN_STATS_BY_LEVEL[gun_name][1] = {
            'damage': base_stats['damage'],
            'fire_rate': base_stats['fire_rate'],
            'mag_size': base_stats['mag_size'],
            'reload_time': base_stats['reload_time'],
            'durability': 100  # Base durability (assuming 100 as base)
        }
        
        # Levels 2-4: Apply upgrade modifiers if available
        if gun_name in GUN_UPGRADES:
            upgrades = GUN_UPGRADES[gun_name]
            
            for level in [2, 3, 4]:
                if level in upgrades:
                    upgrade = upgrades[level]
                    prev_level_stats = GUN_STATS_BY_LEVEL[gun_name][level - 1]
                    
                    # Fire rate increase (percentage increase from base, cumulative)
                    if 'fire_rate_increase' in upgrade:
                        fire_rate_increase = upgrade['fire_rate_increase']
                        new_fire_rate = base_stats['fire_rate'] * (1 + fire_rate_increase)
                    else:
                        new_fire_rate = prev_level_stats['fire_rate']
                    
                    # Magazine size bonus (additive from base, cumulative)
                    if 'mag_size_bonus' in upgrade:
                        mag_size_bonus = upgrade['mag_size_bonus']
                        new_mag_size = base_stats['mag_size'] + mag_size_bonus
                    else:
                        new_mag_size = prev_level_stats['mag_size']
                    
                    # Reload time reduction (percentage reduction from base, cumulative)
                    if 'reload_reduction' in upgrade:
                        reload_reduction = upgrade['reload_reduction']
                        new_reload_time = base_stats['reload_time'] * (1 - reload_reduction)
                    else:
                        new_reload_time = prev_level_stats['reload_time']
                    
                    # Durability bonus (additive from base, cumulative)
                    if 'durability_bonus' in upgrade:
                        durability_bonus = upgrade['durability_bonus']
                        new_durability = GUN_STATS_BY_LEVEL[gun_name][1]['durability'] + durability_bonus
                    else:
                        new_durability = prev_level_stats['durability']
                    
                    GUN_STATS_BY_LEVEL[gun_name][level] = {
                        'damage': prev_level_stats['damage'],  # Damage doesn't change
                        'fire_rate': new_fire_rate,
                        'mag_size': int(new_mag_size),  # Mag size must be integer
                        'reload_time': new_reload_time,
                        'durability': new_durability
                    }
                else:
                    # If upgrade not defined, use previous level stats
                    GUN_STATS_BY_LEVEL[gun_name][level] = GUN_STATS_BY_LEVEL[gun_name][level - 1].copy()
        else:
            # If no upgrades defined, all levels use base stats
            for level in [2, 3, 4]:
                GUN_STATS_BY_LEVEL[gun_name][level] = GUN_STATS_BY_LEVEL[gun_name][1].copy()


def get_gun_stats(gun_name, level=1):
    """
    Get gun stats for a specific level.
    
    Args:
        gun_name (str): Name of the gun
        level (int): Level of the gun (1-4)
    
    Returns:
        dict: Gun stats for the specified level, or None if invalid
    """
    if gun_name not in GUN_STATS_BY_LEVEL:
        return None
    
    if level < 1 or level > 4:
        return None
    
    return GUN_STATS_BY_LEVEL[gun_name].get(level)


# Initialize gun stats by level on module load
calculate_gun_stats_by_level()


def calculate_ttk(gun_name, shield_type='light', level=1, headshot_ratio=0.0):
    """
    Calculate the effective time to kill (TTK) in seconds.
    
    Damage mechanics:
    - While shield is active: shield takes full damage, health takes damage * (1 - shield_damage_reduction)
    - Once shield is broken: all damage goes to health
    - Reloads are automatically accounted for when magazine is emptied
    - Headshots deal multiplied damage based on gun's headshot multiplier
    
    Args:
        gun_name (str): Name of the gun
        shield_type (str): Type of shield ('light', 'medium', or 'heavy')
        level (int): Gun level (1-4), defaults to 1
        headshot_ratio (float): Ratio of headshots (0.0 = no headshots, 1.0 = all headshots), defaults to 0.0
    
    Returns:
        float: Time to kill in seconds, or None if invalid gun or shield type
    """
    if gun_name not in GUNS:
        print(f"Error: Invalid gun name '{gun_name}'. Must be one of: {list(GUNS.keys())}")
        return None
    
    if shield_type not in SHIELDS:
        print(f"Error: Invalid shield type '{shield_type}'. Must be one of: {list(SHIELDS.keys())}")
        return None
    
    if level < 1 or level > 4:
        print(f"Error: Invalid level {level}. Must be between 1 and 4")
        return None
    
    if headshot_ratio < 0.0 or headshot_ratio > 1.0:
        print(f"Error: Invalid headshot_ratio {headshot_ratio}. Must be between 0.0 and 1.0")
        return None
    
    # Get gun stats for the specified level
    gun_stats = get_gun_stats(gun_name, level)
    if gun_stats is None:
        print(f"Error: Could not retrieve stats for {gun_name} level {level}")
        return None
    
    base_damage = gun_stats['damage']
    # Calculate effective damage based on headshot ratio
    headshot_multiplier = HEADSHOT_MULTIPLIERS.get(gun_name, 1.0)
    damage_per_bullet = base_damage * (1 - headshot_ratio) + base_damage * headshot_ratio * headshot_multiplier
    
    firerate = gun_stats['fire_rate']
    mag_size = gun_stats['mag_size']
    reload_time = gun_stats['reload_time']
    
    shield_config = SHIELDS[shield_type]
    shield_damage_reduction = shield_config['shield_damage_reduction']
    shield_health = shield_config['shield_health']
    
    # Initialize state
    current_shield_health = shield_health
    current_health = BASE_HEALTH
    time_elapsed = 0.0
    bullets_fired = 0
    bullets_in_current_mag = mag_size
    
    # Time per bullet (firerate is bullets/second, so time per bullet is 1/firerate)
    time_per_bullet = 1.0 / firerate
    
    # Simulate damage until target is dead
    while current_health > 0:
        # Check if we need to reload
        if bullets_in_current_mag == 0:
            time_elapsed += reload_time
            bullets_in_current_mag = mag_size
        
        # Add time between shots (but not before the first shot or first shot after reload)
        # If magazine is full, we're firing the first shot from this mag (instant)
        if bullets_in_current_mag < mag_size:
            time_elapsed += time_per_bullet
        
        # Fire a bullet
        bullets_fired += 1
        bullets_in_current_mag -= 1
        
        if current_shield_health > 0:
            # Shield is active
            # Shield takes full damage
            current_shield_health -= damage_per_bullet
            
            # Health takes reduced damage
            health_damage = damage_per_bullet * (1 - shield_damage_reduction)
            current_health -= health_damage
        else:
            # Shield is broken, all damage goes to health
            current_health -= damage_per_bullet
    
    return time_elapsed


def calculate_ttk_detailed(gun_name, shield_type='light', level=1, headshot_ratio=0.0):
    """
    Calculate TTK with detailed breakdown of the damage process.
    
    Args:
        gun_name (str): Name of the gun
        shield_type (str): Type of shield ('light', 'medium', or 'heavy')
        level (int): Gun level (1-4), defaults to 1
        headshot_ratio (float): Ratio of headshots (0.0 = no headshots, 1.0 = all headshots), defaults to 0.0
    
    Returns a dictionary with TTK and detailed information.
    """
    if gun_name not in GUNS:
        return None
    
    if shield_type not in SHIELDS:
        return None
    
    if level < 1 or level > 4:
        return None
    
    if headshot_ratio < 0.0 or headshot_ratio > 1.0:
        return None
    
    # Get gun stats for the specified level
    gun_stats = get_gun_stats(gun_name, level)
    if gun_stats is None:
        return None
    
    base_damage = gun_stats['damage']
    # Calculate effective damage based on headshot ratio
    headshot_multiplier = HEADSHOT_MULTIPLIERS.get(gun_name, 1.0)
    damage_per_bullet = base_damage * (1 - headshot_ratio) + base_damage * headshot_ratio * headshot_multiplier
    
    firerate = gun_stats['fire_rate']
    mag_size = gun_stats['mag_size']
    reload_time = gun_stats['reload_time']
    
    shield_config = SHIELDS[shield_type]
    shield_damage_reduction = shield_config['shield_damage_reduction']
    shield_health = shield_config['shield_health']
    
    current_shield_health = shield_health
    current_health = BASE_HEALTH
    time_elapsed = 0.0
    bullets_fired = 0
    bullets_in_current_mag = mag_size
    reloads = 0
    
    # Time per bullet (firerate is bullets/second, so time per bullet is 1/firerate)
    time_per_bullet = 1.0 / firerate
    
    damage_log = []
    
    while current_health > 0:
        # Check if we need to reload
        if bullets_in_current_mag == 0:
            time_elapsed += reload_time
            bullets_in_current_mag = mag_size
            reloads += 1
            damage_log.append({
                'type': 'reload',
                'time': time_elapsed,
                'reload_number': reloads
            })
        
        # Add time between shots (but not before the first shot or first shot after reload)
        # If magazine is full, we're firing the first shot from this mag (instant)
        if bullets_in_current_mag < mag_size:
            time_elapsed += time_per_bullet
        
        # Fire a bullet
        bullets_fired += 1
        bullets_in_current_mag -= 1
        
        if current_shield_health > 0:
            shield_before = current_shield_health
            health_before = current_health
            
            current_shield_health -= damage_per_bullet
            if current_shield_health < 0:
                current_shield_health = 0
            
            health_damage = damage_per_bullet * (1 - shield_damage_reduction)
            current_health -= health_damage
            
            damage_log.append({
                'type': 'shot',
                'bullet': bullets_fired,
                'time': time_elapsed,
                'shield_health_before': shield_before,
                'shield_health_after': current_shield_health,
                'health_before': health_before,
                'health_after': current_health,
                'shield_active': True,
                'bullets_remaining_in_mag': bullets_in_current_mag
            })
        else:
            health_before = current_health
            current_health -= damage_per_bullet
            
            damage_log.append({
                'type': 'shot',
                'bullet': bullets_fired,
                'time': time_elapsed,
                'shield_health_before': 0,
                'shield_health_after': 0,
                'health_before': health_before,
                'health_after': current_health,
                'shield_active': False,
                'bullets_remaining_in_mag': bullets_in_current_mag
            })
    
    return {
        'ttk': time_elapsed,
        'bullets_fired': bullets_fired,
        'reloads': reloads,
        'damage_log': damage_log,
        'shield_type': shield_type,
        'gun_name': gun_name,
        'level': level,
        'headshot_ratio': headshot_ratio,
        'base_damage': base_damage,
        'damage_per_bullet': damage_per_bullet,
        'headshot_multiplier': headshot_multiplier,
        'firerate': firerate,
        'mag_size': mag_size,
        'reload_time': reload_time,
        'durability': gun_stats.get('durability', 100)
    }


def print_ttk_summary(gun_name, shield_type='light', level=1, headshot_ratio=0.0, show_details=False):
    """
    Print a formatted summary of the TTK calculation.
    
    Args:
        gun_name (str): Name of the gun
        shield_type (str): Type of shield
        level (int): Gun level (1-4), defaults to 1
        headshot_ratio (float): Ratio of headshots (0.0 = no headshots, 1.0 = all headshots), defaults to 0.0
        show_details (bool): If True, also print detailed damage log
    """
    result = calculate_ttk_detailed(gun_name, shield_type, level, headshot_ratio)
    
    if result is None:
        return
    
    print(f"\n{'='*60}")
    print(f"TTK Calculation Summary")
    print(f"{'='*60}")
    print(f"Gun: {gun_name} (Level {result['level']})")
    print(f"  - Base damage per bullet: {result['base_damage']}")
    if result['headshot_ratio'] > 0.0:
        print(f"  - Headshot ratio: {result['headshot_ratio']*100:.1f}%")
        print(f"  - Headshot multiplier: {result['headshot_multiplier']}x")
        print(f"  - Effective damage per bullet: {result['damage_per_bullet']:.2f}")
    else:
        print(f"  - Damage per bullet: {result['damage_per_bullet']}")
    print(f"  - Firerate: {result['firerate']} bullets/second")
    print(f"  - Magazine size: {result['mag_size']}")
    print(f"  - Reload time: {result['reload_time']:.3f} seconds")
    if 'durability' in result:
        print(f"  - Durability: {result['durability']}")
    print(f"Shield type: {shield_type}")
    print(f"  - Shield health: {SHIELDS[shield_type]['shield_health']}")
    print(f"  - Shield damage reduction: {SHIELDS[shield_type]['shield_damage_reduction']*100:.1f}%")
    print(f"Base health: {BASE_HEALTH}")
    print(f"\nTime to Kill: {result['ttk']:.3f} seconds")
    print(f"Bullets fired: {result['bullets_fired']}")
    print(f"Reloads required: {result['reloads']}")
    print(f"{'='*60}\n")
    
    if show_details:
        print_detailed_log(result)


def print_detailed_log(result):
    """
    Print a detailed, easy-to-read breakdown of the damage log.
    Each entry is presented in a clear, understandable format.
    """
    print(f"\n{'='*80}")
    print(f"Detailed Damage Log - Step by Step Breakdown")
    print(f"{'='*80}")
    print(f"Gun: {result['gun_name']} (Level {result['level']}) | Shield: {result['shield_type']}")
    print(f"{'='*80}\n")
    
    entry_number = 1
    for entry in result['damage_log']:
        print(f"--- Entry #{entry_number} ---")
        
        if entry['type'] == 'reload':
            print(f"  Event: RELOAD")
            print(f"  Time: {entry['time']:.3f} seconds")
            print(f"  Description: Magazine emptied. Reloading weapon...")
            print(f"  Reload Number: {entry['reload_number']}")
            print(f"  Magazine Status: Refilled to {result['mag_size']} bullets")
            
        elif entry['type'] == 'shot':
            print(f"  Event: BULLET FIRED")
            print(f"  Time: {entry['time']:.3f} seconds")
            print(f"  Bullet Number: #{entry['bullet']}")
            print(f"  Damage Dealt: {result['damage_per_bullet']}")
            
            if entry['shield_active']:
                shield_damage = entry['shield_health_before'] - entry['shield_health_after']
                health_damage = entry['health_before'] - entry['health_after']
                print(f"  Shield Status: ACTIVE")
                print(f"    - Shield Health: {entry['shield_health_before']:.1f} -> {entry['shield_health_after']:.1f} (lost {shield_damage:.1f})")
                print(f"    - Health: {entry['health_before']:.1f} -> {entry['health_after']:.1f} (lost {health_damage:.1f} due to shield reduction)")
                if entry['shield_health_after'] == 0:
                    print(f"    - SHIELD BROKEN! All future damage goes directly to health.")
            else:
                health_damage = entry['health_before'] - entry['health_after']
                print(f"  Shield Status: BROKEN (no protection)")
                print(f"    - Shield Health: 0 (no shield)")
                print(f"    - Health: {entry['health_before']:.1f} -> {entry['health_after']:.1f} (lost {health_damage:.1f})")
            
            print(f"  Magazine: {entry['bullets_remaining_in_mag']} bullets remaining")
            
            if entry['health_after'] <= 0:
                print(f"  *** TARGET ELIMINATED! ***")
        
        print()  # Empty line between entries
        entry_number += 1
    
    print(f"{'='*80}")
    print(f"Summary:")
    print(f"  Final TTK: {result['ttk']:.3f} seconds")
    print(f"  Total Bullets Fired: {result['bullets_fired']}")
    print(f"  Total Reloads: {result['reloads']}")
    print(f"{'='*80}\n")


def print_gun_comparison_table(gun_name, shield_type='medium'):
    """
    Display a comparison table for a specific gun showing:
    - Level 1 vs Level 4
    - Normal shots vs Headshots
    - TTK and Bullets to Kill for each combination
    
    Args:
        gun_name (str): Name of the gun
        shield_type (str): Type of shield to test against (default: 'medium')
    """
    if gun_name not in GUNS:
        print(f"Error: Gun '{gun_name}' not found")
        return
    
    if shield_type not in SHIELDS:
        print(f"Error: Shield type '{shield_type}' not found")
        return
    
    print(f"\n{'='*90}")
    print(f"{gun_name.upper()} - TTK Comparison Table")
    print(f"{'='*90}")
    print(f"Shield Type: {shield_type}")
    print(f"{'='*90}\n")
    
    # Calculate stats for all combinations
    combinations = [
        ('Level 1', 'Normal', 1, 0.0),
        ('Level 1', 'Headshots', 1, 1.0),
        ('Level 4', 'Normal', 4, 0.0),
        ('Level 4', 'Headshots', 4, 1.0)
    ]
    
    results = []
    for level_name, shot_type, level, headshot_ratio in combinations:
        detailed = calculate_ttk_detailed(gun_name, shield_type, level, headshot_ratio)
        if detailed:
            results.append({
                'level_name': level_name,
                'shot_type': shot_type,
                'ttk': detailed['ttk'],
                'bullets': detailed['bullets_fired']
            })
    
    # Print table header
    print(f"{'Level':<12} {'Shot Type':<15} {'TTK (seconds)':<15} {'Bullets to Kill':<18}")
    print("-"*90)
    
    # Print results
    for result in results:
        print(f"{result['level_name']:<12} {result['shot_type']:<15} {result['ttk']:<15.3f} {result['bullets']:<18}")
    
    print(f"{'='*90}\n")


def print_all_guns_ranked(shield_type='medium', headshot_ratio=None):
    """
    Display ranked tables of all guns sorted by TTK.
    
    Default behavior (headshot_ratio=None):
    - Shows 4 tables: Level 1 & Level 4, each with Normal Shots (0%) and All Headshots (100%)
    
    Custom behavior (headshot_ratio provided):
    - Shows 1 table: Level 4 only with the specified headshot ratio
    
    Args:
        shield_type (str): Type of shield to test against (default: 'medium')
        headshot_ratio (float, optional): If provided, only show Level 4 with this headshot ratio (0.0-1.0)
    """
    if shield_type not in SHIELDS:
        print(f"Error: Shield type '{shield_type}' not found")
        return
    
    if headshot_ratio is not None:
        if headshot_ratio < 0.0 or headshot_ratio > 1.0:
            print(f"Error: headshot_ratio must be between 0.0 and 1.0")
            return
        
        # Custom mode: Only Level 4 with specified headshot ratio
        headshot_percent = headshot_ratio * 100
        title_suffix = f"Level 4 - {headshot_percent:.0f}% Headshots"
        
        print(f"\n{'='*100}")
        print(f"All Guns Ranked by TTK - {title_suffix}")
        print(f"{'='*100}")
        print(f"Shield Type: {shield_type}")
        print(f"{'='*100}\n")
        
        # Calculate TTK for all guns
        gun_results = []
        for gun_name in sorted(GUNS.keys()):
            detailed = calculate_ttk_detailed(gun_name, shield_type, 4, headshot_ratio)
            if detailed:
                gun_results.append({
                    'gun_name': gun_name,
                    'ttk': detailed['ttk'],
                    'bullets': detailed['bullets_fired'],
                    'reloads': detailed['reloads'],
                    'damage': detailed['base_damage'],
                    'fire_rate': detailed['firerate'],
                    'effective_damage': detailed['damage_per_bullet']
                })
        
        # Sort by TTK
        gun_results.sort(key=lambda x: x['ttk'])
        
        # Print table header
        print(f"{'Rank':<6} {'Gun Name':<12} {'TTK (s)':<10} {'Bullets':<10} {'Reloads':<10} "
              f"{'Base Dmg':<10} {'Eff Dmg':<10} {'Fire Rate':<12}")
        print("-"*100)
        
        # Print ranked results
        for rank, result in enumerate(gun_results, 1):
            print(f"{rank:<6} {result['gun_name']:<12} {result['ttk']:<10.3f} {result['bullets']:<10} "
                  f"{result['reloads']:<10} {result['damage']:<10} {result['effective_damage']:<10.2f} "
                  f"{result['fire_rate']:<12.3f}")
        
        print(f"{'='*100}\n")
    else:
        # Default mode: Show all 4 combinations
        combinations = [
            (1, 0.0, "Level 1 - Normal Shots (0% Headshots)"),
            (1, 1.0, "Level 1 - All Headshots (100% Headshots)"),
            (4, 0.0, "Level 4 - Normal Shots (0% Headshots)"),
            (4, 1.0, "Level 4 - All Headshots (100% Headshots)")
        ]
        
        for level, hs_ratio, title_suffix in combinations:
            print(f"\n{'='*100}")
            print(f"All Guns Ranked by TTK - {title_suffix}")
            print(f"{'='*100}")
            print(f"Shield Type: {shield_type}")
            print(f"{'='*100}\n")
            
            # Calculate TTK for all guns
            gun_results = []
            for gun_name in sorted(GUNS.keys()):
                detailed = calculate_ttk_detailed(gun_name, shield_type, level, hs_ratio)
                if detailed:
                    gun_results.append({
                        'gun_name': gun_name,
                        'ttk': detailed['ttk'],
                        'bullets': detailed['bullets_fired'],
                        'reloads': detailed['reloads'],
                        'damage': detailed['base_damage'],
                        'fire_rate': detailed['firerate'],
                        'effective_damage': detailed['damage_per_bullet']
                    })
            
            # Sort by TTK
            gun_results.sort(key=lambda x: x['ttk'])
            
            # Print table header
            print(f"{'Rank':<6} {'Gun Name':<12} {'TTK (s)':<10} {'Bullets':<10} {'Reloads':<10} "
                  f"{'Base Dmg':<10} {'Eff Dmg':<10} {'Fire Rate':<12}")
            print("-"*100)
            
            # Print ranked results
            for rank, result in enumerate(gun_results, 1):
                print(f"{rank:<6} {result['gun_name']:<12} {result['ttk']:<10.3f} {result['bullets']:<10} "
                      f"{result['reloads']:<10} {result['damage']:<10} {result['effective_damage']:<10.2f} "
                      f"{result['fire_rate']:<12.3f}")
            
            print(f"{'='*100}\n")


def print_gun_stats_by_level(gun_name):
    """
    Print all stats for a gun across all levels (1-4).
    
    Args:
        gun_name (str): Name of the gun
    """
    if gun_name not in GUN_STATS_BY_LEVEL:
        print(f"Error: Gun '{gun_name}' not found")
        return
    
    print(f"\n{'='*80}")
    print(f"{gun_name.upper()} - Stats by Level")
    print(f"{'='*80}\n")
    
    base_stats = GUN_STATS_BY_LEVEL[gun_name][1]
    print(f"Base Stats (Level 1):")
    print(f"  Damage: {base_stats['damage']} | Fire Rate: {base_stats['fire_rate']:.3f} BPS | "
          f"Mag: {base_stats['mag_size']} | Reload: {base_stats['reload_time']:.3f}s | "
          f"Durability: {base_stats['durability']}")
    print()
    
    print(f"{'Level':<8} {'Damage':<10} {'Fire Rate':<12} {'Mag':<6} {'Reload Time':<15} {'Durability':<12} {'Reload Reduction':<15}")
    print("-"*80)
    
    for level in [1, 2, 3, 4]:
        stats = GUN_STATS_BY_LEVEL[gun_name][level]
        reload_reduction = ((base_stats['reload_time'] - stats['reload_time']) / base_stats['reload_time'] * 100) if level > 1 else 0
        print(f"{level:<8} {stats['damage']:<10} {stats['fire_rate']:<12.3f} {stats['mag_size']:<6} "
              f"{stats['reload_time']:<15.3f} {stats['durability']:<12} {reload_reduction:<15.1f}%")


# Example usage
if __name__ == "__main__":
    # Example calculations
    print("Example TTK Calculations:\n")
    
    # Show detailed log for a few examples
    print("="*80)
    print("EXAMPLE 1: Kettle vs Light Shield (with detailed log)")
    print("="*80)
    print_ttk_summary('kettle', 'light', show_details=True)
    
    print("="*80)
    print("EXAMPLE 2: Ferro vs Medium Shield (with detailed log)")
    print("="*80)
    print_ttk_summary('ferro', 'medium', show_details=True)
    
    # Quick summary for all combinations
    print("\n" + "="*80)
    print("Quick Summary - All Gun/Shield Combinations")
    print("="*80)
    guns_to_test = ['kettle', 'ferro', 'venator', 'renegade']
    shields_to_test = ['light', 'medium', 'heavy']
    
    for gun_name in guns_to_test:
        for shield_type in shields_to_test:
            print_ttk_summary(gun_name, shield_type, show_details=False)

