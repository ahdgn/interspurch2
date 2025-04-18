// service-worker.js

const CACHE_NAME = 'intersolar-v3';
const URLS = [
  '/', '/index.html', '/offline.html',
  '/css/styles.css',
  '/js/app.js', '/js/db.js', '/js/ui.js',
  '/data/exposants.json',
  '/img/logo.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(URLS))
  );
});
self.addEventListener('activate', e => {
  clients.claim();
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_NAME)
        .map(k => caches.delete(k))
      )
    )
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(net => {
          if (net && net.status === 200 && e.request.url.startsWith(self.location.origin)) {
            const clone = net.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return net;
        })
        .catch(() => {
          if (e.request.mode === 'navigate' ||
              (e.request.headers.get('accept')||'').includes('text/html')) {
            return caches.match('/offline.html');
          }
        });
    })
  );
});
