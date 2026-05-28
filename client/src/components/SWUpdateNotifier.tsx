import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

export function SWUpdateNotifier() {
  useEffect(() => {
    const handleSWUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ version: number }>;
      
      toast({
        title: "New version available!",
        description: "A new version of Perth Saver is ready. Click refresh to update.",
        action: (
          <button
            onClick={() => {
              window.location.href = window.location.pathname + '?' + Date.now();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors"
            data-testid="button-sw-refresh"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        ),
        duration: Infinity,
      });
    };

    window.addEventListener('sw-update-available', handleSWUpdate);
    return () => {
      window.removeEventListener('sw-update-available', handleSWUpdate);
    };
  }, []);

  return null;
}
