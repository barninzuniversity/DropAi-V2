import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Error handling for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'))

// Add error boundary at the application root
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Error rendering application:', error)
}
