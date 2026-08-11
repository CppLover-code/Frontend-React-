import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { CartProvider} from './contexts/CartContext'
import { BookProvider} from './contexts/BookContext'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <BookProvider>
            <NotificationProvider>
                          <App />
            </NotificationProvider>
          </BookProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
