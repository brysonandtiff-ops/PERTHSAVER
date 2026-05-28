import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
        <p className="text-white/60 text-sm font-medium animate-pulse">
          Loading Perth Saver...
        </p>
      </div>
    </div>
  );
}
