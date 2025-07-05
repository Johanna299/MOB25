const CACHE_NAME = "whats-cookin-cache-v3";
const CACHED_URLS = [
    "/",
    "index.html",
    "manifest.webmanifest",
    "styles/styles.css",
    "styles/index_styles.css",
    "styles/ingredients-input_styles.css",
    "styles/recipe-detail_styles.css",
    "styles/recipe-suggestions_styles.css",
    "js/app.js",
    "js/recipe-suggestions.js",
    "img/logo.png",
    "favicon.ico",
    "pages/ingredients-input.html",
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
