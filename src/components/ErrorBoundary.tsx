import React from 'react';

type State = { hasError: boolean; error?: Error | null };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-red-600">Analytics failed to load</h3>
          <p className="text-sm text-gray-600">An unexpected error occurred while rendering the analytics panel. The error has been logged to the console.</p>
          <pre className="mt-3 text-xs text-gray-800 bg-gray-50 p-3 rounded overflow-auto">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children as any;
  }
}

export default ErrorBoundary;
