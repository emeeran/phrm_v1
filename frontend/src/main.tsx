import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
