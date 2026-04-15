import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

