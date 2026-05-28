import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1E2A3B', color: '#F9FAFB', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' },
          success: { iconTheme: { primary: '#10B981', secondary: '#1E2A3B' } },
          error: { iconTheme: { primary: '#FF4D6D', secondary: '#1E2A3B' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
