import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to service if needed
    // console.error(error, errorInfo);
  }

  handleClose = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <Snackbar open autoHideDuration={6000} onClose={this.handleClose}>
          <Alert onClose={this.handleClose} severity="error" sx={{ width: '100%' }}>
            {this.state.error.message}
          </Alert>
        </Snackbar>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
