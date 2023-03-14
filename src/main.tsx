import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './css/index.css';
import './css/tailwind/output.css';

import { TransactionProvider } from './context/TransactionContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TransactionProvider>
    <App />
  </TransactionProvider>
);

