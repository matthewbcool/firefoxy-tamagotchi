// @ts-nocheck
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

declare var module: any;

declare global {
  interface Window {
    mountFirefoxyApp?: (elm: HTMLElement) => void;
  }
}

const mountFirefoxyApp = (elm: HTMLElement) => {
  const root = createRoot(elm);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Explicitly attach our mount function to window.
window.mountFirefoxyApp = mountFirefoxyApp;

export default mountFirefoxyApp;

// For local dev auto‑mounting.
const existingRoot = document.getElementById('root');
if (existingRoot) {
  mountFirefoxyApp(existingRoot);
}

// Enable HMR if available.
if ((module as any).hot) {
  (module as any).hot.accept('./App', () => {
    const NextApp = require('./App').default;
    if (existingRoot) {
      const root = createRoot(existingRoot);
      root.render(
        <React.StrictMode>
          <NextApp />
        </React.StrictMode>
      );
    }
  });
}
