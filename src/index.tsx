// @ts-nocheck
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { usePetStore } from './store/petStore';

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

window.mountFirefoxyApp = mountFirefoxyApp;

const existingRoot = document.getElementById('root');
if (existingRoot) {
  mountFirefoxyApp(existingRoot);
}

// Listen for messages from background script
if (typeof browser !== 'undefined') {
  browser.runtime.onMessage.addListener((message: any) => {
    if (message.type === 'FEED_PET') {
      const { selectedText, selectedElement } = message;
      const petStore = usePetStore.getState();

      let elementType: 'text' | 'image' | null = null;
      let content: string | null = null;

      if (selectedText) {
        elementType = 'text';
        content = selectedText;
        // Find the selected text's element (approximation)
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer as HTMLElement;
          const targetElement =
            container.nodeType === 1 ? container : container.parentElement;
          if (targetElement) {
            targetElement.classList.add('vacuumed');
            setTimeout(() => targetElement.classList.remove('vacuumed'), 500); // Match animation duration
          }
        }
      } else if (selectedElement) {
        elementType = 'image';
        content = selectedElement;
        const img = document.querySelector(`img[src="${selectedElement}"]`);
        if (img) {
          img.classList.add('vacuumed');
          setTimeout(() => img.classList.remove('vacuumed'), 500);
        }
      }

      if (elementType && content) {
        petStore.setSelectedElement({ type: elementType, content });
        petStore.setIsFeeding(true);
        setTimeout(() => petStore.setIsFeeding(false), 1000); // Feeding duration
      }
    }
  });
}

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

export default mountFirefoxyApp;
