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

//TODO API getestet, Daten im index.html console ausgegeben
// fetch(`https://api.spoonacular.com/recipes/complexSearch?query=pasta&apiKey=${SPOONACULAR_API_KEY}`)
//     .then(res => res.json())
//     .then(data => {
//         console.log(data.results);
//         // Hier könntest du die Daten dynamisch ins HTML schreiben
//     });