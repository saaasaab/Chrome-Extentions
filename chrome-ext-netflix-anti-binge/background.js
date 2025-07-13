// Background script for Netflix Anti-Binge extension

console.log('Background script loaded!');



// Create and inject the lock screen
function injectLockScreen(expiration) {
    const html = `
<style>
.nab-lock-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3rem;
    align-items: center;
    z-index: 999999;
    color: white;
    font-family: 'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.nab-top-text,
.nab-bottom-text {
    font-size: clamp(20px, 4vw, 48px);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.nab-bottom-text #nab-time-left {
    margin: 0;
}

#nab-timer {
    width: 200px;
    height: 200px;
    position: relative;
}

svg {
    width: 100%;
    height: 100%;
}

circle {
    fill: none;
    stroke: #E50914;
    stroke-width: 5px;
}

#nab-progress {
    stroke: #E50914;
    stroke-dasharray: 282.74;
    stroke-dashoffset: 282.74;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 1s linear;
    stroke-width: 11px;
}

#nab-bg-circle {
    fill: none;
    stroke: #E50914;
    stroke-width: 10px;
    opacity: 0.3;
}

#nab-lock-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 50%;
    stroke: none;
    fill: #E50914;
}
</style>

<div class="nab-lock-screen">
    <div class="nab-top-text">Take a break! No more bingeing for now.</div>
    <div class="nab-countdown">
        <div id="nab-timer">
            <svg viewBox="0 0 100 100">
                <circle id="nab-bg-circle" cx="50" cy="50" r="45"></circle>
                <circle id="nab-progress" cx="50" cy="50" r="45"></circle>
            </svg>
            <svg id='nab-lock-icon' width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 21C1.45 21 0.979333 20.8043 0.588 20.413C0.196 20.021 0 19.55 0 19V9C0 8.45 0.196 7.979 0.588 7.587C0.979333 7.19567 1.45 7 2 7H3V5C3 3.61667 3.48767 2.43733 4.463 1.462C5.43767 0.487333 6.61667 0 8 0C9.38333 0 10.5627 0.487333 11.538 1.462C12.5127 2.43733 13 3.61667 13 5V7H14C14.55 7 15.021 7.19567 15.413 7.587C15.8043 7.979 16 8.45 16 9V19C16 19.55 15.8043 20.021 15.413 20.413C15.021 20.8043 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.021 15.8043 9.413 15.413C9.80433 15.021 10 14.55 10 14C10 13.45 9.80433 12.979 9.413 12.587C9.021 12.1957 8.55 12 8 12C7.45 12 6.97933 12.1957 6.588 12.587C6.196 12.979 6 13.45 6 14C6 14.55 6.196 15.021 6.588 15.413C6.97933 15.8043 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z"/>
            </svg>
        </div>
    </div>
    <div class="nab-bottom-text">
        <p id="nab-time-left"></p>
    </div>
</div>`;

// Convert seconds to readable time string
function convertSecondsToTimeString(seconds) {
    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor((seconds - (hours * 60 * 60)) / 60);
    const secs = seconds - (hours * 60 * 60) - (minutes * 60);

    const isPlural = (num) => num > 1 ? "s" : "";
    let timeString = "";
    if (hours > 0) {
        timeString = `${hours} hour${isPlural(hours)} ${minutes} minute${isPlural(minutes)} ${secs} second${isPlural(secs)}`;
    }
    else if (minutes > 0) {
        timeString = `${minutes} minute${isPlural(minutes)} ${secs} second${isPlural(secs)}`;
    }
    else {
        timeString = `${secs} second${isPlural(secs)}`;
    }
    return timeString;
}

    // Wait for video element to appear
    let timesRan = 0;
    const waitInterval = setInterval(() => {
        let video = document.querySelector('video');
        timesRan++;

        if (timesRan > 100) {
            clearInterval(waitInterval);
            return;
        }

        if (video) {
            clearInterval(waitInterval);
            console.log('Video element found, injecting lock screen');
            video.pause();
            video.dataset.nabBlocked = 'true'; // Mark video as blocked
            
            // Remove any existing overlay
            const existingOverlay = document.querySelector('.nab-lock-screen');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            // Add the lock screen
            document.body.insertAdjacentHTML('beforeend', html);

            const progress = document.getElementById("nab-progress");
            const timeLeft = document.getElementById("nab-time-left");

            const now = new Date().getTime();
            const countdownTime = 24 * 60 * 60; // 24 hours in seconds for progress bar

            let currentTime = Math.round((expiration - now) / 1000);

            const updateTimer = setInterval(() => {
                currentTime--;
                timeLeft.innerHTML = convertSecondsToTimeString(currentTime);

                // Calculate progress based on 24-hour period
                const progressPercent = Math.max(0, Math.min(1, currentTime / countdownTime));
                const offset = (1 - progressPercent) * 282.74;
                progress.style.strokeDashoffset = offset;

                if (currentTime <= 0) {
                    clearInterval(updateTimer);
                    timeLeft.innerHTML = "Time's up! You can watch again.";
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }
            }, 1000);
        }
    }, 300);
}

// Check if user has watched this video and should be blocked from next video
async function checkVideoWatchHistory(currentVideoId, nextVideoId) {
    const allStorage = await chrome.storage.local.get();
    const videoKey = `nab-video-${currentVideoId}`;
    const videoData = allStorage[videoKey];

    if (videoData && videoData.__expiration) {
        const now = new Date().getTime();
        if (videoData.__expiration > now) {
            console.log('Video already watched, blocking next video');
            return videoData.__expiration;
        }
    }

    return null;
}

// Store video watch data - store the NEXT video ID with next day expiration
function storeVideoWatch(currentVideoId, nextVideoId) {
    if (!nextVideoId) {
        console.log('No next video ID available, skipping storage');
        return;
    }
    
    // Calculate next day at midnight local time
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight
    
    const expiration = tomorrow.getTime();
    const videoKey = `nab-video-${nextVideoId}`;

    chrome.storage.local.set({
        [videoKey]: {
            videoId: nextVideoId,
            watchedAt: Date.now(),
            __expiration: expiration,
            blockedFrom: currentVideoId
        }
    }, () => {
        console.log('Stored next video block for:', nextVideoId, 'expires:', new Date(expiration));
    });
}

// Main function to handle Netflix video
async function handleNetflixVideo(currentVideoId, nextVideoId, tabId) {
    if (!currentVideoId) return;

    console.log('Processing Netflix video:', { currentVideoId, nextVideoId, tabId });

    // Check if we've already watched this video and should be blocked from next
    const expiration = await checkVideoWatchHistory(currentVideoId, nextVideoId);

    if (expiration) {
        // Block the next video - use the specific tab ID
        await chrome.scripting.executeScript({
            args: [expiration],
            target: { tabId: tabId },
            func: injectLockScreen,
        });
    } else {
        // Store the watch data for current video
        storeVideoWatch(currentVideoId, nextVideoId);
    }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('netflix.com/watch')) {
        console.log('Netflix video page detected');

        // Extract video ID from URL and check if it should be blocked
        const videoId = tab.url.split('/watch/')[1];

        // Check if this video should be blocked
        checkVideoWatchHistory(videoId, null).then(expiration => {
            console.log('Expiration check result:', expiration);
            if (expiration) {
                console.log('Video should be blocked, injecting lock screen');
                chrome.scripting.executeScript({
                    args: [expiration],
                    target: { tabId: tabId },
                    func: injectLockScreen,
                });
            } else {
                // If not blocked, trigger content script to extract video IDs
                console.log('Video not blocked, triggering content script');
                chrome.tabs.sendMessage(tabId, { type: 'PRINT_WINDOW_OBJECT' });
            }
        });
    }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message from content script:', message);
    
    if (message.type === 'WINDOW_OBJECT_DATA') {
        console.log('Content script window object data:', message.data);
    } else if (message.type === 'PAGE_CONTEXT_WINDOW_DATA') {
        console.log('Page context window object data:', message.data);
    } else if (message.type === 'NETFLIX_VIDEO_DATA') {
        // Use the sender's tab ID to ensure we inject into the correct Netflix tab
        console.log('Sender tab ID:', sender);
        handleNetflixVideo(message.currentVideoId, message.nextVideoId, sender.tab.id);
    }
});
