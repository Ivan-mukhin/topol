import { useState, useEffect } from 'react';
import { WeaponSelector } from './components/WeaponSelector';
import { LoadoutConfig } from './components/LoadoutConfig';
import { DamageChart } from './components/DamageChart';
import { calculateTTK, type TTKResult } from './utils/calculator';
import type { ShieldType } from './data/vectors';

function App() {
  const [selectedWeapon, setSelectedWeapon] = useState<string>('bobcat');
  const [level, setLevel] = useState<number>(1);
  const [shieldType, setShieldType] = useState<ShieldType>('medium');
  const [headshotRatio, setHeadshotRatio] = useState<number>(0.0);
  const [result, setResult] = useState<TTKResult | null>(null);

  useEffect(() => {
    const calcResult = calculateTTK(selectedWeapon, shieldType, level, headshotRatio);
    setResult(calcResult);
  }, [selectedWeapon, level, shieldType, headshotRatio]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-500">TOPOL</span> TTK Calculator
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Arc Raiders Weapon Proficiency Tool
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Controls Column */}
          <div className="md:col-span-5 bg-white dark:bg-gray-900 shadow rounded-lg p-6 space-y-6">
            <WeaponSelector
              selectedWeapon={selectedWeapon}
              onSelectWeapon={setSelectedWeapon}
            />

            <hr className="border-gray-200 dark:border-gray-800" />

            <LoadoutConfig
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
            <DamageChart result={result} />

            {/* Disclaimer / Info */}
            <div className="text-xs text-gray-400 dark:text-gray-600 text-center px-4">
              <p>Data based on latest playtest stats. Calculation simulates actual bullet interactions including reloads.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
