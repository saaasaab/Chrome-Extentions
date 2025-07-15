// Listing Comments Content Script
// Detects listing pages and injects the comment widget

class ListingCommentsWidget {
  constructor() {
    this.isExpanded = false;
    this.widget = null;
    this.button = null;
    this.panel = null;
    this.isResizing = false;
    this.initialX = 0;
    this.initialY = 0;
    this.initialWidth = 0;
    this.initialHeight = 0;
    
    this.init();
  }

  init() {
    // Check if current page is a listing page
    if (this.isListingPage()) {
      this.createWidget();
      this.loadWidgetContent();
    }
  }

  isListingPage() {
    const url = window.location.href;
    const patterns = {
      'zillow.com': /zillow\.com\/homedetails\//,
      'redfin.com': /redfin\.com\/house\//,
      'apartments.com': /apartments\.com\/.*\/.*\/.*\/.*\/.*/,
      'loopnet.com': /loopnet\.com\/Listing\/.*/
    };

    return Object.values(patterns).some(pattern => pattern.test(url));
  }

  createWidget() {
    // Create floating button
    this.button = document.createElement('div');
    this.button.id = 'listing-comments-button';
    this.button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    this.button.title = 'Listing Comments';

    // Create expandable panel
    this.panel = document.createElement('div');
    this.panel.id = 'listing-comments-panel';
    this.panel.innerHTML = `
      <div class="widget-header">
        <h3>Listing Comments</h3>
        <button class="close-btn" id="close-widget">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="widget-content" id="widget-content">
        <div class="loading">Loading comments...</div>
      </div>
      <div class="widget-resize-handle"></div>
    `;

    // Create main widget container
    this.widget = document.createElement('div');
    this.widget.id = 'listing-comments-widget';
    this.widget.appendChild(this.button);
    this.widget.appendChild(this.panel);

    // Add to page
    document.body.appendChild(this.widget);

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    // Button click to expand
    this.button.addEventListener('click', () => {
      this.expandWidget();
    });

    // Close button
    document.getElementById('close-widget').addEventListener('click', () => {
      this.collapseWidget();
    });

    // Resize handle
    const resizeHandle = this.panel.querySelector('.widget-resize-handle');
    resizeHandle.addEventListener('mousedown', (e) => {
      this.startResize(e);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isExpanded) {
        this.collapseWidget();
      }
    });

    // Prevent clicks inside panel from bubbling
    this.panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  expandWidget() {
    this.isExpanded = true;
    this.widget.classList.add('expanded');
    this.button.style.display = 'none';
    this.panel.style.display = 'block';
    
    // Focus on the panel for accessibility
    this.panel.focus();
  }

  collapseWidget() {
    this.isExpanded = false;
    this.widget.classList.remove('expanded');
    this.button.style.display = 'flex';
    this.panel.style.display = 'none';
  }

  startResize(e) {
    e.preventDefault();
    this.isResizing = true;
    
    this.initialX = e.clientX;
    this.initialY = e.clientY;
    this.initialWidth = this.panel.offsetWidth;
    this.initialHeight = this.panel.offsetHeight;

    document.addEventListener('mousemove', this.handleResize.bind(this));
    document.addEventListener('mouseup', this.stopResize.bind(this));
  }

  handleResize(e) {
    if (!this.isResizing) return;

    const deltaX = e.clientX - this.initialX;
    const deltaY = e.clientY - this.initialY;

    const newWidth = Math.max(300, this.initialWidth + deltaX);
    const newHeight = Math.max(400, this.initialHeight + deltaY);

    this.panel.style.width = `${newWidth}px`;
    this.panel.style.height = `${newHeight}px`;
  }

  stopResize() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.handleResize.bind(this));
    document.removeEventListener('mouseup', this.stopResize.bind(this));
  }

  async loadWidgetContent() {
    try {
      // Load the widget HTML content
      const response = await fetch(chrome.runtime.getURL('dist/widget/widget.html'));
      const html = await response.text();
      
      const contentDiv = document.getElementById('widget-content');
      contentDiv.innerHTML = html;
      
      // Load and execute widget JavaScript as a module
      const script = document.createElement('script');
      script.type = 'module';
      script.src = chrome.runtime.getURL('dist/widget.js');
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('Failed to load widget content:', error);
      const contentDiv = document.getElementById('widget-content');
      contentDiv.innerHTML = '<div class="error">Failed to load comments widget</div>';
    }
  }
}

// Initialize the widget when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ListingCommentsWidget();
  });
} else {
  new ListingCommentsWidget();
} 