import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-3 sm:px-4">
      <Card className="w-full max-w-md glass-card">
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-slate-500/20">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">404 Page Not Found</h1>
          </div>

          <p className="text-sm text-white/60 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link href="/">
            <Button className="btn-premium">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
