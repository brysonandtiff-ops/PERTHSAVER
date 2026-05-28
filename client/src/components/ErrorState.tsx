import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  WifiOff, 
  Lock, 
  FileQuestion, 
  ServerCrash, 
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Home
} from "lucide-react";

export type ErrorType = "network" | "auth" | "not-found" | "server" | "validation";

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  showHomeButton?: boolean;
}

const ERROR_CONFIGS: Record<ErrorType, {
  icon: React.ComponentType<{ className?: string }>;
  defaultTitle: string;
  defaultMessage: string;
  color: string;
}> = {
  network: {
    icon: WifiOff,
    defaultTitle: "Connection Issue",
    defaultMessage: "We're having trouble connecting. Please check your internet connection and try again.",
    color: "text-purple-400",
  },
  auth: {
    icon: Lock,
    defaultTitle: "Authentication Required",
    defaultMessage: "You need to be logged in to access this content. Please sign in and try again.",
    color: "text-purple-400",
  },
  "not-found": {
    icon: FileQuestion,
    defaultTitle: "Not Found",
    defaultMessage: "We couldn't find what you're looking for. It may have been moved or deleted.",
    color: "text-slate-400",
  },
  server: {
    icon: ServerCrash,
    defaultTitle: "Server Error",
    defaultMessage: "Something went wrong on our end. We're working to fix it. Please try again in a moment.",
    color: "text-red-400",
  },
  validation: {
    icon: AlertCircle,
    defaultTitle: "Invalid Request",
    defaultMessage: "The information provided appears to be invalid. Please check your input and try again.",
    color: "text-cyan-400",
  },
};

export function ErrorState({
  type = "server",
  title,
  message,
  onRetry,
  onBack,
  showHomeButton = false,
}: ErrorStateProps) {
  const config = ERROR_CONFIGS[type];
  const Icon = config.icon;

  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4" data-testid="error-state">
      <Card className="glass border-white/10 max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-white/5 backdrop-blur-sm">
              <Icon className={`h-12 w-12 ${config.color}`} data-testid="error-icon" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 
              className="text-2xl font-display font-bold text-white" 
              data-testid="error-title"
            >
              {displayTitle}
            </h2>
            <p 
              className="text-white/70 text-sm leading-relaxed" 
              data-testid="error-message"
            >
              {displayMessage}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-primary hover:bg-primary/90 text-white w-full touch-target gap-2"
                data-testid="button-retry"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}

            <div className="flex gap-2">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 flex-1 touch-target gap-2"
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              )}

              {showHomeButton && (
                <Button
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 flex-1 touch-target gap-2"
                  data-testid="button-home"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
