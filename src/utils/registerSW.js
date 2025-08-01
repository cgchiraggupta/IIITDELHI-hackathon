import { registerSW } from 'virtual:pwa-register'

/**
 * Registers the service worker for PWA functionality
 * @param {Object} options Configuration options
 * @param {Function} options.onNeedRefresh Callback when update is available
 * @param {Function} options.onOfflineReady Callback when offline mode is ready
 * @param {Function} options.onRegistrationError Callback when registration fails
 * @returns {Object} An object containing the registration details and update function
 */
export const registerServiceWorker = ({
  onNeedRefresh,
  onOfflineReady,
  onRegistrationError
} = {}) => {
  // Skip registration during development if needed
  if (import.meta.env.DEV && !import.meta.env.VITE_PWA_DEV) {
    return {
      needRefresh: [false, () => {}],
      offlineReady: [false, () => {}],
      updateServiceWorker: () => {}
    }
  }

  let refreshing = false;
  
  // Handle service worker controlled page changes
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  const updateSW = registerSW({
    onNeedRefresh() {
      if (onNeedRefresh) onNeedRefresh();
    },
    onOfflineReady() {
      if (onOfflineReady) onOfflineReady();
    },
    onRegistered(registration) {
      // Force update check on first load
      if (registration) {
        // Check for updates every hour
        const updateInterval = setInterval(() => {
          registration.update().catch(console.error);
        }, 60 * 60 * 1000);
        
        // Store the interval ID for cleanup
        window.__updateServiceWorkerInterval = updateInterval;
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
      if (onRegistrationError) onRegistrationError(error);
    }
  });

  return updateSW;
}

/**
 * Checks if the app is currently offline
 * @returns {boolean} True if the app is offline, false otherwise
 */
export const checkOfflineStatus = () => {
  return !navigator.onLine
}

/**
 * Adds event listeners for online/offline status changes
 * @param {Function} callback Function to call when status changes with boolean parameter (true if offline)
 * @returns {Function} Function to remove the event listeners
 */
export const addOfflineStatusListener = (callback) => {
  const handleStatusChange = () => {
    callback(!navigator.onLine)
  }

  window.addEventListener('online', handleStatusChange)
  window.addEventListener('offline', handleStatusChange)

  return () => {
    window.removeEventListener('online', handleStatusChange)
    window.removeEventListener('offline', handleStatusChange)
  }
}