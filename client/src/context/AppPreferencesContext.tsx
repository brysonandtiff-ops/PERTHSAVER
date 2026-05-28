import { createContext, useContext, useState, useEffect, useLayoutEffect, useRef } from "react";
import { forceRefreshCache } from "@/lib/cacheManager";
import { injectTokensToDOM, TOKEN_VERSION } from "@/lib/tokens";

export interface AppPreferences {
  theme: "dark" | "light" | "auto";
  accentColor: "cyan" | "teal" | "purple" | "orange";
  fontSize: "small" | "medium" | "large";
  compactMode: boolean;
  reducedMotion: boolean;
  soundEnabled: boolean;
  chromecastEnabled: boolean;
  chromecastDevices: CastDevice[];
  selectedCastDevice: CastDevice | null;
  animationLevel: "full" | "reduced" | "minimal";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    sound: boolean;
  };
}

export interface CastDevice {
  id: string;
  name: string;
  isConnected: boolean;
}

interface AppPreferencesContextType {
  preferences: AppPreferences;
  updatePreferences: (updates: Partial<AppPreferences>) => void;
  addCastDevice: (device: CastDevice) => void;
  removeCastDevice: (deviceId: string) => void;
  connectCastDevice: (deviceId: string) => void;
  disconnectCastDevice: () => void;
  resetTheme: () => void;
}

const defaultPreferences: AppPreferences = {
  theme: "dark",
  accentColor: "cyan",
  fontSize: "medium",
  compactMode: false,
  reducedMotion: false,
  soundEnabled: true,
  chromecastEnabled: false,
  chromecastDevices: [],
  selectedCastDevice: null,
  animationLevel: "full",
  notifications: {
    email: true,
    push: true,
    sms: false,
    sound: true,
  },
};

const AppPreferencesContext = createContext<AppPreferencesContextType | undefined>(undefined);

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AppPreferences>(() => {
    try {
      const saved = localStorage.getItem("app-preferences");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultPreferences, ...parsed };
      }
    } catch (e) {
      console.warn("Failed to load preferences from localStorage");
    }
    return defaultPreferences;
  });

  // Inject CSS tokens from tokens.ts on first mount
  useLayoutEffect(() => {
    injectTokensToDOM();
  }, []);

  // Apply theme IMMEDIATELY on mount before first paint using useLayoutEffect
  useLayoutEffect(() => {
    applyPreferences(preferences);
  }, []);

  // Save and apply on preference changes
  useEffect(() => {
    localStorage.setItem("app-preferences", JSON.stringify(preferences));
    applyPreferences(preferences);
  }, [preferences]);

  // Track if we've shown update notification
  const updateShownRef = useRef(false);

  // Listen for service worker cache updates and show toast
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'CACHE_UPDATED' && !updateShownRef.current) {
          updateShownRef.current = true;
          console.log('[App] Cache updated to version:', event.data.version);
          
          // Dispatch custom event that components can listen to for showing toast
          window.dispatchEvent(new CustomEvent('sw-update-available', { 
            detail: { version: event.data.version }
          }));
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  const updatePreferences = (updates: Partial<AppPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const resetTheme = async () => {
    console.log('[App] Resetting theme and clearing cache...');
    // Clear app preferences
    localStorage.removeItem("app-preferences");
    // Force cache refresh and reload
    await forceRefreshCache();
  };

  const addCastDevice = (device: CastDevice) => {
    setPreferences((prev) => ({
      ...prev,
      chromecastDevices: [
        ...prev.chromecastDevices.filter((d) => d.id !== device.id),
        device,
      ],
    }));
  };

  const removeCastDevice = (deviceId: string) => {
    setPreferences((prev) => ({
      ...prev,
      chromecastDevices: prev.chromecastDevices.filter((d) => d.id !== deviceId),
      selectedCastDevice:
        prev.selectedCastDevice?.id === deviceId ? null : prev.selectedCastDevice,
    }));
  };

  const connectCastDevice = (deviceId: string) => {
    const device = preferences.chromecastDevices.find((d) => d.id === deviceId);
    if (device) {
      setPreferences((prev) => ({
        ...prev,
        selectedCastDevice: { ...device, isConnected: true },
        chromecastEnabled: true,
      }));
    }
  };

  const disconnectCastDevice = () => {
    setPreferences((prev) => ({
      ...prev,
      selectedCastDevice: null,
      chromecastEnabled: false,
    }));
  };

  return (
    <AppPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        addCastDevice,
        removeCastDevice,
        connectCastDevice,
        disconnectCastDevice,
        resetTheme,
      }}
    >
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  }
  return context;
}

function applyPreferences(preferences: AppPreferences) {
  // Apply theme to documentElement
  const root = document.documentElement;
  
  // Set data-theme attribute for CSS targeting
  root.setAttribute('data-theme', preferences.theme);
  
  // Apply light/dark class
  if (preferences.theme === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }

  // Apply accent color via CSS variable
  root.style.setProperty("--accent-color", getAccentColorValue(preferences.accentColor));

  // Apply font size
  const fontSizeMap = {
    small: "14px",
    medium: "16px",
    large: "18px",
  };
  root.style.setProperty("--base-font-size", fontSizeMap[preferences.fontSize]);

  // Apply compact mode
  if (preferences.compactMode) {
    root.classList.add("compact-mode");
  } else {
    root.classList.remove("compact-mode");
  }

  // Apply reduced motion (respects prefers-reduced-motion + user preference)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (preferences.reducedMotion || prefersReducedMotion) {
    root.classList.add("reduce-motion");
    root.style.setProperty("--animation-duration", "0ms");
  } else {
    root.classList.remove("reduce-motion");
  }

  // Disable animations if needed
  if (preferences.animationLevel === "minimal") {
    root.style.setProperty("--animation-duration", "50ms");
  } else if (preferences.animationLevel === "reduced") {
    root.style.setProperty("--animation-duration", "200ms");
  } else {
    root.style.setProperty("--animation-duration", "300ms");
  }

  console.log('[Theme] Preferences applied:', {
    theme: preferences.theme,
    accentColor: preferences.accentColor,
    animationLevel: preferences.animationLevel,
  });
}

function getAccentColorValue(color: string): string {
  const colorMap: Record<string, string> = {
    cyan: "hsl(168 78% 40%)",
    teal: "hsl(167 71% 62%)",
    purple: "hsl(280 85% 50%)",
    orange: "hsl(38 92% 50%)",
  };
  return colorMap[color] || colorMap.cyan;
}
