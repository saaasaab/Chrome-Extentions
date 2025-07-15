// Listing Comments Widget JavaScript
// Handles widget functionality and interactions

import { supabase } from '../../lib/supabase.js';

class CommentsWidget {
  constructor() {
    this.currentUser = null;
    this.isAnonymous = false;
    this.comments = [];
    this.currentListingId = this.getListingId();
    this.reportingCommentId = null;
    this.currentSort = 'newest'; // Track current sort
    this.reactionTallies = {
      '👍': 0,
      '💸': 0,
      '⚠️': 0,
      '🏘️': 0,
      '🔧': 0,
      '❤️': 0
    };
    this.reactionMap = {
      'Good deal! 👍': '👍',
      'Not priced right 💸': '💸',
      'Listing is misleading ⚠️': '⚠️',
      'Great location! 🏘️': '🏘️',
      'Needs work 🔧': '🔧',
      'Perfect for me! ❤️': '❤️'
    };
    
    this.init();
  }

  init() {
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      this.setupEventListeners();
      this.loadComments();
      this.checkAuthStatus();
    }, 100);
  }



  getListingId() {
    // Extract listing ID from current URL
    const url = window.location.href;
    
    // Zillow: https://www.zillow.com/homedetails/123-Main-St/12345678_zpid/
    const zillowMatch = url.match(/zillow\.com\/homedetails\/.*?\/(\d+)_zpid/);
    if (zillowMatch) return `zillow_${zillowMatch[1]}`;
    
    // Redfin: https://www.redfin.com/house/12345678
    const redfinMatch = url.match(/redfin\.com\/house\/(\d+)/);
    if (redfinMatch) return `redfin_${redfinMatch[1]}`;
    
    // Apartments.com: https://www.apartments.com/listing-name/123456
    const apartmentsMatch = url.match(/apartments\.com\/.*?\/(\d+)/);
    if (apartmentsMatch) return `apartments_${apartmentsMatch[1]}`;
    
    // LoopNet: https://www.loopnet.com/Listing/123-Main-St/12345678/
    const loopnetMatch = url.match(/loopnet\.com\/Listing\/.*?\/(\d+)/);
    if (loopnetMatch) return `loopnet_${loopnetMatch[1]}`;
    
    // Fallback: use URL hash
    return `generic_${btoa(url).slice(0, 16)}`;
  }

  setupEventListeners() {
    // Comment form interactions
    const commentText = document.getElementById('comment-text');
    const charCount = document.getElementById('char-count');
    const submitBtn = document.getElementById('submit-btn');
    const anonymousToggle = document.getElementById('anonymous-toggle');

    // Character counting
    commentText.addEventListener('input', (e) => {
      const length = e.target.value.length;
      charCount.textContent = `${length}/500`;
      
      // Enable/disable submit button
      submitBtn.disabled = length === 0 || length > 500;
      
      // Update character count color
      if (length > 450) {
        charCount.style.color = '#e74c3c';
      } else if (length > 400) {
        charCount.style.color = '#f39c12';
      } else {
        charCount.style.color = '#666';
      }
    });

    // Submit comment
    submitBtn.addEventListener('click', () => {
      this.submitComment();
    });

    // Anonymous toggle
    anonymousToggle.addEventListener('change', (e) => {
      this.isAnonymous = e.target.checked;
      this.updateAnonymousState();
    });

    // Quick reaction buttons (now inside pullout)
    const reactionButtons = document.querySelectorAll('.reaction-btn');
    reactionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const reactionLabel = e.currentTarget.dataset.reaction;
        const emoji = this.reactionMap[reactionLabel];
        this.incrementReactionTally(emoji);
        this.closeQuickReactions();
      });
    });

    // Quick reactions pullout toggle
    const quickReactionsToggle = document.getElementById('quick-reactions-toggle');
    const quickReactionsPullout = document.getElementById('quick-reactions-pullout');
    if (quickReactionsToggle && quickReactionsPullout) {
      quickReactionsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        quickReactionsPullout.classList.toggle('open');
      });
      // Close pullout when clicking outside
      document.addEventListener('click', (e) => {
        if (!quickReactionsPullout.contains(e.target) && e.target !== quickReactionsToggle) {
          quickReactionsPullout.classList.remove('open');
        }
      });
    }

    // Sort comments
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.sortComments(this.currentSort);
    });

    // Auth buttons
    const signInBtn = document.getElementById('sign-in-btn');
    const signOutBtn = document.getElementById('sign-out-btn');
    
    if (signInBtn) {
      signInBtn.addEventListener('click', () => {
        this.signIn();
      });
    }
    
    if (signOutBtn) {
      signOutBtn.addEventListener('click', () => {
        this.signOut();
      });
    }

    // Report modal
    const reportModal = document.getElementById('report-modal');
    const closeReportModal = document.getElementById('close-report-modal');
    const cancelReport = document.getElementById('cancel-report');
    const submitReport = document.getElementById('submit-report');
    const reportDetails = document.getElementById('report-details');

    if (closeReportModal) {
      closeReportModal.addEventListener('click', () => {
        this.closeReportModal();
      });
    }

    if (cancelReport) {
      cancelReport.addEventListener('click', () => {
        this.closeReportModal();
      });
    }

    if (submitReport) {
      submitReport.addEventListener('click', () => {
        this.submitReport();
      });
    }

    // Report reason selection
    const reportReasons = document.querySelectorAll('input[name="report-reason"]');
    reportReasons.forEach(radio => {
      radio.addEventListener('change', () => {
        submitReport.disabled = false;
      });
    });

    // Report details character count
    if (reportDetails) {
      reportDetails.addEventListener('input', (e) => {
        const length = e.target.value.length;
        if (length > 200) {
          e.target.value = e.target.value.slice(0, 200);
        }
      });
    }

    // Enter key to submit
    commentText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.submitComment();
      }
    });

    // Close modal on outside click
    if (reportModal) {
      reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) {
          this.closeReportModal();
        }
      });
    }
  }

  updateAnonymousState() {
    const anonymousToggle = document.getElementById('anonymous-toggle');
    const commentText = document.getElementById('comment-text');
    
    if (this.isAnonymous) {
      commentText.placeholder = "Share your thoughts about this listing... (Anonymous)";
      // Add visual indicator
      commentText.style.borderColor = '#f39c12';
    } else {
      commentText.placeholder = "Share your thoughts about this listing...";
      commentText.style.borderColor = '';
    }
  }

  incrementReactionTally(emoji) {
    // Prevent multiple increments per user per session
    const key = `reaction_${this.currentListingId}_${emoji}`;
    if (sessionStorage.getItem(key)) {
      this.showFeedback('You already reacted with this emoji!', 'info');
      return;
    }
    this.reactionTallies[emoji] = (this.reactionTallies[emoji] || 0) + 1;
    sessionStorage.setItem(key, '1');
    this.renderReactionTallies();
  }

  renderReactionTallies() {
    const tallyBar = document.getElementById('quick-reactions-tally');
    const tallies = this.reactionTallies;
    const hasTallies = Object.values(tallies).some(count => count > 0);
    if (!tallyBar) return;
    if (!hasTallies) {
      tallyBar.style.display = 'none';
      tallyBar.innerHTML = '';
      return;
    }
    tallyBar.style.display = 'flex';
    tallyBar.innerHTML = Object.entries(tallies)
      .filter(([emoji, count]) => count > 0)
      .map(([emoji, count]) =>
        `<span class="quick-reaction-tally-item"><span class="quick-reaction-tally-emoji">${emoji}</span><span class="quick-reaction-tally-count">${count}</span></span>`
      ).join('');
  }

  async submitComment() {
    const commentText = document.getElementById('comment-text');
    const text = commentText.value.trim();
    
    if (!text) return;

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting...';
      
      const comment = {
        text: text,
        author: this.isAnonymous ? 'Anonymous' : (this.currentUser?.name || 'Anonymous'),
        authorId: this.isAnonymous ? null : this.currentUser?.id,
        isAnonymous: this.isAnonymous,
        timestamp: new Date().toISOString(),
        listingId: this.currentListingId,
        url: window.location.href
      };

      // Send to Supabase API
      const response = await fetch('https://www.zillowcommments.com/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
      });
      if (!response.ok) throw new Error('Failed to post comment');
      const savedComment = await response.json();
      // Add the comment to the list (use returned id if present)
      this.comments.unshift({
        ...comment,
        id: savedComment.id || Date.now().toString(),
        helpfulCount: 0
      });
      this.sortComments(this.currentSort); // Always sort after adding
      
      // Clear form
      commentText.value = '';
      document.getElementById('char-count').textContent = '0/500';
      submitBtn.disabled = true;
      
      // Reset anonymous toggle
      document.getElementById('anonymous-toggle').checked = false;
      this.isAnonymous = false;
      this.updateAnonymousState();
      
      // Show success feedback
      this.showFeedback('Comment posted!', 'success');
      
    } catch (error) {
      console.error('Failed to submit comment:', error);
      this.showFeedback('Failed to post comment', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  async loadComments() {
    const loadingEl = document.getElementById('comment-loading');
    const noCommentsEl = document.getElementById('no-comments');
    const commentsContainer = document.getElementById('comments-container');
    


    try {
      loadingEl.style.display = 'flex';
      noCommentsEl.style.display = 'none';
      
      // TODO: Load comments from Supabase
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.comments = [
        {
          id: '1',
          text: 'Great location! The neighborhood seems really nice and the schools are highly rated.',
          author: 'Sarah M.',
          authorId: 'user1',
          isAnonymous: false,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          helpfulCount: 3,
          listingId: this.currentListingId
        },
        {
          id: '2',
          text: 'The price seems a bit high for the square footage, but the finishes are nice.',
          author: 'Anonymous',
          authorId: null,
          isAnonymous: true,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          helpfulCount: 1,
          listingId: this.currentListingId
        },
        {
          id: '3',
          text: 'Good deal! 👍',
          author: 'Mike R.',
          authorId: 'user3',
          isAnonymous: false,
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          helpfulCount: 2,
          listingId: this.currentListingId,
          isQuickReaction: true
        }
      ];
    //   this.sortComments(this.currentSort); // Always sort after loading
      
      this.renderComments();
      this.renderReactionTallies(); // Render tallies after loading
      
    } catch (error) {
      console.error('Failed to load comments:', error);
      commentsContainer.innerHTML = '<div class="error">Failed to load comments</div>';
    } finally {
      loadingEl.style.display = 'none';
    }
  }

  renderComments() {
    const commentsContainer = document.getElementById('comments-container');
    const noCommentsEl = document.getElementById('no-comments');
    

    if(!noCommentsEl || !commentsContainer) {
        return;
    }

    if (this.comments.length === 0) {
      noCommentsEl.style.display = 'block';
      return;
    }
    
    noCommentsEl.style.display = 'none';
    
    const template = document.getElementById('comment-template');
    commentsContainer.innerHTML = '';
    
    this.comments.forEach(comment => {
      const commentEl = template.content.cloneNode(true);
      
      // Fill in comment data
      commentEl.querySelector('.author-name').textContent = comment.author;
      commentEl.querySelector('.comment-date').textContent = this.formatDate(comment.timestamp);
      commentEl.querySelector('.comment-content').textContent = comment.text;
      commentEl.querySelector('.helpful-count').textContent = comment.helpfulCount;
      
      // Add anonymous badge if needed
      if (comment.isAnonymous) {
        const authorName = commentEl.querySelector('.author-name');
        authorName.innerHTML += ' <span class="anonymous-badge-small">Anonymous</span>';
      }
      
      // Add quick reaction styling if it's a quick reaction
      if (comment.isQuickReaction) {
        const commentContent = commentEl.querySelector('.comment-content');
        commentContent.style.fontWeight = '600';
        commentContent.style.color = '#667eea';
      }
      
      // Add helpful button functionality
      const helpfulBtn = commentEl.querySelector('.helpful-btn');
      helpfulBtn.addEventListener('click', () => {
        this.toggleHelpful(comment.id);
      });
      
      // Add report functionality
      const reportBtn = commentEl.querySelector('.report-btn');
      const reportLink = commentEl.querySelector('.report-link');
      
      reportBtn.addEventListener('click', () => {
        this.openReportModal(comment.id);
      });
      
      reportLink.addEventListener('click', () => {
        this.openReportModal(comment.id);
      });
      
      commentsContainer.appendChild(commentEl);
    });
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }

  sortComments(sortBy) {
    this.currentSort = sortBy;
    switch (sortBy) {
      case 'newest':
        this.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'oldest':
        this.comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'helpful':
        this.comments.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
    }
    
    this.renderComments();
  }

  toggleHelpful(commentId) {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;
    const key = `helpful_${commentId}`;
    const alreadyVoted = sessionStorage.getItem(key) === '1';
    // Optimistically update UI
    if (alreadyVoted) {
      comment.helpfulCount = Math.max(0, (comment.helpfulCount || 0) - 1);
      sessionStorage.removeItem(key);
      this.showFeedback('Removed helpful vote', 'info');
    } else {
      comment.helpfulCount = (comment.helpfulCount || 0) + 1;
      sessionStorage.setItem(key, '1');
      this.showFeedback('Marked as helpful!', 'success');
    }
    this.renderComments();
    // Send API request
    fetch('https://www.zillowcommments.com/api/helpful', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId, add: !alreadyVoted })
    }).catch(() => {});
  }

  openReportModal(commentId) {
    this.reportingCommentId = commentId;
    const reportModal = document.getElementById('report-modal');
    const submitReport = document.getElementById('submit-report');
    const reportDetails = document.getElementById('report-details');
    
    // Reset form
    document.querySelectorAll('input[name="report-reason"]').forEach(radio => {
      radio.checked = false;
    });
    if (reportDetails) reportDetails.value = '';
    submitReport.disabled = true;
    
    // Show modal
    reportModal.style.display = 'flex';
  }

  closeReportModal() {
    const reportModal = document.getElementById('report-modal');
    reportModal.style.display = 'none';
    this.reportingCommentId = null;
  }

  async submitReport() {
    const selectedReason = document.querySelector('input[name="report-reason"]:checked');
    const reportDetails = document.getElementById('report-details');
    
    if (!selectedReason) {
      this.showFeedback('Please select a reason', 'error');
      return;
    }
    
    try {
      const report = {
        commentId: this.reportingCommentId,
        reason: selectedReason.value,
        details: reportDetails.value.trim(),
        reporterId: this.currentUser?.id || null,
        timestamp: new Date().toISOString()
      };
      
      // TODO: Send report to Supabase
      console.log('Submitting report:', report);
      
      this.closeReportModal();
      this.showFeedback('Report submitted successfully', 'success');
      
    } catch (error) {
      console.error('Failed to submit report:', error);
      this.showFeedback('Failed to submit report', 'error');
    }
  }

  showFeedback(message, type = 'info') {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-size: 14px;
      z-index: 1000001;
      animation: slideInRight 0.3s ease;
      ${type === 'success' ? 'background: #27ae60;' : ''}
      ${type === 'error' ? 'background: #e74c3c;' : ''}
      ${type === 'info' ? 'background: #3498db;' : ''}
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
      feedback.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 300);
    }, 3000);
  }

  checkAuthStatus() {
    try {
      // Check if supabase is properly initialized
      if (!supabase || !supabase.auth) {
        console.warn('Supabase client not properly initialized');
        this.showAnonymousState();
        return;
      }

      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          this.showUserState({
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
            email: user.email,
            id: user.id
          });
        } else {
          this.showAnonymousState();
        }
      }).catch(error => {
        console.error('Error getting user:', error);
        this.showAnonymousState();
      });

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          this.showUserState({
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email,
            email: session.user.email,
            id: session.user.id
          });
        } else {
          this.showAnonymousState();
        }
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.showAnonymousState();
    }
  }

  showAnonymousState() {
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('anonymous-user').style.display = 'flex';
  }

  showUserState(user) {
    this.currentUser = user;
    document.getElementById('user-name').textContent = user.name || user.email;
    document.getElementById('user-email').textContent = user.email || '';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('anonymous-user').style.display = 'none';
  }

  async signIn() {
    try {
      // Check if supabase is properly initialized
      if (!supabase || !supabase.auth) {
        throw new Error('Supabase client not properly initialized');
      }

      // Use Supabase OAuth (Google as example)
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
      // Supabase will redirect, so no need to do more here
    } catch (error) {
      console.error('Sign in failed:', error);
      this.showFeedback('Sign in failed', 'error');
    }
  }

  async signOut() {
    try {
      // Check if supabase is properly initialized
      if (!supabase || !supabase.auth) {
        throw new Error('Supabase client not properly initialized');
      }

      await supabase.auth.signOut();
      this.currentUser = null;
      this.showAnonymousState();
      this.showFeedback('Signed out successfully', 'success');
    } catch (error) {
      console.error('Sign out failed:', error);
      this.showFeedback('Sign out failed', 'error');
    }
  }

  closeQuickReactions() {
    const quickReactionsPullout = document.getElementById('quick-reactions-pullout');
    if (quickReactionsPullout) quickReactionsPullout.classList.remove('open');
  }
}

// Add CSS animations for feedback
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize the widget when the script loads
document.addEventListener('DOMContentLoaded', () => {
  new CommentsWidget();
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
  new CommentsWidget();
} 