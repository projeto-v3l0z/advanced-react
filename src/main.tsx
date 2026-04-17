import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
  return (
    <p>Hello, World!</p>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
