import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Escalonador from './telas/escalonador'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Escalonador />
  </StrictMode>,
)
