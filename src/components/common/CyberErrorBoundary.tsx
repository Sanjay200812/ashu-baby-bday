import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CyberErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CyberErrorBoundary caught error:', error, errorInfo);
  }

  private handleReboot = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#05070a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'var(--font-mono, monospace)',
            color: '#e2fce8',
          }}
        >
          <div
            className="terminal-panel"
            style={{
              maxWidth: '600px',
              width: '100%',
              padding: '28px',
              border: '1px solid #ff3344',
              boxShadow: '0 0 35px rgba(255, 51, 68, 0.3)',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: '#ff3344',
                fontSize: '1.2rem',
                fontWeight: 800,
                marginBottom: '16px',
                letterSpacing: '0.08em',
              }}
            >
              <AlertTriangle size={24} />
              <span>SOUTH_DEV_OS // SYSTEM ANOMALY</span>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>
              A security sub-routine encountered an unhandled execution breach.
            </p>

            {this.state.error && (
              <pre
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 51, 68, 0.4)',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#ff7080',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '24px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.toString()}
                {this.state.error.stack ? `\n\nStack:\n${this.state.error.stack}` : ''}
              </pre>
            )}

            <button
              onClick={this.handleReboot}
              className="btn-cyber-primary"
              style={{
                backgroundColor: 'rgba(255, 51, 68, 0.15)',
                borderColor: '#ff3344',
                color: '#ff3344',
                boxShadow: '0 0 20px rgba(255, 51, 68, 0.4)',
              }}
            >
              <RefreshCw size={16} />
              <span>[ EMERGENCY REBOOT // RESTORE SYSTEM ]</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

