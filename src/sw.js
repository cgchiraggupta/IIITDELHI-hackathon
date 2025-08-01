import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Use with precache injection
self.__WB_MANIFEST = self.__WB_MANIFEST || [];
precacheAndRoute(self.__WB_MANIFEST);

// Cache page navigations (html) with a Network First strategy
registerRoute(
  // Check to see if the request is a navigation to a new page
  ({ request }) => request.mode === 'navigate',
  // Use a Network First caching strategy
  new NetworkFirst({
    // Put all cached files in a cache named 'pages'
    cacheName: 'pages',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      // Don't cache more than 50 items, and expire them after 24 hours
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  }),
);

// Fallback to offline page
const networkFirstHandler = new NetworkFirst({
  cacheName: 'pages',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [200],
    }),
  ],
});

const navigationHandler = async (params) => {
  try {
    // Attempt to get the resource from the network
    return await networkFirstHandler.handle(params);
  } catch (error) {
    // If offline, return the offline page from the cache
    return caches.match('/offline.html');
  }
};

// Register this strategy for all navigations
registerRoute(new NavigationRoute(navigationHandler));

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
  }),
);

// Cache images with a Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
  }),
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

// Function to sync stored reports when back online
async function syncReports() {
  try {
    const cache = await caches.open('offline-reports');
    const requests = await cache.keys();
    
    const syncPromises = requests.map(async (request) => {
      const response = await cache.match(request);
      const formData = await response.json();
      
      // Attempt to send the data to the server
      const serverResponse = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (serverResponse.ok) {
        // If successful, remove from the cache
        return cache.delete(request);
      }
      
      return Promise.resolve();
    });
    
    return Promise.all(syncPromises);
  } catch (error) {
    console.error('Sync failed:', error);
  }
}