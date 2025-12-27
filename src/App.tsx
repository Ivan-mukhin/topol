import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { TTKCalculator } from './components/TTKCalculator';
import { TradingPlatform } from './components/TradingPlatform';
import { Login } from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ttk-calculator" element={<TTKCalculator />} />
        <Route path="/trading" element={<TradingPlatform />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
