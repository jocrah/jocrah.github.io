//Service worker ES6 magic
let staticCacheName = 'jocrah-currency-cache-v35';

self.addEventListener('install', event => {
  let filesToCache = [
    '/', //for online version
    // '/jocrah.github.io/', //for offline version
    'css/index.css',
    'index.js',
    'css/icon.css',
    'css/material.indigo-pink.min.css',
    'js/material.min.js',
    'index.html'
  ];

  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(filesToCache))
  );
  console.log('Installed', event);
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.filter(cacheName => cacheName.startsWith('jocrah-currency-cache') &&
        cacheName != staticCacheName).map(cacheName => caches.delete(cacheName))
    ))
  )
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('from cache');
        return response;
      }
      console.log('from network');
      return fetch(event.request);
    })
  )
});