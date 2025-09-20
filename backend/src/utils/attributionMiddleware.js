// Attribution Middleware - Backend security and attribution system
// This middleware adds attribution headers and monitors for unauthorized usage

const ATTRIBUTION_CONFIG = {
  author: 'lancyyboii',
  github: 'github.com/lancyyboii',
  signature: 'LANCYY_ORIGINAL_2024',
  license: 'PORTFOLIO-DEMO-2024-E-COMMERCE-PLATFORM'
};

class AttributionMiddleware {
  constructor() {
    this.requestCount = 0;
    this.suspiciousActivity = new Map();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    console.log('🔒 Backend Attribution System initialized');
    console.log(`📝 Original Author: ${ATTRIBUTION_CONFIG.author}`);
    console.log(`🔗 Source: ${ATTRIBUTION_CONFIG.github}`);
    
    this.initialized = true;
  }

  // Main middleware function
  middleware() {
    return (req, res, next) => {
      this.requestCount++;
      
      // Add attribution headers
      this.addAttributionHeaders(res);
      
      // Monitor for suspicious activity
      this.monitorRequest(req);
      
      // Log attribution info periodically
      if (this.requestCount % 100 === 0) {
        this.logAttributionInfo();
      }
      
      next();
    };
  }

  addAttributionHeaders(res) {
    // Add custom headers with attribution info
    res.setHeader('X-Original-Author', ATTRIBUTION_CONFIG.author);
    res.setHeader('X-Source-Repository', ATTRIBUTION_CONFIG.github);
    res.setHeader('X-Code-Signature', ATTRIBUTION_CONFIG.signature);
    res.setHeader('X-License', ATTRIBUTION_CONFIG.license);
    res.setHeader('X-Attribution', `Original code by ${ATTRIBUTION_CONFIG.author} - ${ATTRIBUTION_CONFIG.github}`);
    
    // Add to existing security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Add custom attribution in response
    const originalJson = res.json;
    res.json = function(data) {
      // Add attribution to JSON responses
      if (typeof data === 'object' && data !== null) {
        data._attribution = {
          author: ATTRIBUTION_CONFIG.author,
          source: ATTRIBUTION_CONFIG.github,
          license: ATTRIBUTION_CONFIG.license
        };
      }
      return originalJson.call(this, data);
    };
  }

  monitorRequest(req) {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'unknown';
    const referer = req.get('Referer') || 'direct';
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /scraper/i,
      /spider/i,
      /wget/i,
      /curl/i
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(userAgent) || pattern.test(referer)
    );
    
    if (isSuspicious) {
      this.logSuspiciousActivity(clientIP, userAgent, referer);
    }
    
    // Track request patterns
    if (!this.suspiciousActivity.has(clientIP)) {
      this.suspiciousActivity.set(clientIP, {
        count: 0,
        firstSeen: Date.now(),
        userAgents: new Set(),
        suspicious: false
      });
    }
    
    const activity = this.suspiciousActivity.get(clientIP);
    activity.count++;
    activity.userAgents.add(userAgent);
    
    // Mark as suspicious if too many requests or multiple user agents
    if (activity.count > 100 || activity.userAgents.size > 5) {
      activity.suspicious = true;
      this.logSuspiciousActivity(clientIP, userAgent, 'high_activity');
    }
  }

  logSuspiciousActivity(ip, userAgent, reason) {
    console.warn('🚨 Suspicious activity detected:');
    console.warn(`   IP: ${ip}`);
    console.warn(`   User-Agent: ${userAgent}`);
    console.warn(`   Reason: ${reason}`);
    console.warn(`   Original Author: ${ATTRIBUTION_CONFIG.author}`);
    console.warn(`   Source: ${ATTRIBUTION_CONFIG.github}`);
  }

  logAttributionInfo() {
    console.log('📊 Attribution Status:');
    console.log(`   Requests processed: ${this.requestCount}`);
    console.log(`   Original Author: ${ATTRIBUTION_CONFIG.author}`);
    console.log(`   Source Repository: ${ATTRIBUTION_CONFIG.github}`);
    console.log(`   License: ${ATTRIBUTION_CONFIG.license}`);
    
    // Log suspicious activity summary
    const suspiciousIPs = Array.from(this.suspiciousActivity.entries())
      .filter(([ip, activity]) => activity.suspicious)
      .length;
    
    if (suspiciousIPs > 0) {
      console.warn(`   ⚠️  Suspicious IPs detected: ${suspiciousIPs}`);
    }
  }

  // API endpoint handlers
  getAttributionInfo(req, res) {
    res.json({
      author: ATTRIBUTION_CONFIG.author,
      github: ATTRIBUTION_CONFIG.github,
      signature: ATTRIBUTION_CONFIG.signature,
      license: ATTRIBUTION_CONFIG.license,
      message: `This application was originally created by ${ATTRIBUTION_CONFIG.author}`,
      repository: `https://${ATTRIBUTION_CONFIG.github}`,
      timestamp: new Date().toISOString()
    });
  }

  getSecurityStatus(req, res) {
    const suspiciousCount = Array.from(this.suspiciousActivity.values())
      .filter(activity => activity.suspicious).length;
    
    res.json({
      status: 'active',
      author: ATTRIBUTION_CONFIG.author,
      requestsProcessed: this.requestCount,
      suspiciousActivity: suspiciousCount,
      lastCheck: new Date().toISOString(),
      attribution: {
        author: ATTRIBUTION_CONFIG.author,
        source: ATTRIBUTION_CONFIG.github,
        license: ATTRIBUTION_CONFIG.license
      }
    });
  }

  // Method to get statistics
  getStats() {
    return {
      requestCount: this.requestCount,
      suspiciousActivity: this.suspiciousActivity.size,
      initialized: this.initialized
    };
  }
}

// Create singleton instance
const attributionMiddleware = new AttributionMiddleware();

module.exports = attributionMiddleware;