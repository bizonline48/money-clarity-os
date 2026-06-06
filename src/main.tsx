import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './app/Router';
import { Providers } from './app/Providers';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <Router />
    </Providers>
  </React.StrictMode>,
);
