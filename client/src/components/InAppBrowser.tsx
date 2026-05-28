import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Shield, AlertTriangle, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InAppBrowserProps {
  url: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (url: string) => void;
}

const ALLOWLISTED_DOMAINS = [
  "woolworths.com.au",
  "coles.com.au",
  "aldi.com.au",
  "spudshed.com.au",
  "iga.com.au",
  "farmerjacks.com.au",
  "bunnings.com.au",
  "kmart.com.au",
  "bigw.com.au",
  "target.com.au",
  "officeworks.com.au",
  "jbhifi.com.au",
  "harveynorman.com.au",
  "thegoodguys.com.au",
  "costco.com.au",
  "amazon.com.au",
  "ebay.com.au",
  "catch.com.au",
  "ikea.com.au",
  "spotlight.com.au",
  "fuelwatch.wa.gov.au",
  "7eleven.com.au",
  "ampol.com.au",
  "synergy.net.au",
  "kleenheat.com.au",
  "alintaenergy.com.au",
  "watercorporation.com.au",
  "perthnow.com.au",
  "ozbargain.com.au",
  "lasoo.com.au",
  "shopadocket.com.au",
  "chemistwarehouse.com.au",
  "priceline.com.au",
  "bcf.com.au",
  "anacondastores.com",
  "repco.com.au",
  "supercheapauto.com.au",
];

function isAllowlisted(url: string): boolean {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return ALLOWLISTED_DOMAINS.some(d => domain.includes(d) || domain.endsWith(d));
  } catch {
    return false;
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function InAppBrowser({ url, title, isOpen, onClose, onNavigate }: InAppBrowserProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [displayedDomain, setDisplayedDomain] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [isSecure, setIsSecure] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const startTime = useRef<number>(Date.now());
  const navigationCheckInterval = useRef<NodeJS.Timeout | null>(null);

  const canGoBack = historyStack.length > 0;

  const checkNavigation = useCallback(() => {
    if (!iframeRef.current || !isOpen) return;
    
    try {
      const iframeDoc = iframeRef.current.contentDocument;
      const iframeWin = iframeRef.current.contentWindow;
      
      if (iframeDoc && iframeWin) {
        const newUrl = iframeWin.location.href;
        
        if (newUrl !== currentUrl && newUrl !== "about:blank") {
          if (!isAllowlisted(newUrl)) {
            setIsBlocked(true);
            iframeRef.current.src = currentUrl;
          } else {
            setHistoryStack(prev => [...prev, currentUrl]);
            setCurrentUrl(newUrl);
            setDisplayedDomain(getDomain(newUrl));
            setIsSecure(newUrl.startsWith("https://"));
            setShowWarning(!isAllowlisted(newUrl));
          }
        }
      }
    } catch {
      setDisplayedDomain(getDomain(currentUrl));
    }
  }, [currentUrl, isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (!isAllowlisted(url)) {
        setIsBlocked(true);
        return;
      }
      
      setCurrentUrl(url);
      setDisplayedDomain(getDomain(url));
      setIsLoading(true);
      setHistoryStack([]);
      setIsBlocked(false);
      startTime.current = Date.now();
      setIsSecure(url.startsWith("https://"));
      setShowWarning(false);
      
      navigationCheckInterval.current = setInterval(checkNavigation, 500);
    }
    
    return () => {
      if (navigationCheckInterval.current) {
        clearInterval(navigationCheckInterval.current);
        navigationCheckInterval.current = null;
      }
    };
  }, [url, isOpen, checkNavigation]);

  const handleLoad = () => {
    setIsLoading(false);
    checkNavigation();
  };

  const handleGoBack = () => {
    if (historyStack.length > 0) {
      const previousUrl = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));
      setCurrentUrl(previousUrl);
      setDisplayedDomain(getDomain(previousUrl));
      if (iframeRef.current) {
        iframeRef.current.src = previousUrl;
      }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIsBlocked(false);
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  const handleOpenExternal = () => {
    window.open(currentUrl, "_blank", "noopener,noreferrer");
  };

  const handleClose = () => {
    if (navigationCheckInterval.current) {
      clearInterval(navigationCheckInterval.current);
      navigationCheckInterval.current = null;
    }
    onNavigate?.(currentUrl);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 top-12 bg-slate-900 rounded-t-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-9 w-9 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  data-testid="button-browser-close"
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!canGoBack}
                  onClick={handleGoBack}
                  className="h-9 w-9 rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
                  data-testid="button-browser-back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  className="h-9 w-9 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  data-testid="button-browser-refresh"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 mx-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                  {isBlocked ? (
                    <Ban className="h-4 w-4 text-red-400" />
                  ) : isSecure ? (
                    <Shield className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-cyan-400" />
                  )}
                  <span className="text-sm text-white/70 truncate flex-1">
                    {displayedDomain || getDomain(currentUrl)}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenExternal}
                className="h-9 w-9 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                data-testid="button-browser-external"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            {showWarning && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="px-4 py-3 bg-cyan-500/10 flex items-center gap-3"
              >
                <AlertTriangle className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <p className="text-sm text-amber-200">
                  This site is not a verified partner. Browse with caution.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWarning(false)}
                  className="ml-auto text-cyan-400 hover:text-cyan-300"
                >
                  Dismiss
                </Button>
              </motion.div>
            )}

            {isLoading && (
              <div className="absolute inset-x-0 top-14 h-1 bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                  initial={{ width: "0%" }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>
            )}

            {isBlocked ? (
              <div className="flex flex-col items-center justify-center h-full bg-slate-900 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6"
                >
                  <Ban className="h-10 w-10 text-red-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">Site Not Allowed</h3>
                <p className="text-white/60 mb-6 max-w-sm">
                  This website is not on our verified partner list. For your security, we only allow browsing to trusted Perth retail and utility sites.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleGoBack}
                    disabled={!canGoBack}
                    variant="outline"
                    className="text-white hover:bg-white/10"
                    data-testid="button-blocked-back"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                  <Button
                    onClick={handleOpenExternal}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    data-testid="button-blocked-external"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Browser
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full pb-safe">
                <iframe
                  ref={iframeRef}
                  src={currentUrl}
                  className="w-full h-full bg-white"
                  onLoad={handleLoad}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  referrerPolicy="no-referrer"
                  title={title || "In-App Browser"}
                  data-testid="iframe-browser"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useBrowser() {
  const [isOpen, setIsOpen] = useState(false);
  const [browserUrl, setBrowserUrl] = useState("");
  const [browserTitle, setBrowserTitle] = useState("");

  const openUrl = (url: string, title?: string) => {
    setBrowserUrl(url);
    setBrowserTitle(title || "");
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    browserUrl,
    browserTitle,
    openUrl,
    close,
    BrowserComponent: () => (
      <InAppBrowser
        url={browserUrl}
        title={browserTitle}
        isOpen={isOpen}
        onClose={close}
      />
    ),
  };
}
