import { Component } from "react";
import { ErrorState } from "./ErrorState";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("UI crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <ErrorState message="Unexpected UI failure occurred. Please refresh the app." />
        </div>
      );
    }
    return this.props.children;
  }
}
