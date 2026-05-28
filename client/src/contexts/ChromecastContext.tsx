import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ChromecastContextType {
  isAvailable: boolean;
  isConnected: boolean;
  deviceName: string | null;
  connect: () => void;
  disconnect: () => void;
  castUrl: (url: string) => void;
}

const ChromecastContext = createContext<ChromecastContextType | undefined>(undefined);

declare global {
  interface Window {
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
    cast?: {
      framework: {
        CastContext: {
          getInstance: () => {
            setOptions: (options: { receiverApplicationId: string; autoJoinPolicy: number }) => void;
            getCurrentSession: () => { getMediaSession: () => unknown } | null;
            requestSession: () => Promise<void>;
            endCurrentSession: (stopCasting: boolean) => void;
            getCastState: () => string;
          };
        };
        CastState: {
          NOT_CONNECTED: string;
          CONNECTED: string;
        };
        AutoJoinPolicy: {
          ORIGIN_SCOPED: number;
        };
      };
    };
    chrome?: {
      cast: {
        DEFAULT_MEDIA_RECEIVER_APP_ID: string;
        media: {
          MediaInfo: new (contentId: string, contentType: string) => unknown;
          LoadRequest: new (mediaInfo: unknown) => unknown;
        };
      };
    };
  }
}

export function ChromecastProvider({ children }: { children: React.ReactNode }) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);

  useEffect(() => {
    const loadCastScript = () => {
      if (document.querySelector('script[src*="cast_sender"]')) {
        return;
      }

      window.__onGCastApiAvailable = (available: boolean) => {
        if (available && window.cast && window.chrome?.cast) {
          try {
            const castContext = window.cast.framework.CastContext.getInstance();
            castContext.setOptions({
              receiverApplicationId: window.chrome.cast.DEFAULT_MEDIA_RECEIVER_APP_ID,
              autoJoinPolicy: window.cast.framework.AutoJoinPolicy.ORIGIN_SCOPED,
            });
            setIsAvailable(true);
          } catch (error) {
            console.log('Chromecast initialization skipped:', error);
            setIsAvailable(false);
          }
        }
      };

      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
      script.async = true;
      script.onerror = () => {
        setIsAvailable(false);
      };
      document.head.appendChild(script);
    };

    loadCastScript();
  }, []);

  const connect = useCallback(async () => {
    if (!isAvailable || !window.cast) return;

    try {
      const castContext = window.cast.framework.CastContext.getInstance();
      await castContext.requestSession();
      setIsConnected(true);
      setDeviceName('Connected Device');
    } catch (error) {
      console.log('Failed to connect to Chromecast:', error);
    }
  }, [isAvailable]);

  const disconnect = useCallback(() => {
    if (!isAvailable || !window.cast) return;

    try {
      const castContext = window.cast.framework.CastContext.getInstance();
      castContext.endCurrentSession(true);
      setIsConnected(false);
      setDeviceName(null);
    } catch (error) {
      console.log('Failed to disconnect from Chromecast:', error);
    }
  }, [isAvailable]);

  const castUrl = useCallback((_url: string) => {
    if (!isConnected || !window.cast || !window.chrome?.cast) {
      console.log('Cannot cast: not connected');
      return;
    }
    console.log('Casting is available for media content');
  }, [isConnected]);

  return (
    <ChromecastContext.Provider
      value={{
        isAvailable,
        isConnected,
        deviceName,
        connect,
        disconnect,
        castUrl,
      }}
    >
      {children}
    </ChromecastContext.Provider>
  );
}

export function useChromecast() {
  const context = useContext(ChromecastContext);
  if (context === undefined) {
    throw new Error('useChromecast must be used within a ChromecastProvider');
  }
  return context;
}
