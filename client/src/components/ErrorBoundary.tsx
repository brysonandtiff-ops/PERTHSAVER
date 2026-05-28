import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReportIssue = () => {
    const { error, errorInfo } = this.state;
    const errorDetails = `
Error: ${error?.message || "Unknown error"}
Stack: ${error?.stack || "No stack trace"}
Component Stack: ${errorInfo?.componentStack || "No component stack"}
    `.trim();

    console.group("🐛 Error Report");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.groupEnd();

    const mailtoLink = `mailto:support@perthsaver.com?subject=Error Report&body=${encodeURIComponent(errorDetails)}`;
    window.location.href = mailtoLink;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4" data-testid="error-boundary">
          <Card className="glass-strong border-white/10 max-w-lg w-full">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-red-500/10 backdrop-blur-sm">
                  <AlertTriangle className="h-16 w-16 text-red-400" data-testid="error-boundary-icon" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-display font-bold text-white" data-testid="error-boundary-title">
                  Oops! Something went wrong
                </h1>
                <p className="text-white/70 leading-relaxed" data-testid="error-boundary-message">
                  We encountered an unexpected error. Don't worry, your data is safe. 
                  Try reloading the page or return to the home screen.
                </p>
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm text-white/50 hover:text-white/70">
                      Show error details (dev only)
                    </summary>
                    <pre className="mt-2 p-3 bg-black/30 rounded-lg text-xs text-red-300 overflow-auto max-h-40">
                      {this.state.error.message}
                      {"\n\n"}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-primary hover:bg-primary/90 text-white w-full touch-target gap-2"
                  data-testid="button-reload"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={this.handleReportIssue}
                    className="border-white/20 text-white hover:bg-white/10 flex-1 touch-target gap-2"
                    data-testid="button-report"
                  >
                    <Bug className="h-4 w-4" />
                    Report Issue
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      this.setState({ hasError: false });
                      window.location.href = "/";
                    }}
                    className="border-white/20 text-white hover:bg-white/10 flex-1 touch-target gap-2"
                    data-testid="button-home"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
