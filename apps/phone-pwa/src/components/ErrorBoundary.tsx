import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '8px', margin: '20px' }}>
          <h2 style={{ color: '#cf1322', fontSize: '16px', marginBottom: '8px' }}>Something went wrong.</h2>
          <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap', color: '#595959' }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '12px', padding: '8px 16px', background: '#cf1322', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
