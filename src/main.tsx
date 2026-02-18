import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')
console.log('Root element:', root)

if (root) {
  createRoot(root).render(<App />)
  console.log('React app mounted successfully')
} else {
  console.error('Root element not found!')
}