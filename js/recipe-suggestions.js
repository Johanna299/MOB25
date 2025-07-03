// Herz-Button (Speichern) -- TODO nur Toggle Effekt derzeit
document.addEventListener('click', event => {
    const saveButton = event.target.closest('.save-recipe');
    if (saveButton) {
        event.preventDefault();
        event.stopPropagation();

        const icon = saveButton.querySelector('i');
        saveButton.classList.toggle('active');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    }
});

const recipes = sessionStorage.getItem('recipes-result');
const fullRecipeData = []; // fill in with complete recipe data

if (recipes) {
    displayRecipes(recipes);
} else {
    console.warn('No recipes found.');
}

async function displayRecipes(recipes) {
    const container = document.querySelector('.recipe-grid');
    const categoriesContainer = document.querySelector('.categories');
    container.innerHTML = '';
    categoriesContainer.innerHTML = '';

    const parsedRecipes = JSON.parse(recipes);
    const allCategories = new Set();

    parsedRecipes.sort((a, b) => getMatch(b) - getMatch(a));

    for (const recipe of parsedRecipes) {
        const recipeId = recipe.id;

        try {
            const res = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`);
            const data = await res.json();

            const categories = getCategoriesFromRecipe(data);
            categories.forEach(c => allCategories.add(c));

            // save full recipe data and categories
            fullRecipeData.push({
                id: recipeId,
                match: getMatch(recipe),
                data,
                categories
            });

        } catch (err) {
            console.error(`Error loading recipe ID ${recipeId}:`, err);
        }
    }

    renderCategoryButtons(allCategories);
    renderRecipes(fullRecipeData); //initial display of all recipes
}

function getMatch(recipe) {
    const used = recipe.usedIngredientCount;
    const missed = recipe.missedIngredientCount;
    return Math.round((used / (used + missed)) * 100);
}

function getCategoriesFromRecipe(data) {
    const categories = new Set();
    if (data.vegetarian) categories.add('vegetarian');
    if (data.vegan) categories.add('vegan');
    if (!data.vegetarian && !data.vegan) categories.add('meat');

    (data.diets || []).forEach(diet => categories.add(diet));
    (data.dishTypes || []).forEach(type => categories.add(type));

    return categories;
}

function renderCategoryButtons(categoriesSet) {
    const categoriesContainer = document.querySelector('.categories');

    const allButton = document.createElement('button');
    allButton.className = 'category';
    allButton.textContent = 'All';
    allButton.addEventListener('click', () => renderRecipes(fullRecipeData));
    categoriesContainer.appendChild(allButton);

    [...categoriesSet].sort().forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category';
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            const filtered = fullRecipeData.filter(entry => entry.categories.has(cat));
            renderRecipes(filtered);
        });
        categoriesContainer.appendChild(btn);
    });
}

function renderRecipes(recipeEntries) {
    const container = document.querySelector('.recipe-grid');
    container.innerHTML = '';

    recipeEntries.forEach(entry => {
        const { data, match } = entry;
        const card = document.createElement('a');
        card.classList.add('recipe-card');
        card.href = "recipe-detail.html";
        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${data.image}" alt="${data.title}"/>
                <button class="save-recipe">
                    <i class="fa-regular fa-heart"></i>
                </button>
            </div>
            <div class="recipe-info">
                <p class="recipe-title">${data.title}</p>
                <p class="recipe-match">${match}% Ingredient-Match</p>
                <p class="recipe-duration">
                    <i class="fa-solid fa-stopwatch"></i>
                    ${data.readyInMinutes}min
                </p>
            </div>
        `;
        card.addEventListener("click", () => {
            sessionStorage.setItem("selectedRecipe", JSON.stringify(data));
        });
        container.appendChild(card);
    });
}
