// gibt es Service Worker für den Browser
if ("serviceWorker" in navigator){
    // wenn ja, dann registrieren
    navigator.serviceWorker.register("sw.js")
        .then(registration => {
                console.log(`Service Worker registered with scope ${registration.scope}`);
        })
        .catch( err=> {
            console.log("Service Worker registration failed: ", err);
        });
}