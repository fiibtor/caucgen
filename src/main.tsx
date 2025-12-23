import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import Index from "./index.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Index />
  </StrictMode>,
)
