// @ts-nocheck
declare const browser: any;

if (typeof browser === 'undefined') {
  if (typeof chrome !== 'undefined') {
    (window as any).browser = chrome;
  } else {
    console.log('Using mock Firefox API');
    (window as any).browser = {
      runtime: { getURL: (url: string) => `/dist${url}` },
      tabs: {
        query: (queryInfo: any, callback: (tabs: any[]) => void) =>
          callback([{ id: 1 }]),
      },
    };
  }
}

if (!document.getElementById('firefoxy-container')) {
  console.log('Creating firefoxy-container...');
  const container = document.createElement('div');
  container.id = 'firefoxy-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.backgroundColor = 'transparent';
  container.style.zIndex = '1000';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  container.appendChild(rootDiv);
  console.log('firefoxy-container and root created');
}

(function setGlobalConfig() {
  const computedGltfUrl = browser.runtime.getURL('/dist/pets/Glub.gltf');
  console.log('Computed GLTF URL:', computedGltfUrl);
  const script = document.createElement('script');
  script.textContent = `
    window.ADDON_CONFIG = window.ADDON_CONFIG || {};
    window.ADDON_CONFIG.gltfUrl = '${computedGltfUrl}';
    console.log('ADDON_CONFIG.gltfUrl set to:', window.ADDON_CONFIG.gltfUrl);
  `;
  document.head.appendChild(script);
  script.remove();
})();

function injectDOMScript(file: string) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src*="${file}"]`);
    if (existingScript) {
      console.log('Script already exists:', existingScript.src);
      return resolve(existingScript.src);
    }

    const url = browser.runtime.getURL('dist/' + file);
    console.log('Injecting script:', url);
    const script = document.createElement('script');
    script.src = url;
    script.async = false;

    script.onload = () => {
      console.log('Script loaded:', url);
      resolve(url);
    };
    script.onerror = (err) => {
      console.error('Script load failed:', url, err);
      reject(new Error(`Script Load Error: ${url}`));
    };
    document.head.appendChild(script);
  });
}

function mountApp() {
  const files = ['vendors.bundle.js', 'app.js'];
  console.log('Starting script injection for:', files);
  injectDOMScript('vendors.bundle.js')
    .then(() => injectDOMScript('app.js'))
    .then(() => {
      console.log('All scripts injected, attempting to mount app...');
      const root = document.getElementById('root');
      if (root) {
        console.log('Root element found:', root);
        if (typeof window.mountFirefoxyApp === 'function') {
          console.log('mountFirefoxyApp is a function, calling it...');
          window.mountFirefoxyApp(root);
          console.log('App mounted successfully');
        } else {
          console.error(
            'mountFirefoxyApp is not a function:',
            typeof window.mountFirefoxyApp
          );
        }
      } else {
        console.error('Root element not found');
      }
    })
    .catch((err) => console.error('Script injection error:', err));
}

// Mount immediately for testing
mountApp();

browser.runtime.onMessage.addListener((message: any) => {
  console.log('Received message:', message);
  if (message.type === 'OPEN_TAMAGOTCHI') {
    mountApp();
  } else if (message.type === 'FEED_PET') {
    const { selectedText, selectedElement } = message;
    const petStore = (window as any).usePetStore?.getState?.();
    if (!petStore) {
      console.log('Pet store not available, mounting app...');
      mountApp();
      setTimeout(() => {
        const delayedStore = (window as any).usePetStore?.getState?.();
        if (delayedStore)
          handleFeed(delayedStore, selectedText, selectedElement);
        else console.error('Pet store still not available after delay');
      }, 2000);
    } else {
      handleFeed(petStore, selectedText, selectedElement);
    }
  }
});

function handleFeed(
  petStore: any,
  selectedText: string,
  selectedElement: string
) {
  let elementType: 'text' | 'image' | null = null;
  let content: string | null = null;

  if (selectedText) {
    elementType = 'text';
    content = selectedText;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer as HTMLElement;
      const targetElement =
        container.nodeType === 1 ? container : container.parentElement;
      if (targetElement) {
        targetElement.classList.add('vacuumed');
        setTimeout(() => targetElement.classList.remove('vacuumed'), 500);
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
    setTimeout(() => petStore.setIsFeeding(false), 1000);
  }
}

console.log('Content script loaded.');
