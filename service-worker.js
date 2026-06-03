const CACHE_NAME = 'mudhakara-v6';

const FILES_TO_CACHE = [
  '/Mudhaakarah/',
  '/Mudhaakarah/index.html',
  '/Mudhaakarah/manifest.json',
  '/Mudhaakarah/icon-192.png',
  '/Mudhaakarah/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Ne pas intercepter les requêtes non-GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;

      return fetch(event.request).then(networkResponse => {
        // Mettre en cache uniquement les requêtes de notre domaine
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback offline : retourner index.html pour la navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/Mudhaakarah/index.html');
        }
      });
    })
  );
});
