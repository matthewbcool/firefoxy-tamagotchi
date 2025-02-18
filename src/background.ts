// src/background.ts
function initializeContextMenu() {
  // Main Tamagotchi menu
  browser.menus.create(
    {
      id: 'firefoxy-tamagotchi',
      title: 'Open Firefoxy Tamagotchi',
      contexts: ['all'],
    },
    () => {
      if (browser.runtime.lastError) {
        console.error('Error creating main menu:', browser.runtime.lastError);
      } else {
        console.log('Main context menu created successfully.');
      }
    }
  );

  // Feed Pet menu
  browser.menus.create(
    {
      id: 'feed-pet',
      title: 'Feed Pet',
      contexts: ['selection'], // Only show when text/image is selected
    },
    () => {
      if (browser.runtime.lastError) {
        console.error('Error creating feed menu:', browser.runtime.lastError);
      } else {
        console.log('Feed Pet context menu created successfully.');
      }
    }
  );
}

function handleMenuClick(info: any, tab: any) {
  console.log('Menu item clicked:', info, tab);
  if (info.menuItemId === 'firefoxy-tamagotchi') {
    browser.tabs.sendMessage(tab.id, {
      type: 'OPEN_TAMAGOTCHI',
      menuItemId: info.menuItemId,
    });
  } else if (info.menuItemId === 'feed-pet') {
    const feedData = {
      type: 'FEED_PET',
      selectedText: info.selectionText || null, // Text if selected
      selectedElement: info.srcUrl || null, // URL if an image is selected
      pageUrl: info.pageUrl,
      tabId: tab.id,
    };
    console.log('Feeding pet with:', feedData);
    browser.tabs.sendMessage(tab.id, feedData);
  }
}

browser.menus.onClicked.addListener(handleMenuClick);
initializeContextMenu();

console.log('Background script loaded.');
