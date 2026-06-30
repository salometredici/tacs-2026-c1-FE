import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import { theme, GlobalStyle } from './app/styles/theme'
import './index.css'
import './app/config/axiosConfig'
import { initTelegram } from './app/utils/telegram'
import App from './App'

// Inicializa el SDK de Telegram si la app corre dentro de una Mini App (no-op fuera de Telegram).
initTelegram()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
