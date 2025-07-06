import { saveRecipe, removeRecipe, isRecipeSaved } from './indexeddb.js';

//listen for any click on the document
document.addEventListener('click', event => {
    //save recipe
    const saveButton = event.target.closest('.save-recipe');
    if (saveButton) {
        event.preventDefault();
        event.stopPropagation();

        const icon = saveButton.querySelector('i');
        //toggle heart icon and active state
        saveButton.classList.toggle('active');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');

        //get recipe title from parent card
        const recipeCard = saveButton.closest('.recipe-card');
        const title = recipeCard.querySelector('.recipe-title').textContent;
        //find full recipe data by title
        const recipeEntry = fullRecipeData.find(r => r.data.title === title);

        if (recipeEntry) {
            const recipe = recipeEntry.data;
            if (saveButton.classList.contains('active')) {
                //save to IndexedDB
                saveRecipe(recipe);
            } else {
                //remove from IndexedDB
                removeRecipe(recipe.id);
            }
        }
    }
});

// global variables for pagination
let offset = 0;
const limit = 10;
let isLoading = false;
let allRecipesLoaded = false;
let currentFilter = null;

const fullRecipeData = [];

//get ingredients from sessionStorage
const ingredients = JSON.parse(sessionStorage.getItem('ingredients') || '[]');

if (!ingredients.length) {
    console.warn('No ingredients found in sessionStorage.');
} else {
    //start loading first chunk
    loadRecipesChunk(ingredients, offset);
}

//load a chunk of recipes based on ingredients and offset
async function loadRecipesChunk(ingredients, startOffset) {
    if (isLoading || allRecipesLoaded) return;
    isLoading = true;

    const query = ingredients.join(',');
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=${limit}&offset=${startOffset}&apiKey=${SPOONACULAR_API_KEY}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const recipes = await res.json();

        //stop if no more results
        if (!recipes.length) {
            allRecipesLoaded = true;
            isLoading = false;
            return;
        }

        //fetch detailed info for each recipe
        for (const recipe of recipes) {
            const recipeId = recipe.id;
            try {
                const detailRes = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`);
                if (!detailRes.ok) throw new Error(`Detail HTTP error! Status: ${detailRes.status}`);
                const data = await detailRes.json();

                //store recipe with match percentage and categories
                fullRecipeData.push({
                    id: recipeId,
                    match: getMatch(recipe),
                    data,
                    categories: getCategoriesFromRecipe(data)
                });
            } catch (err) {
                console.error(`Error loading details for recipe ID ${recipeId}:`, err);
            }
        }

        offset += limit;

        //collect unique categories from all loaded recipes
        const allCategories = new Set();
        fullRecipeData.forEach(r => r.categories.forEach(c => allCategories.add(c)));

        renderCategoryButtons(allCategories);

        //re-render filtered or full recipe list
        if (currentFilter) {
            renderRecipes(fullRecipeData.filter(r => r.categories.has(currentFilter)));
        } else {
            renderRecipes(fullRecipeData);
        }

    } catch (err) {
        console.error("Error loading recipes:", err);
    }

    isLoading = false;
}

//render category buttons for filtering
function renderCategoryButtons(categoriesSet) {
    const categoriesContainer = document.querySelector('.categories');
    categoriesContainer.innerHTML = '';

    //"All" button resets filter
    const allButton = document.createElement('button');
    allButton.className = 'category';
    allButton.textContent = 'All';
    allButton.addEventListener('click', () => {
        currentFilter = null;
        renderRecipes(fullRecipeData);
    });
    categoriesContainer.appendChild(allButton);

    //create button for each category
    [...categoriesSet].sort().forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category';
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            currentFilter = cat;
            const filtered = fullRecipeData.filter(entry => entry.categories.has(cat));
            renderRecipes(filtered);
        });
        categoriesContainer.appendChild(btn);
    });
}

//render recipe cards
async function renderRecipes(recipeEntries) {
    const container = document.querySelector('.recipe-grid');
    container.innerHTML = '';

    for (const entry of recipeEntries) {
        const { data, match } = entry;

        //check if recipe is already saved
        const saved = await isRecipeSaved(data.id);

        const card = document.createElement('a');
        card.classList.add('recipe-card');
        card.href = "recipe-detail.html";

        //set icon class depending on saved status
        const heartClass = saved ? 'fa-solid' : 'fa-regular';
        const activeClass = saved ? 'active' : '';

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${data.image}" alt="${data.title}"/>
                <button class="save-recipe ${activeClass}">
                    <i class="fa-heart ${heartClass}"></i>
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

        //save current recipe and page in sessionStorage when card is clicked
        card.addEventListener("click", () => {
            sessionStorage.setItem("selectedRecipe", JSON.stringify(data));
            //remember last visited page (for navigating back from recipe-detail.html)
            sessionStorage.setItem("lastPage", "recipe-suggestions.html");
        });

        container.appendChild(card);
    }
}

//calculate ingredient match percentage
function getMatch(recipe) {
    const used = recipe.usedIngredientCount;
    const missed = recipe.missedIngredientCount;
    return Math.round((used / (used + missed)) * 100);
}

//extract recipe categories (vegan, vegetarian, ...)
function getCategoriesFromRecipe(data) {
    const categories = new Set();
    if (data.vegetarian) categories.add('vegetarian');
    if (data.vegan) categories.add('vegan');
    if (!data.vegetarian && !data.vegan) categories.add('meat');

    (data.diets || []).forEach(diet => categories.add(diet));
    (data.dishTypes || []).forEach(type => categories.add(type));

    return categories;
}

//load more recipes when button is clicked
document.querySelector('.load-more').addEventListener('click', () => {
    loadRecipesChunk(ingredients, offset);
});