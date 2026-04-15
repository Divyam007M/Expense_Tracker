import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-500 text-sm mb-4">
              The app failed to load. This is usually caused by missing environment variables on the server.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left text-xs text-red-800 font-mono break-all mb-6">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              If you are the developer: make sure <strong>VITE_SUPABASE_URL</strong>,{' '}
              <strong>VITE_SUPABASE_PUBLISHABLE_KEY</strong>, and{' '}
              <strong>VITE_GROQ_API_KEY</strong> are set in your Vercel / deployment environment variables.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
