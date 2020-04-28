const cacheName = "Cache"
const assets = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/sw.js",
    "README.md",
    "/LICENSE",
    "/site.webmanifest",
    "/favicon_io/android-chrome-192x192.png",
    "/favicon_io/android-chrome-512x512.png",
    "/favicon_io/apple-touch-icon.png",
    "/favicon_io/favicon-16x16.png",
    "/favicon_io/favicon-32x32.png",
    "/favicon_io/favicon.ico",
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return (res || fetch(fetchEvent.request));
        })
    )
});