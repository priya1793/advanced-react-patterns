import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary specialized for Slate editor.
 * Catches Path errors common in collaborative race conditions
 * and offers a graceful re-sync.
 */
export class EditorErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Synapse EditorErrorBoundary]", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-fallback">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--error)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2 className="error-fallback__title">Something went wrong</h2>
          <p className="error-fallback__message">
            {this.state.error?.message?.includes("Path")
              ? "A collaboration conflict occurred. Click below to re-sync the document."
              : "An unexpected error occurred in the editor."}
          </p>
          <button className="error-fallback__btn" onClick={this.handleRetry}>
            Re-sync Document
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
