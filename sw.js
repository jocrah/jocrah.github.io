//Service worker ES6 magic
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
console.log('Activated', event);
});
