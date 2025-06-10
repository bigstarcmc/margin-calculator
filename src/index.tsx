import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind 및 기본 CSS 포함
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 성능 측정 로그
reportWebVitals();
