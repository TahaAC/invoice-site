self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('invoice-cache-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html', // Add the correct name of your HTML file
        '/logo.png'
        // Add other assets like CSS and JS files if they are separate
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
