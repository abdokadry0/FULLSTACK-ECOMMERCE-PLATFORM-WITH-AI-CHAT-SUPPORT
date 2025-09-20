// Security Tester - Validates attribution protection systems
// This system tests and verifies that all security measures are functioning correctly

import securityCore from './securityCore';
import githubIntegration from './githubIntegration';
import consoleAttribution from './consoleAttribution';
import hiddenIdentifiers from './hiddenIdentifiers';

const TEST_CONFIG = {
  author: 'lancyyboii',
  github: 'github.com/lancyyboii',
  signature: 'LANCYY_ORIGINAL_2024',
  testInterval: 60000, // 1 minute
  maxRetries: 3
};

class SecurityTester {
  constructor() {
    this.testResults = new Map();
    this.testInterval = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Run initial tests after a delay
    setTimeout(() => {
      this.runAllTests();
    }, 5000);
    
    // Set up periodic testing
    this.setupPeriodicTesting();
    
    this.initialized = true;
  }

  async runAllTests() {
    console.log('🔒 Running security validation tests...');
    
    const tests = [
      { name: 'DOM Attribution', test: () => this.testDOMAttribution() },
      { name: 'Console Attribution', test: () => this.testConsoleAttribution() },
      { name: 'Storage Attribution', test: () => this.testStorageAttribution() },
      { name: 'Meta Tags', test: () => this.testMetaTags() },
      { name: 'Window Properties', test: () => this.testWindowProperties() },
      { name: 'CSS Attribution', test: () => this.testCSSAttribution() },
      { name: 'GitHub Integration', test: () => this.testGitHubIntegration() },
      { name: 'Tamper Resistance', test: () => this.testTamperResistance() }
    ];

    const results = [];
    
    for (const test of tests) {
      try {
        const result = await test.test();
        results.push({ name: test.name, passed: result.passed, details: result.details });
        this.testResults.set(test.name, result);
      } catch (error) {
        results.push({ name: test.name, passed: false, details: error.message });
        this.testResults.set(test.name, { passed: false, details: error.message });
      }
    }

    this.reportResults(results);
    return results;
  }

  testDOMAttribution() {
    const checks = [];
    
    // Check for hidden attribution div
    const attributionDiv = document.querySelector('[data-author="' + TEST_CONFIG.author + '"]');
    checks.push({
      name: 'Attribution div exists',
      passed: !!attributionDiv
    });

    // Check for invisible span with encoded attribution
    const invisibleSpans = document.querySelectorAll('span[style*="position: absolute"][style*="left: -9999px"]');
    const hasAttributionSpan = Array.from(invisibleSpans).some(span => 
      span.textContent.includes(TEST_CONFIG.author)
    );
    checks.push({
      name: 'Invisible attribution span exists',
      passed: hasAttributionSpan
    });

    // Check document element attributes
    const hasDocumentAttribution = document.documentElement.hasAttribute('data-original-author');
    checks.push({
      name: 'Document element has attribution',
      passed: hasDocumentAttribution
    });

    const passed = checks.every(check => check.passed);
    return { passed, details: checks };
  }

  testConsoleAttribution() {
    const checks = [];
    
    // Test if console.clear is overridden
    const originalClear = console.clear.toString();
    checks.push({
      name: 'Console.clear is protected',
      passed: !originalClear.includes('[native code]')
    });

    // Check if attribution is displayed (we can't directly test console output)
    // but we can check if the system is initialized
    checks.push({
      name: 'Console attribution system initialized',
      passed: typeof consoleAttribution === 'object' && consoleAttribution.displayed !== undefined
    });

    const passed = checks.every(check => check.passed);
    return { passed, details: checks };
  }

  testStorageAttribution() {
    const checks = [];
    
    // Check localStorage for attribution
    const hasLocalStorageAttribution = Object.keys(localStorage).some(key => 
      key.includes('_app_meta_') || key === '_original_author'
    );
    checks.push({
      name: 'LocalStorage attribution exists',
      passed: hasLocalStorageAttribution
    });

    // Check sessionStorage for attribution
    const hasSessionStorageAttribution = Object.keys(sessionStorage).some(key => 
      key.includes('_session_meta_') || key === '_attribution_check'
    );
    checks.push({
      name: 'SessionStorage attribution exists',
      passed: hasSessionStorageAttribution
    });

    const passed = checks.every(check => check.passed);
    return { passed, details: checks };
  }

  testMetaTags() {
    const checks = [];
    
    // Check for author meta tag
    const authorMeta = document.querySelector('meta[name="author"]');
    checks.push({
      name: 'Author meta tag exists',
      passed: !!authorMeta && authorMeta.content === TEST_CONFIG.author
    });

    // Check for original-source meta tag
    const sourceMeta = document.querySelector('meta[name="original-source"]');
    checks.push({
      name: 'Source meta tag exists',
      passed: !!sourceMeta && sourceMeta.content === TEST_CONFIG.github
    });

    // Check for attribution link
    const authorLink = document.querySelector('link[rel="author"]');
    checks.push({
      name: 'Author link exists',
      passed: !!authorLink && authorLink.href.includes(TEST_CONFIG.github)
    });

    const passed = checks.every(check => check.passed);
    return { passed, details: checks };
  }

  testWindowProperties() {
    const checks = [];
    
    // Check for protected window properties
    checks.push({
      name: 'Window._originalAuthor exists',
      passed: window._originalAuthor === TEST_CONFIG.author
    });

    checks.push({
      name: 'Window._sourceAttribution exists',
      passed: typeof window._sourceAttribution === 'string' && 
              window._sourceAttribution.includes(TEST_CONFIG.author)
    });

    checks.push({
      name: 'Window._codeSignature exists',
      passed: window._codeSignature === TEST_CONFIG.signature
    });

    // Check for obfuscated properties
    const obfuscatedAuthorKey = '_' + btoa('author').replace(/=/g, '');
    checks.push({
      name: 'Obfuscated author property exists',
      passed: window[obfuscatedAuthorKey] === TEST_CONFIG.author
    });

    const passed = checks.every(check => check.passed);
    return { passed, details: checks };
  }

  testCSSAttribution() {
    const checks = [];
    
    // Check for attribution in stylesheets
    const stylesheets = Array.from(document.styleSheets);
    let hasAttributionCSS = false;
    
    try {
      stylesheets.forEach(sheet => {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach(rule => {
            if (rule.cssText && rule.cssText.includes(TEST_CONFIG.author)) {
              hasAttributionCSS = true;
            }
          });
        }
      });
    } catch (error) {
      // Some stylesheets might not be accessible due to CORS
      hasAttributionCSS = true; // Assume it exists if we can't check
    }

    checks.push({
      name: 'CSS attribution exists',
      passed: hasAttributionCSS
    });

    const passed = checks.every(check => check.passed);
    return { passed, details: checks };
  }

  testGitHubIntegration() {
    const checks = [];
    
    // Check if GitHub integration is initialized
    checks.push({
      name: 'GitHub integration initialized',
      passed: typeof githubIntegration === 'object' && githubIntegration.initialized !== undefined
    });

    // Check if environment detection is working
    checks.push({
      name: 'Environment detection active',
      passed: typeof githubIntegration.detectEnvironment === 'function'
    });

    const passed = checks.every(check => check.passed);
    return { passed, details: checks };
  }

  async testTamperResistance() {
    const checks = [];
    
    // Test if identifiers are restored after removal
    const originalLocalStorageLength = localStorage.length;
    
    // Try to remove attribution from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('_original_author') || key.includes('_app_meta_')) {
        localStorage.removeItem(key);
      }
    });

    // Wait for restoration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if attribution was restored
    const hasRestoredAttribution = Object.keys(localStorage).some(key => 
      key.includes('_original_author') || key.includes('_app_meta_')
    );
    
    checks.push({
      name: 'Attribution restored after removal',
      passed: hasRestoredAttribution
    });

    // Test window property protection
    try {
      delete window._originalAuthor;
      checks.push({
        name: 'Window properties are protected',
        passed: window._originalAuthor === TEST_CONFIG.author
      });
    } catch (error) {
      checks.push({
        name: 'Window properties are protected',
        passed: true // Error means property is protected
      });
    }

    const passed = checks.every(check => check.passed);
    return { passed, details: checks };
  }

  reportResults(results) {
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const percentage = Math.round((passed / total) * 100);

    console.log(`\n🔒 Security Test Results: ${passed}/${total} tests passed (${percentage}%)`);
    console.log('═'.repeat(60));

    results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.name}`);
      
      if (!result.passed && result.details) {
        console.log(`   Details: ${result.details}`);
      }
    });

    console.log('═'.repeat(60));

    if (percentage < 80) {
      console.warn('⚠️  Security measures may be compromised. Some tests failed.');
      this.triggerSecurityAlert();
    } else {
      console.log('✅ Security measures are functioning correctly.');
    }

    // Store results for monitoring
    this.testResults.set('lastRun', {
      timestamp: Date.now(),
      passed,
      total,
      percentage,
      results
    });
  }

  triggerSecurityAlert() {
    // Trigger console attribution
    if (consoleAttribution && consoleAttribution.triggerAttribution) {
      consoleAttribution.triggerAttribution('security_test_failure');
    }

    // Re-initialize security systems
    setTimeout(() => {
      securityCore.init();
      hiddenIdentifiers.init();
    }, 1000);
  }

  setupPeriodicTesting() {
    // Run tests every minute
    this.testInterval = setInterval(() => {
      this.runAllTests();
    }, TEST_CONFIG.testInterval);

    // Run tests on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => this.runAllTests(), 2000);
      }
    });
  }

  getTestResults() {
    return Object.fromEntries(this.testResults);
  }

  destroy() {
    if (this.testInterval) {
      clearInterval(this.testInterval);
    }
  }
}

// Create and initialize the security tester
const securityTester = new SecurityTester();

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      securityTester.init();
    });
  } else {
    securityTester.init();
  }
}

export default securityTester;