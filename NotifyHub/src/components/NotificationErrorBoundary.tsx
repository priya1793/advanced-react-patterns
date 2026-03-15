import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class NotificationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[NotificationErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              padding: "24px 16px",
              textAlign: "center",
              color: "hsl(0 0% 42%)",
              fontSize: "0.8125rem",
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Unable to load notifications
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                color: "hsl(217 100% 52%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8125rem",
                fontWeight: 500,
              }}
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
