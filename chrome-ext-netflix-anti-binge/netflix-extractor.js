// Netflix extractor script - runs in page context
console.log('=== PAGE CONTEXT WINDOW OBJECT ===');
console.log('Window object:', window);
console.log('Window object keys:', Object.keys(window));
console.log('Has netflix property:', 'netflix' in window);

if (window.netflix) {
    console.log('Netflix object:', window.netflix);
    console.log('Netflix object keys:', Object.keys(window.netflix));
} else {
    console.log('Netflix object not found in window');
}

// Function to extract video IDs from Netflix
function extractNetflixVideoData() {
    try {
        console.log('Accessing Netflix API from page context...');
        
        if (window.netflix && window.netflix.appContext && window.netflix.appContext.state) {
            console.log('Netflix app context found');
            
            const currentVideoID = window.netflix.appContext.state.routeHandler.params.id;
            console.log('Current video ID:', currentVideoID);
            
            if (!currentVideoID) {
                console.log('No current video ID found yet');
                return null;
            }
            
            // Try to get next video ID
            let nextVideoId = null;
            try {
                const playerState = window.netflix.appContext.state.playerApp.getState();
                console.log('Player state:', playerState);
                
                if (playerState && playerState.postPlay && playerState.postPlay.experienceByVideoId && 
                    playerState.postPlay.experienceByVideoId[currentVideoID] && 
                    playerState.postPlay.experienceByVideoId[currentVideoID].items && 
                    playerState.postPlay.experienceByVideoId[currentVideoID].items[0]) {
                    nextVideoId = playerState.postPlay.experienceByVideoId[currentVideoID].items[0].videoId;
                    console.log('Next video ID found:', nextVideoId);
                } else {
                    console.log('No next video data available');
                }
            } catch (e) {
                console.log('Could not get next video ID:', e);
            }
            
            const data = { currentVideoId: currentVideoID, nextVideoId: nextVideoId };
            console.log('Extracted data:', data);
            
            // Send data to content script
            window.postMessage({
                type: 'NETFLIX_VIDEO_DATA',
                currentVideoId: currentVideoID,
                nextVideoId: nextVideoId
            }, '*');
            
            return data;
        } else {
            console.log('Netflix app context not available yet');
            console.log('window.netflix:', window.netflix);
            console.log('window.netflix.appContext:', window.netflix?.appContext);
            return null;
        }
    } catch (e) {
        console.log('Error extracting Netflix data:', e);
        return null;
    }
}

// Send initial window object data
window.postMessage({
    type: 'WINDOW_OBJECT_DATA',
    data: {
        keys: Object.keys(window),
        hasNetflix: 'netflix' in window,
        netflixKeys: window.netflix ? Object.keys(window.netflix) : null
    }
}, '*');

// Try to extract video data immediately
extractNetflixVideoData();

// Also try again after a delay in case Netflix API isn't ready yet
setTimeout(extractNetflixVideoData, 2000);
setTimeout(extractNetflixVideoData, 5000); 