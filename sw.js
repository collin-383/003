// Bewusst denkbar einfach gehalten: KEIN Caching des Inhalts mehr.
// Frühere Versionen haben Inhalte zwischengespeichert, was dazu führte, dass
// Nutzer dauerhaft an einer veralteten Version hängen blieben. Diese Version
// existiert nur noch, damit die Seite als installierbare App gilt — sie liefert
// bei jeder Anfrage IMMER direkt und ungefiltert das Original aus dem Netz.
const CACHE_VERSION = 'projekt001-v3-no-cache';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
