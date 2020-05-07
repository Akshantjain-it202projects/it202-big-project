const cacheName = "Cache";
const assets = [
    "./",
    "./index.html",
    "./style.css",
//     "./script.js",
//     "./main_script.js",
    "./README.md",
    "./LICENSE",
    "./sw.js",
    "./site.webmanifest",
    "./favicon_io/android-chrome-192x192.png",
    "./favicon_io/android-chrome-512x512.png",
    "./favicon_io/apple-touch-icon.png",
    "./favicon_io/favicon-16x16.png",
    "./favicon_io/favicon-32x32.png",
    "./favicon_io/favicon.ico",
    "https://fonts.googleapis.com/css?family=Roboto%7CRoboto:medium",   
    "https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css",
    "https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.js",
    "https://fonts.googleapis.com/icon?family=Material+Icons&display=swap",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css",
    "https://npmcdn.com/dexie/dist/dexie.min.js",
    "https://code.jquery.com/jquery-3.4.1.slim.min.js",
    "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js",
    "https://code.jquery.com/jquery-3.5.0.min.js",
//     "https://www.gstatic.com/charts/loader.js",
//     "https://www.gstatic.com"
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