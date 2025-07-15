# Listing Comments Chrome Extension

A Chrome extension that adds a floating comment widget to real estate listing pages on Zillow, Redfin, Apartments.com, and LoopNet. Users can leave comments on listings, with support for both authenticated and anonymous posting.

## Features

### 🏠 **Multi-Platform Support**
- **Zillow**: Home listing pages
- **Redfin**: Property pages  
- **Apartments.com**: Apartment listings
- **LoopNet**: Commercial property listings

### 💬 **Comment System**
- **Public Comments**: All comments are visible to anyone using the extension
- **Anonymous Posting**: Users can post as "Anonymous" with visual indicators
- **Authenticated Users**: Logged-in users can post with their name/email
- **Character Limits**: 500 character limit with real-time counting
- **Helpful Voting**: Users can mark comments as helpful
- **Comment Reporting**: Flag inappropriate comments

### 🎨 **Modern UI**
- **Floating Widget**: Bottom-right corner placement (Loom-style)
- **Resizable Panel**: Drag to resize the comment panel
- **Smooth Animations**: Modern CSS transitions and animations
- **Dark Mode Support**: Automatic dark mode detection
- **Responsive Design**: Works on desktop and mobile

### ⚙️ **User Settings**
- Enable/disable widget on listing pages
- Toggle anonymous comment warnings
- Auto-expand widget on page load
- User activity statistics

## Installation

### Development Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saaasaab/chrome-ext-listing-comments.git
   cd chrome-ext-listing-comments
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the extension directory

3. **Test the Extension**
   - Visit any listing page on Zillow, Redfin, Apartments.com, or LoopNet
   - Look for the floating comment button in the bottom-right corner
   - Click to expand the comment widget

### Production Installation

1. **Build the Extension**
   ```bash
   # Install dependencies
   yarn install
   
   # Build the extension
   yarn build
   ```

2. **Load the Built Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the extension directory (the root folder, not dist/)

3. **Install from Chrome Web Store**
   - TODO: Publish to Chrome Web Store
   - Link will be provided once published

## File Structure

```
chrome-ext-listing-comments/
├── manifest.json              # Extension configuration
├── src/
│   ├── contentScript.js       # Injects widget into listing pages
│   ├── background.js          # Service worker for extension logic
│   ├── popup/
│   │   ├── popup.html         # Extension popup UI
│   │   ├── popup.js           # Popup functionality
│   │   └── popup.css          # Popup styles
│   └── widget/
│       ├── widget.html        # Widget content HTML
│       ├── widget.js          # Widget functionality
│       └── widget.css         # Widget styles
├── lib/
│   ├── supabase.js            # Supabase client (TODO)
│   └── utils.js               # Utility functions (TODO)
├── assets/
│   └── icons/                 # Extension icons (TODO)
└── README.md
```

## Development

### Prerequisites
- Chrome browser
- Basic knowledge of JavaScript, HTML, and CSS
- Supabase account (for backend integration)

### Local Development

1. **Development Workflow**
   ```bash
   # Start development mode (auto-rebuild on changes)
   yarn dev
   
   # Or build manually
   yarn build
   ```

2. **Make Changes**
   - Edit files in the `src/` directory
   - Run `yarn build` to rebuild the extension
   - The extension will auto-reload when you refresh the page

3. **Test Changes**
   - Go to `chrome://extensions/`
   - Click the refresh icon on your extension
   - Visit a listing page to test

4. **Debug**
   - Open Chrome DevTools
   - Check the Console tab for extension logs
   - Use the Sources tab to debug content scripts

### Build System

This extension uses **Vite** to bundle dependencies and modern JavaScript:

- **Dependencies**: `@supabase/supabase-js` and other npm packages are bundled into the final JavaScript files
- **ES Modules**: All code uses modern ES6+ import/export syntax
- **Bundling**: Vite automatically bundles all dependencies into `dist/` directory
- **File Structure**: Built files are organized in `dist/` while source files remain in `src/`

**Build Commands:**
- `yarn build` - Build for production
- `yarn dev` - Build in watch mode (auto-rebuild on changes)
- `yarn build:extension` - Alternative build script

### Adding New Features

1. **New Site Support**
   - Add URL pattern to `contentScript.js` in `isListingPage()`
   - Update `manifest.json` host permissions
   - Test on the new site

2. **UI Changes**
   - Modify `src/widget/widget.css` for widget styles
   - Update `src/popup/popup.css` for popup styles
   - Test in both light and dark modes

3. **Backend Integration**
   - Set up Supabase project
   - Configure `lib/supabase.js`
   - Update authentication and data storage

## Configuration

### Supabase Setup (TODO)

1. **Create Supabase Project**
   ```bash
   # TODO: Add Supabase setup instructions
   ```

2. **Database Schema**
   ```sql
   -- TODO: Add database schema
   ```

3. **Environment Variables**
   ```javascript
   // TODO: Add environment configuration
   ```

### Extension Settings

The extension stores settings in Chrome's sync storage:

- `enabled`: Enable/disable widget on listing pages
- `showAnonymousWarning`: Show warnings for anonymous comments
- `autoExpand`: Auto-expand widget on page load

## API Reference

### Content Script API

```javascript
// Toggle widget visibility
chrome.runtime.sendMessage({ type: 'TOGGLE_WIDGET' });

// Get current settings
chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
  console.log(response);
});
```

### Widget Events

```javascript
// Listen for settings changes
window.addEventListener('message', (event) => {
  if (event.data.type === 'SETTINGS_CHANGED') {
    // Handle settings update
  }
});
```

### Backend API Endpoints

#### POST /api/comments
- **URL:** `https://www.zillowcommments.com/api/comments`
- **Method:** `POST`
- **Description:** Submit a new comment for a listing. Used by the widget when a user posts a comment.
- **Request Body:**
  ```json
  {
    "text": "string",           // The comment text
    "author": "string",        // Username or 'Anonymous'
    "authorId": "string|null", // User ID or null for anonymous
    "isAnonymous": true,        // Boolean
    "timestamp": "ISO string", // When the comment was posted
    "listingId": "string",     // Unique listing identifier
    "url": "string"            // Listing page URL
  }
  ```
- **Response:**
  ```json
  {
    "id": "string",           // Unique comment ID (generated by backend)
    // ...other fields as returned by the API
  }
  ```

#### POST /api/helpful
- **URL:** `https://www.zillowcommments.com/api/helpful`
- **Method:** `POST`
- **Description:** Add or remove a helpful vote for a comment. Used when a user toggles the helpful button on a comment.
- **Request Body:**
  ```json
  {
    "commentId": "string", // The comment's unique ID
    "add": true             // true to add a vote, false to remove
  }
  ```
- **Response:**
  ```json
  {
    "success": true
  }
  ```

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Development Guidelines

- Follow existing code style and patterns
- Add comments for complex logic
- Test on multiple listing sites
- Ensure dark mode compatibility
- Update documentation for new features

## Roadmap

### Phase 1: Core Features ✅
- [x] Basic widget injection
- [x] Comment form and display
- [x] Anonymous posting
- [x] Settings popup
- [x] Multi-site support

### Phase 2: Authentication 🔄
- [ ] Supabase integration
- [ ] User authentication
- [ ] User profiles
- [ ] Comment attribution

### Phase 3: Advanced Features 📋
- [ ] Comment moderation
- [ ] Rich text formatting
- [ ] Image attachments
- [ ] Comment notifications
- [ ] Export functionality

### Phase 4: Social Features 📋
- [ ] User following
- [ ] Comment replies
- [ ] Comment sharing
- [ ] Community features

## Troubleshooting

### Common Issues

1. **Widget not appearing**
   - Check if you're on a supported listing page
   - Verify extension is enabled in Chrome
   - Check console for errors

2. **Comments not saving**
   - Supabase integration not yet implemented
   - Comments are currently stored locally

3. **Styling issues**
   - Check if site CSS is conflicting
   - Verify dark mode detection
   - Test on different screen sizes

### Debug Mode

Enable debug logging by setting `debug: true` in the extension settings.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/your-username/chrome-ext-listing-comments/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/chrome-ext-listing-comments/discussions)
- **Email**: your-email@example.com

## Acknowledgments

- Inspired by Loom's floating widget design
- Built with modern web technologies
- Community feedback and contributions welcome 