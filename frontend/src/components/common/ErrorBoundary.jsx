import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

/**
 * Professional Error Boundary with retry mechanisms and user-friendly error handling
 * 
 * Features:
 * - Graceful error recovery
 * - User-friendly error messages
 * - Retry functionality
 * - Error reporting
 * - Fallback UI components
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // Report error to monitoring service (e.g., Sentry, LogRocket)
    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    // In production, send to error monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    };

    // Example: Send to monitoring service
    // Sentry.captureException(error, { extra: errorReport });
    console.error('Error Report:', errorReport);
  };

  getUserId = () => {
    // Get user ID from your auth system
    return localStorage.getItem('analytics_user_id') || 'anonymous';
  };

  getSessionId = () => {
    return sessionStorage.getItem('analytics_session_id') || 'no-session';
  };

  handleRetry = () => {
    this.setState({ isRetrying: true });
    
    // Add delay to prevent rapid retries
    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: this.state.retryCount + 1,
        isRetrying: false
      });
    }, 1000);
  };

  handleReportBug = () => {
    const subject = encodeURIComponent(`Bug Report: ${this.state.error?.message || 'Unknown Error'}`);
    const body = encodeURIComponent(`
Error Details:
- Message: ${this.state.error?.message || 'Unknown'}
- URL: ${window.location.href}
- Timestamp: ${new Date().toISOString()}
- User Agent: ${navigator.userAgent}

Stack Trace:
${this.state.error?.stack || 'Not available'}

Component Stack:
${this.state.errorInfo?.componentStack || 'Not available'}

Steps to Reproduce:
1. [Please describe what you were doing when this error occurred]
2. 
3. 

Expected Behavior:
[What should have happened?]

Actual Behavior:
[What actually happened?]
    `);
    
    window.open(`mailto:support@yourapp.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI from props
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.handleRetry,
          this.state.retryCount
        );
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {this.props.title || 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                {this.props.message || 
                  'We encountered an unexpected error. Please try again or contact support if the problem persists.'
                }
              </p>

              {/* Error details for development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <strong>Message:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-all">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="flex-1"
                >
                  {this.state.isRetrying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Report bug button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={this.handleReportBug}
                className="w-full text-gray-500 hover:text-gray-700"
              >
                <Bug className="w-4 h-4 mr-2" />
                Report this issue
              </Button>

              {/* Retry count indicator */}
              {this.state.retryCount > 0 && (
                <p className="text-xs text-gray-400 text-center">
                  Retry attempts: {this.state.retryCount}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Specialized error boundaries for different contexts
 */

// Product-specific error boundary
export const ProductErrorBoundary = ({ children, onRetry }) => (
  <ErrorBoundary
    title="Product Loading Error"
    message="We couldn't load the product information. This might be due to a temporary issue."
    fallback={(error, retry, retryCount) => (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Product Unavailable
        </h3>
        <p className="text-gray-600 mb-4">
          We're having trouble loading this product. Please try again.
        </p>
        <Button onClick={() => { retry(); onRetry?.(); }}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reload Product
        </Button>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

// Cart-specific error boundary
export const CartErrorBoundary = ({ children }) => (
  <ErrorBoundary
    title="Cart Error"
    message="There was an issue with your shopping cart. Your items are safe and will be restored."
    fallback={(error, retry) => (
      <div className="p-6 text-center border border-red-200 bg-red-50 rounded-lg">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Cart Temporarily Unavailable
        </h3>
        <p className="text-red-700 mb-4 text-sm">
          Don't worry - your items are saved. Please refresh to continue shopping.
        </p>
        <Button onClick={retry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Cart
        </Button>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;