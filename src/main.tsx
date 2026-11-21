import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/app.css'
import App from './App'

// React Three Fiber owns a separate render root inside Canvas. StrictMode's
// development-only mount/unmount probe can ask that root to unmount while React
// is still rendering a route transition, producing noisy errors and masking real
// navigation failures. The app's own effects are idempotent, so production mode
// is the honest runtime contract for this static site.
createRoot(document.getElementById('root')!).render(<App />)
