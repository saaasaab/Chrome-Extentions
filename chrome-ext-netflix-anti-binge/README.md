# Netflix Anti-Binge Extension

A Chrome extension that prevents you from binging Netflix shows by implementing a cooldown timer between episodes.

## How It Works

1. **Video Detection**: The extension monitors Netflix video pages and extracts the current video ID and next video ID using Netflix's internal API.

2. **Watch Tracking**: When you watch a video, the extension stores this information with a 30-minute cooldown period.

3. **Blocking System**: If you try to watch the next video before the cooldown expires, the extension will:
   - Pause the video
   - Display a full-screen overlay with a countdown timer
   - Show how much time is left before you can watch again

4. **Timer Display**: The overlay includes:
   - A circular progress indicator
   - Real-time countdown showing hours, minutes, and seconds
   - Netflix-styled design with the signature red color (#E50914)

## Features

- **Automatic Detection**: Works automatically on Netflix video pages
- **Configurable Timer**: Default 30-minute cooldown (can be modified in the code)
- **Visual Feedback**: Beautiful countdown timer with Netflix branding
- **Popup Interface**: Extension popup shows current status and allows clearing all blocks
- **Persistent Storage**: Blocks persist across browser sessions

## Installation

1. **Download the Extension**:
   - Clone or download this repository
   - Ensure all files are in the same directory

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the folder containing the extension files

3. **Verify Installation**:
   - The extension icon should appear in your Chrome toolbar
   - Click it to see the popup interface

## Usage

1. **Normal Watching**: Watch Netflix videos as usual - the extension will track your viewing
2. **Binge Prevention**: After watching a video, you'll need to wait 30 minutes before watching the next one
3. **Status Check**: Click the extension icon to see if you have any active blocks
4. **Clear Blocks**: Use the "Clear All Blocks" button in the popup to remove all restrictions

## Technical Details

### Video ID Extraction
The extension uses Netflix's internal API to get video information:
```javascript
const currentVideoID = netflix.appContext.state.routeHandler.params.id;
const nextVideoId = netflix.appContext.state.playerApp.getState().postPlay.experienceByVideoId[currentVideoID].items[0].videoId;
```

### Storage
- Uses Chrome's local storage to persist watch history
- Each video gets a unique key: `nab-video-{videoId}`
- Includes expiration timestamps for automatic cleanup

### Files Structure
- `manifest.json`: Extension configuration
- `background.js`: Service worker for background processing
- `content-script.js`: Injected into Netflix pages for video detection
- `popup.html/js`: Extension popup interface
- `netflix.png`: Extension icon

## Customization

### Change Cooldown Time
To modify the cooldown period, edit these values in `background.js` and `content-script.js`:
```javascript
const expiration = Date.now() + (30 * 60 * 1000); // 30 minutes
const countdownTime = 30 * 60; // 30 minutes in seconds
```

### Modify Styling
The overlay styling can be customized in the `blockVideo` function in `content-script.js`.

## Troubleshooting

- **Extension not working**: Make sure you're on a Netflix video page (URL contains `/watch/`)
- **Timer not showing**: Check browser console for any JavaScript errors
- **Blocks not clearing**: Try refreshing the page or restarting Chrome

## Privacy

- The extension only stores video IDs and timestamps locally
- No data is sent to external servers
- All processing happens within your browser

## License

This project is open source and available under the MIT License. 