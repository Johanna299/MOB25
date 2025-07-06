//cache name with versioning to manage updates
const CACHE_NAME = "whats-cookin-cache-v7";
//list of URLs/files to be cached during service worker installation
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


//service worker installation event: cache all specified assets
self.addEventListener("install", function(event) {
    console.log("Service Worker installing.");
    //wait until all URLs are cached before finishing installation
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(c) {
            return c.addAll(CACHED_URLS);
        }).catch((err)=>{
            console.error("Caching failed: ", err);
        })
    );
})

//intercept network requests (fetch events)
self.addEventListener("fetch", function(event) {
    const requestURL = new URL(event.request.url);

    //handle only navigation requests (page loads)
    if (event.request.mode === "navigate") {
        event.respondWith(
            //try network first
            fetch(event.request)
                .catch(() => {
                    //if offline or network fails, serve fallback pages from cache

                    //if user tries to access homepage, redirect to saved-recipes.html offline page
                    if (requestURL.pathname === "/" || requestURL.pathname === "/index.html") {
                        return caches.match("/pages/saved-recipes.html");
                    }

                    //if saved-recipes.html is requested directly, serve it from cache
                    if (requestURL.pathname === "/pages/saved-recipes.html") {
                        return caches.match("/pages/saved-recipes.html");
                    }

                    //for any other navigation request, try to serve from cache,
                    //if not found fallback to saved-recipes.html
                    return caches.match(event.request)
                        .then(response => response || caches.match("/pages/saved-recipes.html"));
                })
        );
    } else {
        //for non-navigation requests (CSS, JS, images), try network first,
        //fallback to cache if network is unavailable
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    }
});

//activate event: clean up old caches when a new service worker activates
self.addEventListener("activate",(event)=>{
    event.waitUntil(
        caches.keys().then((cacheNames)=>{
            return Promise.all(
                cacheNames.map((cacheName)=>{
                    //delete any old caches that don't match the current CACHE_NAME
                    if(CACHE_NAME !== cacheName && cacheName.startsWith("whats-cookin-cache")){
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
