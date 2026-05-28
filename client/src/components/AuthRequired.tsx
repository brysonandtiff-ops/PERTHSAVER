import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ShieldAlert, LogIn } from "lucide-react";

interface AuthRequiredProps {
  message?: string;
}

export function AuthRequired({ message = "Please login to access this page" }: AuthRequiredProps) {
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    setLocation(`/auth?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="glass border-white/10 max-w-md w-full" data-testid="card-auth-required">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-2xl font-display font-bold text-white mb-3" data-testid="text-auth-title">
            Authentication Required
          </h2>
          
          <p className="text-white/60 mb-6" data-testid="text-auth-message">
            {message}
          </p>
          
          <Button
            onClick={handleLogin}
            className="bg-primary hover:bg-primary/90 text-white w-full"
            data-testid="button-login"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login to Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
