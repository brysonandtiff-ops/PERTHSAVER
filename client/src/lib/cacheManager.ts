/**
 * Cache Manager - Handles service worker registration and cache updates
 * 
 * IMPORTANT: When updating theme tokens or CSS that should reflect immediately:
 * 1. Bump CACHE_VERSION in /client/public/sw.js
 * 2. This triggers cache invalidation and forces a reload
 * 
 * Development builds skip SW registration to allow live reload
 */

const CACHE_REFRESH_KEY = 'perth-saver-last-refresh';

// Detect if running in development
const isDev = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname.includes('.replit.dev') ||
    window.location.hostname.includes('.repl.co') ||
    import.meta.env.DEV
  );
};

export function initCacheManager() {
  // Skip SW registration in development - use Vite HMR instead
  if (isDev()) {
    console.log('[Cache] Development mode - SW registration skipped');
    return;
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('[Cache] Service Workers not supported');
    return;
  }

  // Register service worker only in production
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then((registration) => {
      console.log('[Cache] Service Worker registered:', registration.scope);
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 30000);

      // Handle when a new service worker is installed
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            // New SW installed and old SW still controlling page
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[Cache] New service worker installed, requesting activation...');
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error('[Cache] Service Worker registration failed:', error);
    });

  // Listen for CACHE_UPDATED message from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'CACHE_UPDATED') {
      console.log('[Cache] Cache updated to version:', event.data.version);
      console.log('[Cache] Performing full page reload to fetch fresh assets...');
      // Force hard refresh to bypass browser cache and get fresh CSS/JS
      window.location.href = window.location.pathname + '?' + Date.now();
    }
  });
}

export function forceRefreshCache(): Promise<void> {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.keys().then((names) => {
        Promise.all(names.map((name) => caches.delete(name))).then(() => {
          navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration) {
              registration.unregister().then(() => {
                localStorage.setItem(CACHE_REFRESH_KEY, Date.now().toString());
                // Hard refresh
                window.location.href = window.location.pathname + '?' + Date.now();
                resolve();
              });
            } else {
              window.location.href = window.location.pathname + '?' + Date.now();
              resolve();
            }
          });
        });
      });
    } else {
      window.location.href = window.location.pathname + '?' + Date.now();
      resolve();
    }
  });
}

export function getLastRefreshTime(): number {
  const stored = localStorage.getItem(CACHE_REFRESH_KEY);
  return stored ? parseInt(stored, 10) : 0;
}
