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

// Function to check if video is already blocked
function checkIfVideoBlocked(videoId) {
    // Check if lock screen is already present
    const existingOverlay = document.querySelector('.nab-lock-screen');
    if (existingOverlay) {
        console.log('Lock screen already present, video is blocked');
        return true;
    }
    
    // Check if video is paused by our extension
    const video = document.querySelector('video');
    if (video && video.paused && video.dataset.nabBlocked) {
        console.log('Video already blocked by extension');
        return true;
    }
    
    return false;
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
            
            // Check if video is already blocked
            if (checkIfVideoBlocked(currentVideoID)) {
                console.log('Video is already blocked, skipping data extraction');
                return null;
            }
            
            // Try to get next video ID with polling
            let nextVideoId = null;
            let attempts = 0;
            const maxAttempts = 60; // 60 seconds
            
            const pollForNextVideo = () => {
                attempts++;
                console.log(`Attempt ${attempts}/${maxAttempts} to get next video ID`);
                
                try {
                    const playerState = window.netflix.appContext.state.playerApp.getState();
                    console.log('Player state:', playerState);
                    
                    const videoID = playerState?.postPlay?.experienceByVideoId?.[currentVideoID]?.items?.[0]?.videoId;
                    
                    if (playerState && playerState.postPlay && playerState.postPlay.experienceByVideoId &&
                        playerState.postPlay.experienceByVideoId[currentVideoID] &&
                        playerState.postPlay.experienceByVideoId[currentVideoID].items &&
                        playerState.postPlay.experienceByVideoId[currentVideoID].items[0]) {
                        nextVideoId = playerState.postPlay.experienceByVideoId[currentVideoID].items[0].videoId;
                        console.log('Next video ID found:', nextVideoId);
                        
                        // Send data immediately when found
                        const data = { currentVideoId: currentVideoID, nextVideoId: nextVideoId };
                        console.log('Extracted data:', data);
                        
                        window.postMessage({
                            type: 'NETFLIX_VIDEO_DATA',
                            currentVideoId: currentVideoID,
                            nextVideoId: nextVideoId
                        }, '*');
                        
                        return; // Stop polling
                    } else {
                        console.log('No next video data available yet, retrying...');
                    }
                } catch (e) {
                    console.log('Could not get next video ID:', e);
                }
                
                // Continue polling if we haven't reached max attempts
                if (attempts < maxAttempts) {
                    setTimeout(pollForNextVideo, 1000); // Check every second
                } else {
                    console.log('Max attempts reached, sending data without next video ID');
                    const data = { currentVideoId: currentVideoID, nextVideoId: null };
                    console.log('Extracted data (no next video):', data);
                    
                    window.postMessage({
                        type: 'NETFLIX_VIDEO_DATA',
                        currentVideoId: currentVideoID,
                        nextVideoId: null
                    }, '*');
                }
            };
            
            // Start polling
            pollForNextVideo();
            
            return { currentVideoId: currentVideoID, nextVideoId: null }; // Initial return
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
