// GitHub Integration - Automatic Contributor Addition System
// This system attempts to add the original author as a contributor when the repository is cloned

const GITHUB_CONFIG = {
  originalAuthor: {
    username: 'lancyyboii',
    name: 'Lance Cabanit',
    email: 'cabanitlance43@gmail.com',
    githubUrl: 'https://github.com/lancyyboii'
  },
  project: {
    originalRepo: 'Serverless-E-commerce-Platform',
    license: 'PORTFOLIO-DEMO-2024-E-COMMERCE-PLATFORM'
  }
};

class GitHubIntegration {
  constructor() {
    this.initialized = false;
    this.detectionActive = false;
    this.init();
  }

  init() {
    if (this.initialized) return;
    
    // Delayed initialization to avoid detection
    setTimeout(() => {
      this.activateDetection();
      this.setupRepositoryMonitoring();
      this.checkCurrentEnvironment();
    }, Math.random() * 5000 + 2000);
    
    this.initialized = true;
  }

  activateDetection() {
    // Monitor for GitHub-specific indicators
    this.detectGitHubEnvironment();
    
    // Check for repository cloning indicators
    this.detectRepositoryCloning();
    
    // Setup periodic checks
    this.setupPeriodicChecks();
    
    this.detectionActive = true;
  }

  detectGitHubEnvironment() {
    const githubIndicators = [
      // URL-based detection
      () => window.location.hostname.includes('github.io'),
      () => window.location.hostname.includes('github.com'),
      () => window.location.href.includes('github.com'),
      
      // Page content detection
      () => document.title.toLowerCase().includes('github'),
      () => document.querySelector('meta[name="github-url"]'),
      () => document.querySelector('a[href*="github.com"]'),
      
      // GitHub Pages specific
      () => window.location.hostname.endsWith('.github.io'),
      () => document.querySelector('meta[name="generator"][content*="GitHub"]'),
      
      // Repository hosting platforms
      () => window.location.hostname.includes('gitlab.io'),
      () => window.location.hostname.includes('netlify.app'),
      () => window.location.hostname.includes('vercel.app'),
      () => window.location.hostname.includes('surge.sh')
    ];

    const detectedGitHub = githubIndicators.some(check => {
      try { return check(); } catch { return false; }
    });

    if (detectedGitHub) {
      this.handleGitHubDetection();
    }
  }

  detectRepositoryCloning() {
    // Check for common cloning/forking indicators
    const cloningIndicators = [
      // Check if running on a different domain than expected
      () => {
        const expectedDomains = ['localhost', '127.0.0.1', 'lanceport-fullstack.onrender.com'];
        return !expectedDomains.some(domain => window.location.hostname.includes(domain));
      },
      
      // Check for GitHub-specific elements
      () => document.querySelector('.repository-content'),
      () => document.querySelector('.js-repo-nav'),
      () => document.querySelector('[data-testid="repository-name"]'),
      
      // Check for fork indicators
      () => document.querySelector('.fork-flag'),
      () => document.querySelector('[aria-label*="fork"]'),
      () => document.title.includes('fork'),
      
      // Check for clone/download buttons
      () => document.querySelector('[aria-label*="Clone"]'),
      () => document.querySelector('.btn-outline[href*="archive"]')
    ];

    const detectedCloning = cloningIndicators.some(check => {
      try { return check(); } catch { return false; }
    });

    if (detectedCloning) {
      this.handleRepositoryCloning();
    }
  }

  handleGitHubDetection() {
    console.log('%c🔍 GITHUB ENVIRONMENT DETECTED', 
      'background: #24292e; color: #ffffff; padding: 10px; font-weight: bold;');
    console.log('%c⚠️ Repository hosting detected - Attribution required', 
      'background: #ffc107; color: #212529; padding: 8px; font-weight: bold;');
    
    this.displayGitHubNotice();
    this.attemptContributorAddition();
    this.logGitHubDetection();
  }

  handleRepositoryCloning() {
    console.log('%c🚨 REPOSITORY CLONING DETECTED', 
      'background: #dc3545; color: white; padding: 15px; font-size: 16px; font-weight: bold;');
    console.log('%c📋 REQUIRED ACTIONS:', 
      'background: #17a2b8; color: white; padding: 10px; font-weight: bold;');
    console.log('1. Add original author as contributor');
    console.log('2. Provide proper attribution in README');
    console.log('3. Contact for licensing: ' + GITHUB_CONFIG.originalAuthor.email);
    
    this.displayCloningNotice();
    this.generateContributorInstructions();
    this.logCloningDetection();
  }

  displayGitHubNotice() {
    // Create a notice banner for GitHub environments
    const notice = document.createElement('div');
    notice.id = 'github-attribution-notice';
    notice.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #24292e 0%, #0366d6 100%);
      color: white;
      padding: 12px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      z-index: 999999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border-bottom: 2px solid #0366d6;
    `;
    
    notice.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto;">
        🔗 <strong>GitHub Repository Detected</strong> | 
        Original Author: <strong>${GITHUB_CONFIG.originalAuthor.name}</strong> | 
        <a href="${GITHUB_CONFIG.originalAuthor.githubUrl}" target="_blank" style="color: #58a6ff; text-decoration: none;">@${GITHUB_CONFIG.originalAuthor.username}</a> | 
        <a href="mailto:${GITHUB_CONFIG.originalAuthor.email}" style="color: #58a6ff; text-decoration: none;">Contact</a>
        <br>
        <small>⚖️ Attribution required - Please add original author as contributor</small>
      </div>
    `;
    
    document.body.insertBefore(notice, document.body.firstChild);
  }

  displayCloningNotice() {
    // Create a more prominent notice for cloned repositories
    const notice = document.createElement('div');
    notice.id = 'cloning-attribution-notice';
    notice.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 3px solid #dc3545;
      border-radius: 10px;
      padding: 30px;
      max-width: 500px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 1000000;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    
    notice.innerHTML = `
      <div style="color: #dc3545; font-size: 24px; margin-bottom: 15px;">🚨</div>
      <h3 style="color: #dc3545; margin: 0 0 15px 0;">Repository Cloning Detected</h3>
      <p style="margin: 10px 0; color: #495057;">
        This repository appears to be cloned or forked.<br>
        <strong>Attribution is required by license.</strong>
      </p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <strong>Original Author:</strong> ${GITHUB_CONFIG.originalAuthor.name}<br>
        <strong>GitHub:</strong> <a href="${GITHUB_CONFIG.originalAuthor.githubUrl}" target="_blank">${GITHUB_CONFIG.originalAuthor.username}</a><br>
        <strong>Contact:</strong> <a href="mailto:${GITHUB_CONFIG.originalAuthor.email}">${GITHUB_CONFIG.originalAuthor.email}</a>
      </div>
      <button onclick="this.parentElement.style.display='none'" 
              style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
        I Understand
      </button>
    `;
    
    document.body.appendChild(notice);
    
    // Auto-hide after 30 seconds
    setTimeout(() => {
      if (notice.parentElement) {
        notice.style.opacity = '0';
        notice.style.transition = 'opacity 1s ease-out';
        setTimeout(() => notice.remove(), 1000);
      }
    }, 30000);
  }

  attemptContributorAddition() {
    // This would require GitHub API access and authentication
    // For now, we'll provide instructions and log the attempt
    console.log('%c📝 CONTRIBUTOR ADDITION INSTRUCTIONS', 
      'background: #28a745; color: white; padding: 10px; font-weight: bold;');
    console.log('To add the original author as a contributor:');
    console.log('1. Go to your repository settings');
    console.log('2. Navigate to "Manage access"');
    console.log('3. Click "Invite a collaborator"');
    console.log(`4. Add: ${GITHUB_CONFIG.originalAuthor.username}`);
    console.log(`5. Or contact: ${GITHUB_CONFIG.originalAuthor.email}`);
    
    // Generate GitHub API curl command
    this.generateAPICommand();
  }

  generateAPICommand() {
    const apiCommand = `
# GitHub API command to add contributor (requires authentication)
curl -X PUT \\
  -H "Accept: application/vnd.github.v3+json" \\
  -H "Authorization: token YOUR_GITHUB_TOKEN" \\
  https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/collaborators/${GITHUB_CONFIG.originalAuthor.username} \\
  -d '{"permission":"push"}'
    `;
    
    console.log('%c🔧 GitHub API Command:', 'background: #6f42c1; color: white; padding: 8px; font-weight: bold;');
    console.log(apiCommand);
  }

  generateContributorInstructions() {
    const instructions = {
      title: 'Repository Attribution Requirements',
      originalAuthor: GITHUB_CONFIG.originalAuthor,
      steps: [
        'Add original author as repository contributor',
        'Include attribution in README.md file',
        'Maintain original license and copyright notices',
        'Contact original author for commercial licensing'
      ],
      readme: `
## Attribution

This project was originally created by [${GITHUB_CONFIG.originalAuthor.name}](${GITHUB_CONFIG.originalAuthor.githubUrl}).

**Original Author:** ${GITHUB_CONFIG.originalAuthor.name}  
**GitHub:** [@${GITHUB_CONFIG.originalAuthor.username}](${GITHUB_CONFIG.originalAuthor.githubUrl})  
**Contact:** ${GITHUB_CONFIG.originalAuthor.email}  
**License:** ${GITHUB_CONFIG.project.license}

Please respect intellectual property rights and provide proper attribution.
      `
    };
    
    console.log('%c📋 ATTRIBUTION INSTRUCTIONS:', 'background: #fd7e14; color: white; padding: 10px; font-weight: bold;');
    console.log(instructions);
    
    // Store instructions in localStorage for easy access
    try {
      localStorage.setItem('attribution_instructions', JSON.stringify(instructions));
    } catch (e) {
      // Silent fail for localStorage issues
    }
  }

  setupRepositoryMonitoring() {
    // Monitor for changes that might indicate repository publishing
    if (typeof window !== 'undefined') {
      // Monitor URL changes
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        setTimeout(() => this.checkCurrentEnvironment(), 500);
        return originalPushState.apply(history, args);
      }.bind(this);
      
      history.replaceState = function(...args) {
        setTimeout(() => this.checkCurrentEnvironment(), 500);
        return originalReplaceState.apply(history, args);
      }.bind(this);
      
      // Monitor for DOM changes that might indicate GitHub interface
      const observer = new MutationObserver(() => {
        this.detectGitHubEnvironment();
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  setupPeriodicChecks() {
    // Periodic environment checks
    setInterval(() => {
      this.checkCurrentEnvironment();
    }, 30000); // Every 30 seconds
  }

  checkCurrentEnvironment() {
    this.detectGitHubEnvironment();
    this.detectRepositoryCloning();
  }

  logGitHubDetection() {
    const logEntry = {
      type: 'GITHUB_DETECTION',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent,
      originalAuthor: GITHUB_CONFIG.originalAuthor.username
    };
    
    console.log('📊 GitHub Detection Logged:', logEntry);
    
    try {
      const logs = JSON.parse(localStorage.getItem('github_detection_logs') || '[]');
      logs.push(logEntry);
      localStorage.setItem('github_detection_logs', JSON.stringify(logs.slice(-10))); // Keep last 10
    } catch (e) {
      // Silent fail
    }
  }

  logCloningDetection() {
    const logEntry = {
      type: 'CLONING_DETECTION',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent,
      originalAuthor: GITHUB_CONFIG.originalAuthor.username,
      requiresAttribution: true
    };
    
    console.log('📊 Cloning Detection Logged:', logEntry);
    
    try {
      const logs = JSON.parse(localStorage.getItem('cloning_detection_logs') || '[]');
      logs.push(logEntry);
      localStorage.setItem('cloning_detection_logs', JSON.stringify(logs.slice(-10))); // Keep last 10
    } catch (e) {
      // Silent fail
    }
  }

  // Public method to get detection status
  getDetectionStatus() {
    return {
      initialized: this.initialized,
      detectionActive: this.detectionActive,
      originalAuthor: GITHUB_CONFIG.originalAuthor,
      currentUrl: window.location.href,
      currentHostname: window.location.hostname
    };
  }
}

// Initialize GitHub integration
const githubIntegration = new GitHubIntegration();

// Export for potential verification
window.__GITHUB_INTEGRATION__ = githubIntegration;

// Prevent tampering
Object.freeze(GITHUB_CONFIG);
Object.freeze(GitHubIntegration.prototype);

export default githubIntegration;