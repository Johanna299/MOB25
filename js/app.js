//does a service worker for this browser exist?
if ("serviceWorker" in navigator){
    //if yes, register
    navigator.serviceWorker.register("sw.js")
        .then(registration => {
                console.log(`Service Worker registered with scope ${registration.scope}`);
        })
        .catch( err=> {
            console.log("Service Worker registration failed: ", err);
        });
}

// Wenn offline, Link im Button auf saved-recipes.html setzen
if (!navigator.onLine) {
    const getStartedBtn = document.querySelector('.start-btn');
    if (getStartedBtn) {
        getStartedBtn.href = "pages/saved-recipes.html";
    }
}

// Optional: Eventlistener, um beim Wechsel zwischen online/offline den Link anzupassen
window.addEventListener('online', () => {
    const btn = document.querySelector('.start-btn');
    if (btn) btn.href = "pages/ingredients-input.html";
});
window.addEventListener('offline', () => {
    const btn = document.querySelector('.start-btn');
    if (btn) btn.href = "pages/saved-recipes.html";
});
