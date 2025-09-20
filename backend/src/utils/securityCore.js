// Backend Security Core - Attribution Protection System
// Server-side intellectual property protection and monitoring

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
    fingerprint: 'SEC_LANCE_2024_ECOM_BACKEND_PROTECTED',
    checksum: 'b8g9e3c5d7f2b4e6a9c3f5e7b0d2f4e6',
    timestamp: Date.now()
  }
};

class BackendSecurityCore {
  constructor() {
    this.initialized = false;
    this.protectionActive = false;
    this.requestCount = 0;
    this.init();
  }

  init() {
    if (this.initialized) return;
    
    console.log('\n🛡️ ========================================');
    console.log('🛡️  BACKEND SECURITY CORE INITIALIZED   🛡️');
    console.log('🛡️ ========================================');
    console.log(`👨‍💻 Original Author: ${SECURITY_CONFIG.author.name}`);
    console.log(`🔗 GitHub: ${SECURITY_CONFIG.author.githubUrl}`);
    console.log(`📧 Contact: ${SECURITY_CONFIG.author.email}`);
    console.log(`⚖️ License: ${SECURITY_CONFIG.project.license}`);
    console.log(`🔒 Security Fingerprint: ${SECURITY_CONFIG.security.fingerprint}`);
    console.log('🛡️ ========================================\n');
    
    this.activateProtection();
    this.setupMonitoring();
    this.initialized = true;
  }

  activateProtection() {
    // Add security headers middleware
    this.securityHeaders = (req, res, next) => {
      // Attribution headers
      res.setHeader('X-Original-Author', SECURITY_CONFIG.author.name);
      res.setHeader('X-Author-GitHub', SECURITY_CONFIG.author.githubUrl);
      res.setHeader('X-Author-Contact', SECURITY_CONFIG.author.email);
      res.setHeader('X-Project-License', SECURITY_CONFIG.project.license);
      res.setHeader('X-Security-Fingerprint', SECURITY_CONFIG.security.fingerprint);
      
      // Intellectual property notice
      res.setHeader('X-IP-Notice', 'This code is protected by intellectual property rights');
      res.setHeader('X-Attribution-Required', 'true');
      
      // Anti-cloning headers
      res.setHeader('X-Anti-Clone-Protection', 'active');
      res.setHeader('X-Repository-Original', SECURITY_CONFIG.author.githubUrl);
      
      next();
    };

    // Request monitoring middleware
    this.requestMonitor = (req, res, next) => {
      this.requestCount++;
      
      // Log suspicious activity
      this.detectSuspiciousActivity(req);
      
      // Periodic attribution reminders in logs
      if (this.requestCount % 100 === 0) {
        console.log(`\n🔔 ATTRIBUTION REMINDER (Request #${this.requestCount})`);
        console.log(`👨‍💻 This backend was created by: ${SECURITY_CONFIG.author.name}`);
        console.log(`🔗 Original repository: ${SECURITY_CONFIG.author.githubUrl}`);
        console.log(`📧 Contact for licensing: ${SECURITY_CONFIG.author.email}\n`);
      }
      
      next();
    };

    this.protectionActive = true;
  }

  detectSuspiciousActivity(req) {
    const suspiciousIndicators = [
      // Check for repository hosting platforms in referrer
      req.get('Referer')?.includes('github.com'),
      req.get('Referer')?.includes('gitlab.com'),
      req.get('Referer')?.includes('bitbucket.org'),
      
      // Check for automated tools
      req.get('User-Agent')?.includes('GitHub'),
      req.get('User-Agent')?.includes('GitLab'),
      req.get('User-Agent')?.includes('curl'),
      req.get('User-Agent')?.includes('wget'),
      
      // Check for development/cloning indicators
      req.get('Host')?.includes('github.io'),
      req.get('Host')?.includes('gitlab.io'),
      req.get('Host')?.includes('netlify.app'),
      req.get('Host')?.includes('vercel.app'),
      
      // Check for localhost but not the expected ports
      req.get('Host')?.includes('localhost') && 
      !req.get('Host')?.includes('3000') && 
      !req.get('Host')?.includes('3001')
    ].filter(Boolean);

    if (suspiciousIndicators.length > 0) {
      console.log('\n🚨 ========================================');
      console.log('🚨  SUSPICIOUS ACTIVITY DETECTED        🚨');
      console.log('🚨 ========================================');
      console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
      console.log(`🌐 Host: ${req.get('Host')}`);
      console.log(`🔗 Referer: ${req.get('Referer') || 'None'}`);
      console.log(`🤖 User-Agent: ${req.get('User-Agent')}`);
      console.log(`📍 IP: ${req.ip || req.connection.remoteAddress}`);
      console.log(`🛤️ Path: ${req.path}`);
      console.log('\n⚖️ LEGAL NOTICE:');
      console.log(`👨‍💻 Original Author: ${SECURITY_CONFIG.author.name}`);
      console.log(`🔗 Original Repository: ${SECURITY_CONFIG.author.githubUrl}`);
      console.log(`📧 Contact: ${SECURITY_CONFIG.author.email}`);
      console.log(`⚖️ License: ${SECURITY_CONFIG.project.license}`);
      console.log('🚨 ========================================\n');
      
      // Log to file if possible
      this.logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        timestamp: new Date().toISOString(),
        host: req.get('Host'),
        referer: req.get('Referer'),
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress,
        path: req.path,
        indicators: suspiciousIndicators.length
      });
    }
  }

  logSecurityEvent(event) {
    // In a real implementation, this would log to a file or external service
    // For now, we'll use console with structured logging
    console.log('📝 SECURITY EVENT LOGGED:', JSON.stringify(event, null, 2));
  }

  setupMonitoring() {
    // Periodic security status reports
    setInterval(() => {
      if (this.requestCount > 0) {
        console.log(`\n📊 SECURITY STATUS REPORT`);
        console.log(`🔢 Total Requests: ${this.requestCount}`);
        console.log(`🛡️ Protection Status: ${this.protectionActive ? 'ACTIVE' : 'INACTIVE'}`);
        console.log(`👨‍💻 Protected by: ${SECURITY_CONFIG.author.name}`);
        console.log(`🔗 Original: ${SECURITY_CONFIG.author.githubUrl}\n`);
      }
    }, 600000); // Every 10 minutes

    // Startup attribution notice
    setTimeout(() => {
      console.log('\n🎯 ========================================');
      console.log('🎯  INTELLECTUAL PROPERTY NOTICE        🎯');
      console.log('🎯 ========================================');
      console.log('This backend server contains protected code.');
      console.log('If you are running a cloned version, please:');
      console.log('1. Provide proper attribution to the original author');
      console.log('2. Contact for licensing if using commercially');
      console.log('3. Respect intellectual property rights');
      console.log(`\n👨‍💻 Original Author: ${SECURITY_CONFIG.author.name}`);
      console.log(`🔗 GitHub: ${SECURITY_CONFIG.author.githubUrl}`);
      console.log(`📧 Contact: ${SECURITY_CONFIG.author.email}`);
      console.log('🎯 ========================================\n');
    }, 5000);
  }

  // API endpoint for security status
  getSecurityStatus() {
    return {
      initialized: this.initialized,
      protectionActive: this.protectionActive,
      requestCount: this.requestCount,
      author: {
        name: SECURITY_CONFIG.author.name,
        github: SECURITY_CONFIG.author.github,
        githubUrl: SECURITY_CONFIG.author.githubUrl,
        email: SECURITY_CONFIG.author.email
      },
      project: SECURITY_CONFIG.project,
      security: {
        fingerprint: SECURITY_CONFIG.security.fingerprint,
        timestamp: SECURITY_CONFIG.security.timestamp
      }
    };
  }

  // Middleware getter methods
  getSecurityHeaders() {
    return this.securityHeaders;
  }

  getRequestMonitor() {
    return this.requestMonitor;
  }

  // Attribution API response
  getAttributionInfo() {
    return {
      message: 'This API was created by Lance Cabanit',
      author: SECURITY_CONFIG.author,
      project: SECURITY_CONFIG.project,
      license: SECURITY_CONFIG.project.license,
      notice: 'This code is protected by intellectual property rights. Please provide proper attribution.',
      contact: 'For licensing inquiries, contact: ' + SECURITY_CONFIG.author.email
    };
  }
}

// Initialize and export
const backendSecurityCore = new BackendSecurityCore();

// Prevent tampering
Object.freeze(SECURITY_CONFIG);
Object.freeze(BackendSecurityCore.prototype);

module.exports = backendSecurityCore;