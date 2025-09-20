// Console Attribution System - Displays ownership information
// This system ensures proper attribution is displayed in browser console

const ATTRIBUTION_CONFIG = {
  author: {
    name: 'lancyyboii',
    github: 'github.com/lancyyboii',
    profile: 'https://github.com/lancyyboii'
  },
  project: {
    name: 'Serverless E-commerce Platform',
    license: 'PORTFOLIO-DEMO-2024-E-COMMERCE-PLATFORM',
    originalRepo: 'https://github.com/lancyyboii/serverless-ecommerce'
  },
  messages: {
    banner: `
╔══════════════════════════════════════════════════════════════╗
║                    🚨 ATTRIBUTION NOTICE 🚨                  ║
║                                                              ║
║  Original Author: lancyyboii                                 ║
║  GitHub: github.com/lancyyboii                               ║
║  Project: Serverless E-commerce Platform                     ║
║                                                              ║
║  This code is protected by intellectual property rights.     ║
║  Unauthorized use or redistribution without proper           ║
║  attribution is prohibited.                                  ║
║                                                              ║
║  License: PORTFOLIO-DEMO-2024-E-COMMERCE-PLATFORM           ║
╚══════════════════════════════════════════════════════════════╝
    `,
    warning: '⚠️  This application contains protected intellectual property. Original author: lancyyboii (github.com/lancyyboii)',
    ownership: '© Original code by lancyyboii - https://github.com/lancyyboii',
    detection: '🔍 Unauthorized usage detected. Please respect intellectual property rights.',
    reminder: '📝 Remember to credit the original author when using this code.'
  }
};

class ConsoleAttribution {
  constructor() {
    this.displayed = false;
    this.intervalId = null;
    this.styles = {
      banner: 'color: #ff6b6b; font-weight: bold; font-size: 14px; background: #1a1a1a; padding: 10px; border-radius: 5px;',
      warning: 'color: #ffa500; font-weight: bold; font-size: 12px;',
      info: 'color: #4ecdc4; font-weight: bold; font-size: 11px;',
      error: 'color: #ff4757; font-weight: bold; font-size: 13px; background: #2c2c2c; padding: 5px;'
    };
  }

  init() {
    // Display immediately
    this.displayBanner();
    
    // Set up periodic reminders
    this.setupPeriodicReminders();
    
    // Monitor for console clearing attempts
    this.setupConsoleProtection();
    
    // Display on various events
    this.setupEventListeners();
  }

  displayBanner() {
    if (typeof console === 'undefined') return;
    
    try {
      // Clear console first to make banner more visible
      console.clear();
      
      // Display main banner
      console.log('%c' + ATTRIBUTION_CONFIG.messages.banner, this.styles.banner);
      
      // Display additional info
      console.log('%c' + ATTRIBUTION_CONFIG.messages.warning, this.styles.warning);
      console.log('%c' + ATTRIBUTION_CONFIG.messages.ownership, this.styles.info);
      
      // Add separator
      console.log('%c' + '═'.repeat(60), 'color: #666;');
      
      this.displayed = true;
    } catch (error) {
      // Fallback for restricted environments
      this.displayFallbackAttribution();
    }
  }

  displayFallbackAttribution() {
    try {
      console.log('🚨 ATTRIBUTION NOTICE 🚨');
      console.log('Original Author: lancyyboii');
      console.log('GitHub: github.com/lancyyboii');
      console.log('This code is protected by intellectual property rights.');
    } catch (error) {
      // Silent fail if console is completely blocked
    }
  }

  setupPeriodicReminders() {
    // Display reminder every 5 minutes
    this.intervalId = setInterval(() => {
      this.displayReminder();
    }, 300000); // 5 minutes

    // Display on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => this.displayReminder(), 1000);
      }
    });
  }

  displayReminder() {
    try {
      console.log('%c' + ATTRIBUTION_CONFIG.messages.reminder, this.styles.info);
      console.log('%c' + ATTRIBUTION_CONFIG.messages.ownership, this.styles.warning);
    } catch (error) {
      // Silent fail
    }
  }

  setupConsoleProtection() {
    // Override console.clear to redisplay attribution
    const originalClear = console.clear;
    console.clear = (...args) => {
      originalClear.apply(console, args);
      setTimeout(() => {
        this.displayBanner();
      }, 100);
    };

    // Monitor for developer tools
    let devtools = {
      open: false,
      orientation: null
    };

    const threshold = 160;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.onDevToolsOpen();
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  onDevToolsOpen() {
    setTimeout(() => {
      console.log('%c' + ATTRIBUTION_CONFIG.messages.detection, this.styles.error);
      this.displayBanner();
    }, 1000);
  }

  setupEventListeners() {
    // Display on page load
    window.addEventListener('load', () => {
      setTimeout(() => this.displayReminder(), 2000);
    });

    // Display on focus
    window.addEventListener('focus', () => {
      setTimeout(() => this.displayReminder(), 500);
    });

    // Display on right-click (inspect element)
    document.addEventListener('contextmenu', () => {
      setTimeout(() => this.displayReminder(), 1000);
    });

    // Display on F12 key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        setTimeout(() => {
          this.displayBanner();
        }, 1000);
      }
    });
  }

  // Method to be called by other security systems
  triggerAttribution(reason = 'security_check') {
    console.log('%c🔒 Security Check: ' + reason, this.styles.warning);
    this.displayBanner();
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// Create and initialize the attribution system
const consoleAttribution = new ConsoleAttribution();

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      consoleAttribution.init();
    });
  } else {
    consoleAttribution.init();
  }
}

export default consoleAttribution;