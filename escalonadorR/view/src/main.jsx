import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Escalonador from './components/escalonador';
import './assets/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);