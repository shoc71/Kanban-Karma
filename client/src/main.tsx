import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
