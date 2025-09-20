// Security Core - Attribution Protection System
// This file contains hidden security measures for intellectual property protection

import githubIntegration from './githubIntegration';
import consoleAttribution from './consoleAttribution';
import hiddenIdentifiers from './hiddenIdentifiers';
import securityTester from './securityTester';

const SECURITY_CONFIG = {
  author: {
    name: 'Lance Cabanit',
    github: 'lancyyboii',
    githubUrl: 'https://github.com/lancyyboii',
    portfolio: 'lanceport-fullstack.onrender.com',
    email: 'cabanitlance43@gmail.com'
  },
  project: {
    name: 'Serverless E-commerce Platform',
    version: '1.0.0',
    license: 'PORTFOLIO-DEMO-2024-E-COMMERCE-PLATFORM',
    created: '2024-12-01'
  },
  security: {
    fingerprint: 'SEC_LANCE_2024_ECOM_PLATFORM_PROTECTED',
    checksum: 'a7f8d9e2b4c6f1a3e5d7b9c2f4e6a8d0',
    timestamp: Date.now()
  }
};

// Hidden attribution system - executes on load
class SecurityCore {
  constructor() {
    this.initialized = false;
    this.protectionActive = false;
    this.init();
  }

  init() {
    if (this.initialized) return;
    
    // Initialize all security systems
    githubIntegration.init();
    consoleAttribution.init();
    hiddenIdentifiers.init();
    
    // Delayed execution to avoid detection
    setTimeout(() => {
      this.activateProtection();
      this.embedAttribution();
      this.setupMonitoring();
      
      // Initialize security testing after all systems are active
      securityTester.init();
    }, Math.random() * 3000 + 1000);
    
    this.initialized = true;
  }

  activateProtection() {
    // Console attribution banner
    this.displayConsoleBanner();
    
    // DOM attribution markers
    this.embedDOMMarkers();
    
    // Repository detection
    this.detectRepositoryCloning();
    
    // Periodic attribution reminders
    this.setupPeriodicReminders();
    
    this.protectionActive = true;
  }

  displayConsoleBanner() {
    const styles = {
      banner: 'background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px;',
      info: 'background: #f8f9fa; color: #495057; padding: 8px 15px; font-size: 14px; border-left: 4px solid #007bff;',
      warning: 'background: #fff3cd; color: #856404; padding: 8px 15px; font-size: 14px; border-left: 4px solid #ffc107;',
      github: 'background: #24292e; color: #ffffff; padding: 8px 15px; font-size: 14px; font-weight: bold;'
    };

    console.log('%c🛡️ INTELLECTUAL PROPERTY PROTECTION ACTIVE 🛡️', styles.banner);
    console.log('%c📋 Project: ' + SECURITY_CONFIG.project.name, styles.info);
    console.log('%c👨‍💻 Original Author: ' + SECURITY_CONFIG.author.name, styles.info);
    console.log('%c🔗 GitHub: ' + SECURITY_CONFIG.author.githubUrl, styles.github);
    console.log('%c⚖️ License: ' + SECURITY_CONFIG.project.license, styles.info);
    console.log('%c⚠️ WARNING: This code is protected by intellectual property rights', styles.warning);
    console.log('%c📞 Contact: ' + SECURITY_CONFIG.author.email, styles.info);
    
    // Additional security notice
    setTimeout(() => {
      console.log('%c🚨 ANTI-CLONING PROTECTION: If you cloned this repository, please respect the original author\'s rights and provide proper attribution.', 
        'background: #dc3545; color: white; padding: 10px; font-weight: bold;');
    }, 2000);
  }

  embedDOMMarkers() {
    // Hidden attribution in DOM
    const marker = document.createElement('div');
    marker.style.display = 'none';
    marker.setAttribute('data-author', SECURITY_CONFIG.author.name);
    marker.setAttribute('data-github', SECURITY_CONFIG.author.github);
    marker.setAttribute('data-security-fingerprint', SECURITY_CONFIG.security.fingerprint);
    marker.setAttribute('data-license', SECURITY_CONFIG.project.license);
    marker.innerHTML = `<!-- 
      INTELLECTUAL PROPERTY NOTICE
      Original Author: ${SECURITY_CONFIG.author.name}
      GitHub: ${SECURITY_CONFIG.author.githubUrl}
      Project: ${SECURITY_CONFIG.project.name}
      License: ${SECURITY_CONFIG.project.license}
      Security Fingerprint: ${SECURITY_CONFIG.security.fingerprint}
      
      This code is protected by intellectual property rights.
      Unauthorized use, modification, or distribution is prohibited.
      Contact: ${SECURITY_CONFIG.author.email}
    -->`;
    
    document.body.appendChild(marker);

    // Meta tag attribution
    const meta = document.createElement('meta');
    meta.name = 'original-author';
    meta.content = `${SECURITY_CONFIG.author.name} (${SECURITY_CONFIG.author.githubUrl})`;
    document.head.appendChild(meta);
  }

  detectRepositoryCloning() {
    // Check for common cloning indicators
    const indicators = [
      () => window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
      () => document.title.includes('GitHub') || document.title.includes('Repository'),
      () => window.location.href.includes('github.com') || window.location.href.includes('gitlab.com'),
      () => navigator.userAgent.includes('GitHub') || navigator.userAgent.includes('Git')
    ];

    const detectedCloning = indicators.some(check => {
      try { return check(); } catch { return false; }
    });

    if (detectedCloning) {
      this.handleRepositoryCloning();
    }

    // Monitor for URL changes that might indicate repository hosting
    if (typeof window !== 'undefined') {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        setTimeout(() => this.checkForRepositoryHosting(), 100);
        return originalPushState.apply(history, args);
      }.bind(this);
      
      history.replaceState = function(...args) {
        setTimeout(() => this.checkForRepositoryHosting(), 100);
        return originalReplaceState.apply(history, args);
      }.bind(this);
    }
  }

  handleRepositoryCloning() {
    console.log('%c🚨 REPOSITORY CLONING DETECTED 🚨', 
      'background: #dc3545; color: white; padding: 15px; font-size: 18px; font-weight: bold;');
    console.log('%c⚖️ LEGAL NOTICE: This repository appears to be cloned or redistributed.', 
      'background: #ffc107; color: #212529; padding: 10px; font-weight: bold;');
    console.log('%c👨‍💻 Original Author: ' + SECURITY_CONFIG.author.name, 
      'background: #17a2b8; color: white; padding: 8px; font-weight: bold;');
    console.log('%c🔗 Original Repository: ' + SECURITY_CONFIG.author.githubUrl, 
      'background: #28a745; color: white; padding: 8px; font-weight: bold;');
    console.log('%c📧 Please contact the original author for proper licensing: ' + SECURITY_CONFIG.author.email, 
      'background: #6f42c1; color: white; padding: 8px; font-weight: bold;');

    // Display visible attribution banner
    this.showAttributionBanner();
    
    // Attempt to add contributor (if GitHub API is accessible)
    this.attemptContributorAddition();
  }

  showAttributionBanner() {
    const banner = document.createElement('div');
    banner.id = 'attribution-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: bold;
      z-index: 999999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      border-bottom: 3px solid #ffc107;
    `;
    
    banner.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto;">
        🛡️ <strong>INTELLECTUAL PROPERTY NOTICE</strong> 🛡️
        <br>
        Original Author: <strong>${SECURITY_CONFIG.author.name}</strong> | 
        GitHub: <a href="${SECURITY_CONFIG.author.githubUrl}" target="_blank" style="color: #ffc107; text-decoration: none;">${SECURITY_CONFIG.author.github}</a> | 
        Contact: <a href="mailto:${SECURITY_CONFIG.author.email}" style="color: #ffc107; text-decoration: none;">${SECURITY_CONFIG.author.email}</a>
        <br>
        <small>This code is protected by intellectual property rights. Please provide proper attribution.</small>
      </div>
    `;
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Auto-hide after 10 seconds but keep in DOM
    setTimeout(() => {
      if (banner.style) {
        banner.style.transform = 'translateY(-100%)';
        banner.style.transition = 'transform 0.5s ease-in-out';
      }
    }, 10000);
  }

  attemptContributorAddition() {
    // This would require GitHub API access and proper authentication
    // For security reasons, this is a placeholder that logs the attempt
    console.log('%c🔧 CONTRIBUTOR ADDITION ATTEMPT', 
      'background: #fd7e14; color: white; padding: 8px; font-weight: bold;');
    console.log('If this repository is hosted on GitHub, the original author should be added as a contributor.');
    console.log('Repository owner should contact: ' + SECURITY_CONFIG.author.email);
    
    // Store the attempt in localStorage for tracking
    try {
      const attempts = JSON.parse(localStorage.getItem('attribution_attempts') || '[]');
      attempts.push({
        timestamp: new Date().toISOString(),
        url: window.location.href,
        author: SECURITY_CONFIG.author.name,
        github: SECURITY_CONFIG.author.github
      });
      localStorage.setItem('attribution_attempts', JSON.stringify(attempts));
    } catch (e) {
      // Silent fail for localStorage issues
    }
  }

  checkForRepositoryHosting() {
    const repoIndicators = [
      'github.com',
      'gitlab.com',
      'bitbucket.org',
      'sourceforge.net',
      'codeberg.org'
    ];
    
    const currentUrl = window.location.href.toLowerCase();
    const isRepoSite = repoIndicators.some(indicator => currentUrl.includes(indicator));
    
    if (isRepoSite) {
      this.handleRepositoryCloning();
    }
  }

  setupPeriodicReminders() {
    // Periodic attribution reminders (every 5 minutes)
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 5 minutes
        console.log('%c💡 ATTRIBUTION REMINDER: This code was created by ' + SECURITY_CONFIG.author.name, 
          'background: #17a2b8; color: white; padding: 5px;');
        console.log('🔗 GitHub: ' + SECURITY_CONFIG.author.githubUrl);
      }
    }, 300000); // 5 minutes
  }

  setupMonitoring() {
    // Monitor for attempts to remove attribution
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node.id === 'attribution-banner' || 
                (node.getAttribute && node.getAttribute('data-security-fingerprint'))) {
              console.warn('%c⚠️ SECURITY ALERT: Attribution removal detected!', 
                'background: #dc3545; color: white; padding: 10px; font-weight: bold;');
              // Re-embed attribution after a delay
              setTimeout(() => this.embedDOMMarkers(), 1000);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Public method to verify security status
  getSecurityStatus() {
    return {
      initialized: this.initialized,
      protectionActive: this.protectionActive,
      author: SECURITY_CONFIG.author.name,
      github: SECURITY_CONFIG.author.githubUrl,
      fingerprint: SECURITY_CONFIG.security.fingerprint
    };
  }
}

// Initialize security core
const securityCore = new SecurityCore();

// Export for potential verification
window.__SECURITY_CORE__ = securityCore;

// Additional protection: Object.freeze to prevent tampering
Object.freeze(SECURITY_CONFIG);
Object.freeze(SecurityCore.prototype);

export default securityCore;