import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-error-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-error-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Something went wrong
              </h1>
              
              <p className="text-secondary-600 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-left">
                  <p className="text-sm font-mono text-error-800">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-sm text-error-600 cursor-pointer">
                        Stack trace
                      </summary>
                      <pre className="text-xs text-error-600 mt-1 overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
