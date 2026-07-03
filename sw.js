// Cache-Version bei jeder inhaltlichen Änderung erhöhen (v1 -> v2 -> v3 ...),
// sonst bleiben Nutzer dauerhaft an einer alten, gecachten Version hängen!
const CACHE_NAME = 'projekt001-cache-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Netzwerk-zuerst-Strategie: Immer die aktuellste Version aus dem Netz laden,
// wenn online. Nur bei fehlender Verbindung auf die gecachte Version zurückfallen.
// (Vorher: Cache-zuerst -> Nutzer sahen dauerhaft eine veraltete Version.)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
