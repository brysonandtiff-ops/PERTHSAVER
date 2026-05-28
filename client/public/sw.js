/**
 * Perth Saver Service Worker
 * 
 * CACHE VERSION MANAGEMENT:
 * ========================
 * When updating theme tokens, CSS variables, or critical UI changes:
 * 1. INCREMENT CACHE_VERSION below (e.g., 21 → 22)
 * 2. This triggers activate handler which:
 *    - Deletes ALL old caches
 *    - Sends CACHE_UPDATED message to all clients
 *    - Clients perform hard refresh to fetch fresh assets
 * 
 * Do NOT manually edit cache names - let CACHE_VERSION auto-generate them
 */

const CACHE_VERSION = 25;
const CACHE_NAME = `perth-saver-v${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
];

// Data cache for offline access
const DATA_CACHE_NAME = `perth-saver-data-v${CACHE_VERSION}`;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Development detection - bypass caching in development
const isDev = self.location.hostname === 'localhost' || 
              self.location.hostname.includes('.replit.dev') ||
              self.location.hostname.includes('.repl.co');

console.log(`[SW] Service Worker loaded. Cache version: ${CACHE_VERSION}, Dev mode: ${isDev}`);

// Listen for SKIP_WAITING message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING, activating immediately');
    self.skipWaiting();
  }
});

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing cache version ${CACHE_VERSION}`);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        console.log('[SW] Some assets failed to cache');
      });
    })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches and notify clients
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating cache version ${CACHE_VERSION}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Delete ALL old caches aggressively - this ensures fresh assets on version bump
        ...cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }),
        // Notify all clients of cache update - triggers page reload
        self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
          clients.forEach((client) => {
            console.log('[SW] Sending CACHE_UPDATED to client');
            client.postMessage({ type: 'CACHE_UPDATED', version: CACHE_VERSION });
          });
        })
      ]);
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - ALWAYS network-first in development, smart caching in production
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // In development: ALWAYS use network first for everything
  if (isDev) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }

  // API calls - stale-while-revalidate with offline fallback
  if (event.request.url.includes('/api/')) {
    // Read-only GET endpoints can be cached for offline
    const cacheableEndpoints = [
      '/api/product-prices',
      '/api/deals',
      '/api/fuel',
      '/api/categories',
    ];
    
    const isCacheable = cacheableEndpoints.some(ep => event.request.url.includes(ep));
    
    if (isCacheable) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return cache.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
              })
              .catch(() => null);
            
            return cachedResponse || fetchPromise || new Response(
              JSON.stringify({ error: 'Offline - data unavailable' }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
      );
      return;
    }
    
    // Non-cacheable API calls
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Offline - data unavailable' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Network-first strategy for JavaScript and CSS (production builds only)
  // This ensures fresh code/styles are always fetched, but cached as fallback
  if (event.request.url.match(/\.(js|css)$/) && !event.request.url.includes('/@')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful, non-opaque responses
          if (response && response.status === 200 && response.type !== 'opaque') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first for other assets (images, fonts, etc)
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache it
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback
          return caches.match('/offline.html').then((response) => {
            return response || new Response('Offline - Please check your connection');
          });
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-alerts') {
    event.waitUntil(syncAlerts());
  }
});

async function syncAlerts() {
  try {
    const response = await fetch('/api/sync-alerts', { method: 'POST' });
    return response.json();
  } catch (error) {
    console.log('Sync failed, will retry', error);
    throw error;
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const options = {
    body: data.body || 'New deal available!',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/badge-72x72.svg',
    tag: data.tag || 'perth-saver-notification',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Perth Saver', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // If a window is already open, focus it
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].url === event.notification.data.url && 'focus' in clients[i]) {
          return clients[i].focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
