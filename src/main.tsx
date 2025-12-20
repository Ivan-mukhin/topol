import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { validateGunsData } from './data/validate'
import { logger } from './utils/logger'

// Validate data on app initialization
const validation = validateGunsData();
if (!validation.valid) {
    logger.error('Data validation errors:', validation.errors);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
