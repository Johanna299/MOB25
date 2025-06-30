function getIngredientsFromList() {
    const elements = document.querySelectorAll('.ingredient-text');
    const ingredients = Array.from(elements).map(el => el.textContent.trim());
    return ingredients;
}

for (let ingredient of getIngredientsFromList()) {
    console.log(ingredient);
}

function searchRecipes(ingredients) {
    const query = ingredients.join(',');
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=10&apiKey=4c24a4071a244fcda3e1efad2aa6c563`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log("Rezepte:", data);
            // Optional: Weiterleiten zur Rezeptseite mit Ergebnis
            sessionStorage.setItem('recipes-result', JSON.stringify(data));
            window.location.href = 'recipe-suggestions.html';
        })
        .catch(error => console.error('Fehler beim Abrufen der Rezepte:', error));
}

document.querySelector('.btn').addEventListener('click', function(e) {
    e.preventDefault(); // Seite nicht direkt wechseln
    const ingredients = getIngredientsFromList();
    searchRecipes(ingredients);
});
