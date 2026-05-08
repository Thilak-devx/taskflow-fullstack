import { Component } from "react";
import BrandMark from "./BrandMark";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("TaskFlow UI crashed", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-[2rem] glass-panel p-8 text-center">
            <div className="flex justify-center">
              <BrandMark compact />
            </div>
            <p className="text-sm uppercase tracking-[0.45em] text-rose-300">UI Recovery</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">Something went wrong</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              The interface hit an unexpected issue. Refresh the page to restore the workspace.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-2xl bg-brand-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-300"
            >
              Reload TaskFlow
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
