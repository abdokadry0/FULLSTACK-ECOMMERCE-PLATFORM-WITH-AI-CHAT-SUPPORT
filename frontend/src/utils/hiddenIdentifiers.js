// Hidden Identifiers System - Embeds attribution in multiple locations
// This system creates subtle, hard-to-remove identifiers throughout the application

const IDENTIFIER_CONFIG = {
  author: 'lancyyboii',
  github: 'github.com/lancyyboii',
  signature: 'LANCYY_ORIGINAL_2024',
  checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  watermark: '/* 🔒 Original by lancyyboii - github.com/lancyyboii */',
  encodedAttribution: btoa('Original Author: lancyyboii | GitHub: github.com/lancyyboii | License: PORTFOLIO-DEMO-2024')
};

class HiddenIdentifiers {
  constructor() {
    this.identifiers = new Map();
    this.embedded = false;
    this.checkInterval = null;
  }

  init() {
    if (this.embedded) return;
    
    // Embed identifiers in various locations
    this.embedInDOM();
    this.embedInLocalStorage();
    this.embedInSessionStorage();
    this.embedInMetaTags();
    this.embedInCSS();
    this.embedInJavaScript();
    this.setupIntegrityChecks();
    
    this.embedded = true;
  }

  embedInDOM() {
    try {
      // Add hidden div with attribution
      const hiddenDiv = document.createElement('div');
      hiddenDiv.id = 'attribution-' + Date.now();
      hiddenDiv.style.display = 'none';
      hiddenDiv.setAttribute('data-author', IDENTIFIER_CONFIG.author);
      hiddenDiv.setAttribute('data-source', IDENTIFIER_CONFIG.github);
      hiddenDiv.setAttribute('data-signature', IDENTIFIER_CONFIG.signature);
      hiddenDiv.innerHTML = `<!-- ${IDENTIFIER_CONFIG.watermark} -->`;
      document.body.appendChild(hiddenDiv);

      // Add to document title (subtle)
      const originalTitle = document.title;
      document.title = originalTitle + ' ';
      
      // Add invisible characters to body
      const invisibleSpan = document.createElement('span');
      invisibleSpan.style.position = 'absolute';
      invisibleSpan.style.left = '-9999px';
      invisibleSpan.style.fontSize = '0px';
      invisibleSpan.style.color = 'transparent';
      invisibleSpan.textContent = IDENTIFIER_CONFIG.encodedAttribution;
      document.body.appendChild(invisibleSpan);

      // Add data attributes to html element
      document.documentElement.setAttribute('data-original-author', IDENTIFIER_CONFIG.author);
      document.documentElement.setAttribute('data-source-repo', IDENTIFIER_CONFIG.github);

    } catch (error) {
      // Silent fail
    }
  }

  embedInLocalStorage() {
    try {
      const storageKey = '_app_meta_' + btoa(IDENTIFIER_CONFIG.signature).slice(0, 8);
      const attributionData = {
        author: IDENTIFIER_CONFIG.author,
        github: IDENTIFIER_CONFIG.github,
        timestamp: Date.now(),
        signature: IDENTIFIER_CONFIG.signature,
        checksum: IDENTIFIER_CONFIG.checksum
      };
      
      localStorage.setItem(storageKey, JSON.stringify(attributionData));
      localStorage.setItem('_original_author', IDENTIFIER_CONFIG.author);
      localStorage.setItem('_source_attribution', IDENTIFIER_CONFIG.encodedAttribution);
      
      this.identifiers.set('localStorage', storageKey);
    } catch (error) {
      // Silent fail
    }
  }

  embedInSessionStorage() {
    try {
      const sessionKey = '_session_meta_' + Date.now().toString(36);
      const sessionData = {
        originalAuthor: IDENTIFIER_CONFIG.author,
        sourceRepo: IDENTIFIER_CONFIG.github,
        created: new Date().toISOString(),
        signature: IDENTIFIER_CONFIG.signature
      };
      
      sessionStorage.setItem(sessionKey, JSON.stringify(sessionData));
      sessionStorage.setItem('_attribution_check', IDENTIFIER_CONFIG.checksum);
      
      this.identifiers.set('sessionStorage', sessionKey);
    } catch (error) {
      // Silent fail
    }
  }

  embedInMetaTags() {
    try {
      // Add meta tags to head
      const metaTags = [
        { name: 'author', content: IDENTIFIER_CONFIG.author },
        { name: 'original-source', content: IDENTIFIER_CONFIG.github },
        { name: 'attribution', content: IDENTIFIER_CONFIG.encodedAttribution },
        { name: 'code-signature', content: IDENTIFIER_CONFIG.signature },
        { property: 'og:author', content: IDENTIFIER_CONFIG.author },
        { property: 'og:source', content: IDENTIFIER_CONFIG.github }
      ];

      metaTags.forEach(tag => {
        const meta = document.createElement('meta');
        if (tag.name) meta.name = tag.name;
        if (tag.property) meta.property = tag.property;
        meta.content = tag.content;
        document.head.appendChild(meta);
      });

      // Add link tag for attribution
      const link = document.createElement('link');
      link.rel = 'author';
      link.href = 'https://' + IDENTIFIER_CONFIG.github;
      document.head.appendChild(link);

    } catch (error) {
      // Silent fail
    }
  }

  embedInCSS() {
    try {
      // Add CSS with attribution comments
      const style = document.createElement('style');
      style.textContent = `
        /* Original Author: ${IDENTIFIER_CONFIG.author} */
        /* Source: ${IDENTIFIER_CONFIG.github} */
        /* Signature: ${IDENTIFIER_CONFIG.signature} */
        
        body::after {
          content: "${IDENTIFIER_CONFIG.author}";
          position: absolute;
          left: -9999px;
          top: -9999px;
          font-size: 0;
          opacity: 0;
          pointer-events: none;
        }
        
        html::before {
          content: "${IDENTIFIER_CONFIG.encodedAttribution}";
          display: none;
        }
      `;
      document.head.appendChild(style);
    } catch (error) {
      // Silent fail
    }
  }

  embedInJavaScript() {
    try {
      // Add properties to window object
      Object.defineProperty(window, '_originalAuthor', {
        value: IDENTIFIER_CONFIG.author,
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(window, '_sourceAttribution', {
        value: IDENTIFIER_CONFIG.encodedAttribution,
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(window, '_codeSignature', {
        value: IDENTIFIER_CONFIG.signature,
        writable: false,
        enumerable: false,
        configurable: false
      });

      // Add to global scope with obfuscated names
      window['_' + btoa('author').replace(/=/g, '')] = IDENTIFIER_CONFIG.author;
      window['_' + btoa('github').replace(/=/g, '')] = IDENTIFIER_CONFIG.github;

    } catch (error) {
      // Silent fail
    }
  }

  setupIntegrityChecks() {
    // Check for identifier removal every 30 seconds
    this.checkInterval = setInterval(() => {
      this.verifyIdentifiers();
    }, 30000);

    // Check on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => this.verifyIdentifiers(), 1000);
      }
    });
  }

  verifyIdentifiers() {
    try {
      let missing = [];

      // Check localStorage
      const lsKey = this.identifiers.get('localStorage');
      if (lsKey && !localStorage.getItem(lsKey)) {
        missing.push('localStorage');
        this.embedInLocalStorage(); // Re-embed
      }

      // Check sessionStorage
      const ssKey = this.identifiers.get('sessionStorage');
      if (ssKey && !sessionStorage.getItem(ssKey)) {
        missing.push('sessionStorage');
        this.embedInSessionStorage(); // Re-embed
      }

      // Check DOM elements
      if (!document.querySelector('[data-author="' + IDENTIFIER_CONFIG.author + '"]')) {
        missing.push('DOM');
        this.embedInDOM(); // Re-embed
      }

      // Check window properties
      if (!window._originalAuthor) {
        missing.push('window');
        this.embedInJavaScript(); // Re-embed
      }

      // Log if identifiers were tampered with
      if (missing.length > 0) {
        console.warn('🔒 Attribution identifiers restored:', missing.join(', '));
        
        // Trigger console attribution
        if (window.consoleAttribution) {
          window.consoleAttribution.triggerAttribution('identifier_tampering');
        }
      }

    } catch (error) {
      // Silent fail
    }
  }

  // Method to get all embedded identifiers (for debugging)
  getIdentifiers() {
    return {
      author: IDENTIFIER_CONFIG.author,
      github: IDENTIFIER_CONFIG.github,
      signature: IDENTIFIER_CONFIG.signature,
      embedded: this.embedded,
      locations: Array.from(this.identifiers.keys())
    };
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

// Create and initialize the hidden identifiers system
const hiddenIdentifiers = new HiddenIdentifiers();

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      hiddenIdentifiers.init();
    });
  } else {
    hiddenIdentifiers.init();
  }
}

export default hiddenIdentifiers;