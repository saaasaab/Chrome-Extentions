// Popup JavaScript
// Handles popup functionality and settings

class PopupManager {
  constructor() {
    this.settings = {};
    this.user = null;
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadUserData();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'enabled',
        'showAnonymousWarning',
        'autoExpand'
      ]);
      
      this.settings = {
        enabled: result.enabled !== undefined ? result.enabled : true,
        showAnonymousWarning: result.showAnonymousWarning !== undefined ? result.showAnonymousWarning : true,
        autoExpand: result.autoExpand !== undefined ? result.autoExpand : false
      };
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.settings = {
        enabled: true,
        showAnonymousWarning: true,
        autoExpand: false
      };
    }
  }

  async loadUserData() {
    try {
      // TODO: Load user data from Supabase
      // For now, use mock data
      this.user = null;
    } catch (error) {
      console.error('Failed to load user data:', error);
      this.user = null;
    }
  }

  setupEventListeners() {
    // Settings toggles
    const enabledToggle = document.getElementById('enabled-toggle');
    const anonymousWarningToggle = document.getElementById('anonymous-warning-toggle');
    const autoExpandToggle = document.getElementById('auto-expand-toggle');

    enabledToggle.addEventListener('change', (e) => {
      this.updateSetting('enabled', e.target.checked);
    });

    anonymousWarningToggle.addEventListener('change', (e) => {
      this.updateSetting('showAnonymousWarning', e.target.checked);
    });

    autoExpandToggle.addEventListener('change', (e) => {
      this.updateSetting('autoExpand', e.target.checked);
    });

    // Auth buttons
    const signInBtn = document.getElementById('sign-in-btn');
    const signOutBtn = document.getElementById('sign-out-btn');

    signInBtn.addEventListener('click', () => {
      this.signIn();
    });

    signOutBtn.addEventListener('click', () => {
      this.signOut();
    });

    // Support links
    const feedbackLink = document.getElementById('feedback-link');
    const helpLink = document.getElementById('help-link');

    feedbackLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.openFeedback();
    });

    helpLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.openHelp();
    });
  }

  updateUI() {
    // Update settings toggles
    document.getElementById('enabled-toggle').checked = this.settings.enabled;
    document.getElementById('anonymous-warning-toggle').checked = this.settings.showAnonymousWarning;
    document.getElementById('auto-expand-toggle').checked = this.settings.autoExpand;

    // Update auth section
    if (this.user) {
      this.showUserState();
    } else {
      this.showAnonymousState();
    }

    // Update stats (mock data for now)
    this.updateStats();
  }

  showUserState() {
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('anonymous-user').style.display = 'none';
    
    document.getElementById('user-name').textContent = this.user.name || 'User';
    document.getElementById('user-email').textContent = this.user.email || '';
  }

  showAnonymousState() {
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('anonymous-user').style.display = 'flex';
  }

  updateStats() {
    // TODO: Load real stats from Supabase
    // For now, use mock data
    document.getElementById('comments-count').textContent = '0';
    document.getElementById('helpful-count').textContent = '0';
  }

  async updateSetting(key, value) {
    try {
      this.settings[key] = value;
      await chrome.storage.sync.set({ [key]: value });
      
      // Notify content scripts of setting change
      const tabs = await chrome.tabs.query({
        url: [
          '*://*.zillow.com/*',
          '*://*.redfin.com/*',
          '*://*.apartments.com/*',
          '*://*.loopnet.com/*'
        ]
      });

      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'SETTINGS_CHANGED',
          changes: { [key]: { newValue: value } }
        }).catch(() => {
          // Ignore errors for tabs that don't have content script
        });
      });
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  }

  async signIn() {
    try {
      // TODO: Implement Supabase auth
      console.log('Sign in requested');
      
      // For now, show a placeholder
      alert('Authentication will be implemented with Supabase integration');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  }

  async signOut() {
    try {
      // TODO: Implement Supabase sign out
      this.user = null;
      this.showAnonymousState();
      
      // Notify content scripts
      const tabs = await chrome.tabs.query({
        url: [
          '*://*.zillow.com/*',
          '*://*.redfin.com/*',
          '*://*.apartments.com/*',
          '*://*.loopnet.com/*'
        ]
      });

      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'AUTH_CHANGED',
          user: null
        }).catch(() => {
          // Ignore errors for tabs that don't have content script
        });
      });
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  openFeedback() {
    // TODO: Open feedback form or redirect to feedback page
    chrome.tabs.create({
      url: 'https://github.com/your-repo/listing-comments/issues'
    });
  }

  openHelp() {
    // TODO: Open help documentation
    chrome.tabs.create({
      url: 'https://github.com/your-repo/listing-comments/wiki'
    });
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
}); 