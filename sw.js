const CACHE_NAME = "whats-cookin-cache-v1";
const CACHED_URLS = [
    // "css/materialize.min.css",
    // "css/styles.css",
    // "https://fonts.googleapis.com/icon?family=Material+Icons",
    // "https://fonts.gstatic.com/s/materialicons/v143/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
    // "/img/icons/icon-144.png",
    // "img/kwmcontacts.png",
    // "js/app.js",
    // "js/common.js",
    // "js/materialize.min.js",
    // "pages/about.html",
    // "index.html",
    // "/",
    // "manifest.webmanifest",
    // "favicon.ico",
    "/",                    // Root-Seite
    "index.html",           // Startseite
    "manifest.webmanifest", // PWA-Konfiguration
    "styles/styles.css",
    "styles/index_styles.css",
    "styles/ingredients-input_styles.css",
    "styles/recipe-detail_styles.css",
    "styles/recipe-suggestions_styles.css",
    "js/app.js",            // dein Haupt-JavaScript
    "js/recipe-suggestions.js",
    "img/logo.png",         // Logo oder Startbild
    "pages/ingredients-input.html",     // Beispielseite
    "pages/recipe-detail.html",
    "pages/recipe-suggestions.html",
    "pages/saved-recipes.html"
];

self.addEventListener("install", function(event) {
    console.log("Service Worker installing.");
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(c) {
            return c.addAll(CACHED_URLS);
        }).catch((err)=>{
            console.error(err);
        })
    );
})

// Network first, falling back to cache strategy
self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request).then(function(response) {
                return response;
            });
        })
    );
});

self.addEventListener("activate",(event)=>{
    event.waitUntil(
        caches.keys().then((cacheNames)=>{
            return Promise.all(
                cacheNames.map((cacheName)=>{
                    if(CACHE_NAME !== cacheName && cacheName.startsWith("whats-cookin-cache")){
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
