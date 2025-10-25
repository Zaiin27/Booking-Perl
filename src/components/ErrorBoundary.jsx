import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      const errorMessage = error?.message || '';
      
      // Check for specific error types
      const isInputVoidError = errorMessage.includes('input is a void element tag');
      
      return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 text-gray-900'>
          <div className='text-center p-6 bg-white shadow-md rounded-xl max-w-xl'>
            <div className='size-36 mx-auto'>
              <img src='/illustration.png' className='w-full' alt="Error illustration" />
            </div>
            <h1 className='text-3xl font-bold text-red-500 mb-4'>Something went wrong!</h1>
            
            {isInputVoidError ? (
              <div>
                <p className='text-gray-800 mt-2 mb-4'>
                  There's an issue with a form input in the application. Our team has been notified.
                </p>
                <p className='text-gray-600 mt-2'>Please try navigating to a different page or refreshing.</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className='mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors'
                >
                  Go to Home
                </button>
              </div>
            ) : (
              <div>
                <p className='text-gray-600 mt-2'>Please try refreshing the page or contact support if the issue persists.</p>
                <button
                  onClick={() => window.location.reload()}
                  className='mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors'
                >
                  Refresh Page
                </button>
              </div>
            )}
            
            {process.env.NODE_ENV === 'development' && (
              <div className='mt-6 p-4 bg-gray-100 rounded text-left overflow-auto max-h-60 text-xs'>
                <details>
                  <summary className='text-sm font-medium mb-2 cursor-pointer'>Error Details (Development Only)</summary>
                  <p className='text-red-600'>{errorMessage}</p>
                  {this.state.errorInfo && (
                    <pre className='mt-2 text-gray-700'>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
