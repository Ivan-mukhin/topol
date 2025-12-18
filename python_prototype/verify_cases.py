from ttk_calculator import calculate_ttk_detailed, print_detailed_log

def verify():
    cases = [
        ('bobcat', 'light', 1, 0.0),
        ('kettle', 'heavy', 1, 0.0),
        ('vulcano', 'medium', 4, 0.5)
    ]
    
    print("--- VERIFICATION DATA ---")
    for gun, shield, level, headshot in cases:
        result = calculate_ttk_detailed(gun, shield, level, headshot)
        print(f"CASE: {gun} | {shield} | Lvl {level} | {headshot*100}% HS")
        print(f"TTK: {result['ttk']:.3f}")
        print(f"Bullets: {result['bullets_fired']}")
        print(f"Reloads: {result['reloads']}")
        print("-------------------------")

if __name__ == "__main__":
    verify()
