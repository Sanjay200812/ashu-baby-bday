import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CyberErrorBoundary } from './components/common/CyberErrorBoundary';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CyberErrorBoundary>
      <App />
    </CyberErrorBoundary>
  </React.StrictMode>
);
