'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ProductError() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Available</h2>
        <p className="text-muted-foreground">
          The product you're looking for could not be loaded.
        </p>
        <Button asChild>
          <a href="/products">Browse Products</a>
        </Button>
      </div>
    </div>
  );
}

export function CollectionError() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Collection Not Available</h2>
        <p className="text-muted-foreground">
          The collection you're looking for could not be loaded.
        </p>
        <Button asChild>
          <a href="/collections">Browse Collections</a>
        </Button>
      </div>
    </div>
  );
}

