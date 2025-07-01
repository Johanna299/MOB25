document.querySelectorAll('.save-recipe').forEach(button => {
    button.addEventListener('click', () => {
        const icon = button.querySelector('i');
        button.classList.toggle('active');
        // Toggle zwischen Outline und Solid Icon
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    });
});


// 🎯 Rezepte aus sessionStorage holen
const recipes = sessionStorage.getItem('recipes-result');

if (recipes) {
    displayRecipes(recipes);
} else {
    console.warn('Keine Rezeptdaten gefunden.');
}

//TODO nach Rezept-Match sortieren (höchste %-Zahl oben)
function displayRecipes(recipes) {
    const container = document.querySelector('.recipe-grid');
    JSON.parse(recipes).forEach(recipe => {
        const recipeId = recipe.id;
        fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                const title = data.title;
                const image = data.image;
                const duration = data.readyInMinutes;

                const card = document.createElement('a');
                card.classList.add('recipe-card');
                card.href = "recipe-detail.html";
                card.innerHTML = `
                <div class="image-wrapper">
                    <img src="${image}" alt="${title}"/>
                    <button class="save-recipe">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="recipe-info">
                    <p class="recipe-title">${title}</p>
                    <p class="recipe-match">${getMatch(recipe)}% Zutaten-Match</p>
                    <p class="recipe-duration">
                        <i class="fa-solid fa-stopwatch"></i>
                        ${duration}min
                    </p>
                </div>
            `;
                card.addEventListener("click", () => {
                    sessionStorage.setItem("selectedRecipe", JSON.stringify(recipe));
                });
                container.appendChild(card);
            });
    });
}

function getMatch(recipe) {
    const used = recipe.usedIngredientCount;
    const missed = recipe.missedIngredientCount;
    const match = Math.round((used / (used + missed)) * 100);
    return match;
}