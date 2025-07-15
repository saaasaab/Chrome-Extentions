// Listing Comments Background Script
// Handles extension-level logic and messaging

// Extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Listing Comments extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      enabled: true,
      showAnonymousWarning: true,
      autoExpand: false
    });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'GET_SETTINGS':
      chrome.storage.sync.get(['enabled', 'showAnonymousWarning', 'autoExpand'], (result) => {
        sendResponse(result);
      });
      return true; // Keep message channel open for async response
      
    case 'SAVE_SETTINGS':
      chrome.storage.sync.set(request.settings, () => {
        sendResponse({ success: true });
      });
      return true;
      
    case 'GET_AUTH_STATUS':
      // TODO: Check Supabase auth status
      sendResponse({ isAuthenticated: false, user: null });
      break;
      
    case 'SIGN_IN':
      // TODO: Handle Supabase sign in
      console.log('Sign in requested');
      sendResponse({ success: false, message: 'Authentication not implemented yet' });
      break;
      
    case 'SIGN_OUT':
      // TODO: Handle Supabase sign out
      console.log('Sign out requested');
      sendResponse({ success: true });
      break;
      
    default:
      console.log('Unknown message type:', request.type);
      sendResponse({ error: 'Unknown message type' });
  }
});

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if this is a supported listing page
    const supportedSites = [
      'zillow.com',
      'redfin.com', 
      'apartments.com',
      'loopnet.com'
    ];
    
    const isSupportedSite = supportedSites.some(site => tab.url.includes(site));
    
    if (isSupportedSite) {
      // Content script will be automatically injected via manifest.json
      console.log('Listing page detected:', tab.url);
    }
  }
});

// TODO: Add keyboard shortcuts support in future version
// chrome.commands.onCommand.addListener((command) => {
//   // Handle keyboard shortcuts
// });

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.log('Settings changed:', changes);
    
    // Notify content scripts of setting changes
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && (
          tab.url.includes('zillow.com') ||
          tab.url.includes('redfin.com') ||
          tab.url.includes('apartments.com') ||
          tab.url.includes('loopnet.com')
        )) {
          chrome.tabs.sendMessage(tab.id, { 
            type: 'SETTINGS_CHANGED', 
            changes: changes 
          }).catch(() => {
            // Ignore errors for tabs that don't have content script
          });
        }
      });
    });
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Listing Comments extension started');
});

// Handle extension shutdown
chrome.runtime.onSuspend.addListener(() => {
  console.log('Listing Comments extension suspended');
}); 