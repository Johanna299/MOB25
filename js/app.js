//check if the browser supports service workers
if ("serviceWorker" in navigator){
    //if supported, register the service worker script "sw.js"
    navigator.serviceWorker.register("sw.js")
        .then(registration => {
                console.log(`Service Worker registered with scope ${registration.scope}`);
        })
        .catch( err=> {
            console.log("Service Worker registration failed: ", err);
        });
}

//if the browser is currently offline
if (!navigator.onLine) {
    // change the "get started" button's link to the saved recipes page
    const getStartedBtn = document.querySelector('.start-btn');
    if (getStartedBtn) {
        getStartedBtn.href = "pages/saved-recipes.html";
    }
}

//when the browser goes online
window.addEventListener('online', () => {
    // set the button's link to the ingredients input page
    const btn = document.querySelector('.start-btn');
    if (btn) btn.href = "pages/ingredients-input.html";
});
//when the browser goes offline
window.addEventListener('offline', () => {
    //set the button's link back to the saved recipes page
    const btn = document.querySelector('.start-btn');
    if (btn) btn.href = "pages/saved-recipes.html";
});
