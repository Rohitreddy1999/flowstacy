import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import './styles/flowstacy.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(15,12,26,0.95)',
            color: 'white',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
            fontSize: '14px'
          }
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
