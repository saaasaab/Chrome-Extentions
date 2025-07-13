// Popup script for Netflix Anti-Binge extension

document.addEventListener('DOMContentLoaded', function() {
    updateStatus();
    
    // Add event listener for clear button
    document.getElementById('clear-blocks').addEventListener('click', clearAllBlocks);
});

// Update the status display
async function updateStatus() {
    const statusText = document.getElementById('status-text');
    const blockedList = document.getElementById('blocked-list');
    
    try {
        const allStorage = await chrome.storage.local.get();
        const now = new Date().getTime();
        
        // Find all blocked videos
        const blockedVideos = [];
        for (const [key, value] of Object.entries(allStorage)) {
            if (key.startsWith('nab-video-') && value.__expiration && value.__expiration > now) {
                const videoId = key.replace('nab-video-', '');
                const timeLeft = Math.round((value.__expiration - now) / 1000);
                blockedVideos.push({
                    videoId: videoId,
                    timeLeft: timeLeft,
                    watchedAt: value.watchedAt
                });
            }
        }
        
        // Update status text
        if (blockedVideos.length === 0) {
            statusText.textContent = 'No videos currently blocked';
        } else {
            statusText.textContent = `${blockedVideos.length} video(s) blocked`;
        }
        
        // Update blocked videos list
        if (blockedVideos.length === 0) {
            blockedList.innerHTML = '<div class="no-blocks">No videos currently blocked</div>';
        } else {
            blockedList.innerHTML = blockedVideos.map(video => `
                <div class="video-item">
                    <div>Video ID: ${video.videoId}</div>
                    <div>Time left: ${formatTime(video.timeLeft)}</div>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Error updating status:', error);
        statusText.textContent = 'Error loading status';
    }
}

// Format time in readable format
function formatTime(seconds) {
    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor((seconds - (hours * 60 * 60)) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Clear all blocked videos
async function clearAllBlocks() {
    try {
        const allStorage = await chrome.storage.local.get();
        const keysToRemove = [];
        
        // Find all nab-video keys
        for (const key of Object.keys(allStorage)) {
            if (key.startsWith('nab-video-')) {
                keysToRemove.push(key);
            }
        }
        
        // Remove all blocked videos
        if (keysToRemove.length > 0) {
            await chrome.storage.local.remove(keysToRemove);
            console.log('Cleared all blocked videos');
        }
        
        // Update the display
        updateStatus();
        
    } catch (error) {
        console.error('Error clearing blocks:', error);
    }
}

