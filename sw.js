//Service worker ES6 magic


self.addEventListener('install', function(event) {
  var filesToCache = [
    '/',
    'css/index.css',
    'index.js',
    'css/icon.css',
    'css/material.indigo-pink.min.css',
    'js/material.min.js',
    'index.html'
  ];
  
  var staticCacheName ='pages-cache-v1';  
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(function(cache){
      return cache.addAll(filesToCache);
    })
  );
  console.log('Installed', event);
});


self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      if(response){
        console.log('from cache');
        return response;
      }
      console.log('from network');
      return fetch(event.request);
    })
  )
});


