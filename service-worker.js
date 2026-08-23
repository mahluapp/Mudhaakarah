const CACHE_NAME = 'mudhakara-kids-v2.0.0.1';

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
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
