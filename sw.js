// const CACHE_NAME = "kwm-cache";
// const CACHED_URLS = [
//     "css/materialize.min.css",
//     "css/styles.css",
//     "https://fonts.googleapis.com/icon?family=Material+Icons",
//     "img/kwmcontacts.png",
//     "js/app.js",
//     "js/common.js",
//     "pages/about.html",
//     "index.html",
//     "/",
// ];
//
// // self.addEventListener('fetch', function(event) {
// //     console.log('Fetch event for:', event.request)
// //     // if(event.request.url.includes("/img/kwmcontacts.png")){
// //     //     event.respondWith(
// //     //         fetch("./img/kwmcontacts_rotated.png")
// //     //     )
// //     // }
// //     event.respondWith(
// //         fetch(event.request).catch(()=> {
// //             console.log('Fetch failed: returning offline page instead.');
// //             return new Response(`Welcome to the offline page! You can still access this page while offline.`);
// //         })
// //     );
// //
// // });
//
// // self.addEventListener("fetch", function(event) {
// //     event.respondWith((async () => {
// //         try {
// //             return await fetch(event.request); // Resource vom Netzwerk fetchen
// //         } catch {
// //             return await caches.match(event.request);
// //         }
// //     })());
// // });
//
// self.addEventListener("fetch", (event) => {
//     event.respondWith((async () => {
//         const response = await caches.match(event.request);
//         return response || fetch(event.request);
//     })());
// });
//
// self.addEventListener("install", function(event) {
//     console.log("Service Worker installing.");
//     event.waitUntil( (async () => {
//             try {
//                 const cache = await caches.open(CACHE_NAME);
//                 await cache.addAll(CACHED_URLS);
//             }catch (err){
//                 console.error(err);
//             }
//         })(),
//     );
// });
//
// self.addEventListener("activate", function(event) {
//     console.log("Service Worker activating.");
// })

const CACHE_NAME = "kwm-cache-v3";
const CACHED_URLS = [
    "css/materialize.min.css",
    "css/styles.css",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.gstatic.com/s/materialicons/v143/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
    "/img/icons/icon-144.png",
    "img/kwmcontacts.png",
    "js/app.js",
    "js/common.js",
    "js/materialize.min.js",
    "pages/about.html",
    "index.html",
    "/",
    "manifest.webmanifest",
    "favicon.ico",
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
                    if(CACHE_NAME !== cacheName && cacheName.startsWith("kwm-cache")){
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
