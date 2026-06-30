import { Component } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    console.error("LegacyLock UI error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="app-shell center-screen">
        <section className="glass-card auth-state-card forbidden-card">
          <div className="auth-success-icon danger-icon">
            <TriangleAlert size={34} />
          </div>

          <p className="eyebrow">Something went wrong</p>

          <h1>LegacyLock could not render this screen.</h1>

          <p className="muted">
            Please refresh the page. If the issue continues, try signing in again or contact support.
          </p>

          <button className="glass-button primary full-button" onClick={this.handleReload}>
            <RefreshCw size={17} />
            Refresh page
          </button>
        </section>
      </main>
    );
  }
}
