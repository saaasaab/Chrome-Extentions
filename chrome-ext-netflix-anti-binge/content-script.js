// Content script for Netflix Anti-Binge extension

console.log('Content script loaded!');

// Function to inject script file into page context
function injectScriptFile(filename) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(filename);
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log('Received message from background script:', message);
    
    if (message.type === 'PRINT_WINDOW_OBJECT') {
        // console.log('Content script window object:', window);
        // console.log('Content script window object keys:', Object.keys(window));
        
        // Inject script file to access page context window object
        injectScriptFile('netflix-extractor.js');
        
        // Send window object data back to background script
        chrome.runtime.sendMessage({
            type: 'WINDOW_OBJECT_DATA',
            data: {
                keys: Object.keys(window),
                hasNetflix: 'netflix' in window,
                netflixKeys: window.netflix ? Object.keys(window.netflix) : null
            }
        });
    }
});

// Listen for messages from injected script
window.addEventListener('message', (event) => {
    if (event.data.type === 'WINDOW_OBJECT_DATA') {
        // console.log('Received window object data from page context:', event.data.data);
        
        // Forward to background script
        chrome.runtime.sendMessage({
            type: 'PAGE_CONTEXT_WINDOW_DATA',
            data: event.data.data
        });
    } else if (event.data.type === 'NETFLIX_VIDEO_DATA') {
        console.log('Received Netflix video data from page context:', event.data);
        
        // Forward to background script
        chrome.runtime.sendMessage({
            type: 'NETFLIX_VIDEO_DATA',
            currentVideoId: event.data.currentVideoId,
            nextVideoId: event.data.nextVideoId
        });
    }
});
