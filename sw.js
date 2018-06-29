//Service worker ES6 magic

let filesToCache = [
  'css/index.css',
  'js/index.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css',
  'https://code.getmdl.io/1.3.0/material.min.js',
  'index.html'
];

let staticCacheName ='pages-cache-v1';

self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(function(cache){
      return cache.addAll(filesToCache);
    })
  );
  console.log('Installed', event);
});

// self.addEventListener('activate', function(event) {
// console.log('Activated', event);
// });

