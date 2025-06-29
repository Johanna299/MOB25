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

//TODO API getestet, Daten im index.html console ausgegeben
fetch("https://api.spoonacular.com/recipes/complexSearch?query=pasta&apiKey=4c24a4071a244fcda3e1efad2aa6c563")
    .then(res => res.json())
    .then(data => {
        console.log(data.results);
        // Hier könntest du die Daten dynamisch ins HTML schreiben
    });
