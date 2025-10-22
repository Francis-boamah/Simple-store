const CACHE_NAME = 'simple-store-v1';
const FILES_TO_CACHE = [
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];
self.addEventListener('install', evt=>{
  evt.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES_TO_CACHE)));
});
self.addEventListener('fetch', evt=>{
  evt.respondWith(caches.match(evt.request).then(r=> r || fetch(evt.request)));
});

