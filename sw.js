const CACHE_NAME = "whats-cookin-cache-v6";
const CACHED_URLS = [
    "/",
    "index.html",
    "manifest.webmanifest",
    "styles/styles.css",
    "styles/index_styles.css",
    "styles/recipe-detail_styles.css",
    "styles/recipe-suggestions_styles.css",
    "js/app.js",
    "js/indexeddb.js",
    "js/recipe-detail.js",
    "js/saved-recipes.js",
    "pages/recipe-detail.html",
    "pages/saved-recipes.html",
    "img/logo.png",
    "favicon.ico"
];

self.addEventListener("install", function(event) {
    console.log("Service Worker installing.");
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(c) {
            return c.addAll(CACHED_URLS);
        }).catch((err)=>{
            console.error("Caching failed: ", err);
        })
    );
})

self.addEventListener("fetch", function(event) {
    const requestURL = new URL(event.request.url);

    // Wir behandeln nur Navigationsanfragen (also Seitenaufrufe)
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // Wenn Netzwerk nicht geht, prüfen wir was der Pfad ist
                    if (requestURL.pathname === "/" || requestURL.pathname === "/index.html") {
                        // Offline auf saved-recipes.html umleiten
                        return caches.match("/pages/saved-recipes.html");
                    }

                    // Wenn saved-recipes.html direkt angefragt wird, im Cache ausliefern
                    if (requestURL.pathname === "/pages/saved-recipes.html") {
                        return caches.match("/pages/saved-recipes.html");
                    }

                    // Für alle anderen Navigationsanfragen, versuche aus Cache zu bedienen
                    return caches.match(event.request)
                        .then(response => response || caches.match("/pages/saved-recipes.html"));
                })
        );
    } else {
        // Für alle anderen Requests (CSS, JS, Bilder etc.) network first, fallback cache
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    }
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
