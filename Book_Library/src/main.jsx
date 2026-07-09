import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { CartProvider} from './contexts/CartContext'
import { BookProvider} from './contexts/BookContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <BookProvider>
            <App />
        </BookProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
