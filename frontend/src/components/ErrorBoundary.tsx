import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                    <div className="glass-card max-w-lg rounded-2xl p-8 shadow-premium text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                        </div>

                        <h1 className="mb-3 font-['Space_Grotesk'] text-2xl font-bold text-slate-900">
                            Oops! Something went wrong
                        </h1>

                        <p className="mb-6 text-slate-600">
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>

                        {this.state.error && (
                            <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
                                <p className="font-mono text-xs text-red-800">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                onClick={this.handleReset}
                                className="btn-primary flex items-center justify-center gap-2 rounded-xl px-6 py-3"
                            >
                                <RefreshCw size={18} />
                                Try Again
                            </button>

                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="btn-secondary rounded-xl px-6 py-3"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
