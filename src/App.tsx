import { useState, useEffect } from 'react';
import { WeaponSelector } from './components/WeaponSelector';
import { LoadoutConfig } from './components/LoadoutConfig';
import { DamageChart } from './components/DamageChart';
import { calculateTTK, type TTKResult } from './utils/calculator';
import { WeaponLeaderboard } from './components/WeaponLeaderboard';
import type { ShieldType } from './data/vectors';
import gunsData from './data/guns.json';

const { GUNS } = gunsData;

function App() {
  const [selectedWeapon, setSelectedWeapon] = useState<string>('bobcat');
  const [level, setLevel] = useState<number>(1);
  const [shieldType, setShieldType] = useState<ShieldType>('medium');
  const [headshotRatio, setHeadshotRatio] = useState<number>(0.0);
  const [result, setResult] = useState<TTKResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset level to 1 when selecting a legendary weapon
  useEffect(() => {
    const gunData = GUNS[selectedWeapon as keyof typeof GUNS];
    if (gunData?.rarity === 'legendary' && level > 1) {
      setLevel(1);
    }
  }, [selectedWeapon, level, setLevel]);

  useEffect(() => {
    try {
      const calcResult = calculateTTK(selectedWeapon, shieldType, level, headshotRatio);
      if (calcResult === null) {
        // Deriving state from props - acceptable pattern for this use case
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(`Failed to calculate TTK for ${selectedWeapon}. Please try another weapon.`);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResult(null);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(null);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResult(calcResult);
      }
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('An error occurred during calculation');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(null);
    }
  }, [selectedWeapon, level, shieldType, headshotRatio]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <span className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-500">TOPOL</span>
        </div>

        <header className="text-center space-y-2 pt-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            TTK CALCULATOR
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Controls Column */}
          <div className="md:col-span-5 bg-white dark:bg-gray-900 shadow rounded-lg p-6 space-y-6 relative z-20">
            <WeaponSelector
              selectedWeapon={selectedWeapon}
              onSelectWeapon={setSelectedWeapon}
            />

            <hr className="border-gray-200 dark:border-gray-800" />

            <LoadoutConfig
              selectedWeapon={selectedWeapon}
              level={level}
              setLevel={setLevel}
              shieldType={shieldType}
              setShieldType={setShieldType}
              headshotRatio={headshotRatio}
              setHeadshotRatio={setHeadshotRatio}
            />
          </div>

          {/* Results Column */}
          <div className="md:col-span-7 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
            <DamageChart result={result} error={error} />

          </div>

        </div>

        {/* Leaderboard Section */}
        <div className="w-full">
          <WeaponLeaderboard
            level={level}
            shieldType={shieldType}
            headshotRatio={headshotRatio}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
