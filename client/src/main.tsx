import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
// import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
