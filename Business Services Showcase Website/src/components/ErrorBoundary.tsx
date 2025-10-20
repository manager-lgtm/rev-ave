import React from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

// Performance monitoring disabled due to critical issues

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Log error to external service in production
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });

    // Track error with analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
        error_boundary: true
      });
    }

    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { contexts: { errorInfo } });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      // Default error UI with Revenue Avenue branding
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600">
                We're experiencing a technical issue. Our team has been notified and we're working to fix it.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                <pre className="text-sm text-red-700 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleRetry}
                className="ra-btn-primary flex items-center space-x-2"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Try Again</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={this.handleGoHome}
                className="ra-btn-outline flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Need immediate help? Contact our support team at{' '}
                <a href="mailto:support@revenueavenue.com" className="text-[var(--ra-olive)] underline">
                  support@revenueavenue.com
                </a>
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for easier use
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};