import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check for beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Handle app installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowInstall(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (window.installApp) {
      window.installApp();
      setShowInstall(false);
    }
  };

  if (isInstalled || !showInstall) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      className="hidden bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background font-semibold gap-2 h-10"
      title="Install Perth Saver as an app"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
}

declare global {
  interface Window {
    installApp?: () => void;
  }
}
