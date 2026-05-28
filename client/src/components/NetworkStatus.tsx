import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium ${
            isOnline
              ? "bg-emerald-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
          role="status"
          aria-live="polite"
        >
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <span>Back online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>You're offline - Some features may be limited</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
