import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/style.css'
import './styles//login.css'
import './styles//homepage.css'
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);
