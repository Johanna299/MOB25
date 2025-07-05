// // Herz-Button (Speichern) -- TODO nur Toggle Effekt derzeit
// document.addEventListener('click', event => {
//     const saveButton = event.target.closest('.save-recipe');
//     if (saveButton) {
//         event.preventDefault();
//         event.stopPropagation();
//
//         const icon = saveButton.querySelector('i');
//         saveButton.classList.toggle('active');
//         icon.classList.toggle('fa-regular');
//         icon.classList.toggle('fa-solid');
//     }
// });
//
// const recipes = sessionStorage.getItem('recipes-result');
// const fullRecipeData = []; // fill in with complete recipe data
//
// if (recipes) {
//     displayRecipes(recipes);
// } else {
//     console.warn('No recipes found.');
// }
//
// async function displayRecipes(recipes) {
//     const container = document.querySelector('.recipe-grid');
//     const categoriesContainer = document.querySelector('.categories');
//     container.innerHTML = '';
//     categoriesContainer.innerHTML = '';
//
//     const parsedRecipes = JSON.parse(recipes);
//     const allCategories = new Set();
//
//     parsedRecipes.sort((a, b) => getMatch(b) - getMatch(a));
//
//     for (const recipe of parsedRecipes) {
//         const recipeId = recipe.id;
//
//         try {
//             const res = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`);
//             const data = await res.json();
//
//             const categories = getCategoriesFromRecipe(data);
//             categories.forEach(c => allCategories.add(c));
//
//             // save full recipe data and categories
//             fullRecipeData.push({
//                 id: recipeId,
//                 match: getMatch(recipe),
//                 data,
//                 categories
//             });
//
//         } catch (err) {
//             console.error(`Error loading recipe ID ${recipeId}:`, err);
//         }
//     }
//
//     renderCategoryButtons(allCategories);
//     renderRecipes(fullRecipeData); //initial display of all recipes
// }
//
// function getMatch(recipe) {
//     const used = recipe.usedIngredientCount;
//     const missed = recipe.missedIngredientCount;
//     return Math.round((used / (used + missed)) * 100);
// }
//
// function getCategoriesFromRecipe(data) {
//     const categories = new Set();
//     if (data.vegetarian) categories.add('vegetarian');
//     if (data.vegan) categories.add('vegan');
//     if (!data.vegetarian && !data.vegan) categories.add('meat');
//
//     (data.diets || []).forEach(diet => categories.add(diet));
//     (data.dishTypes || []).forEach(type => categories.add(type));
//
//     return categories;
// }
//
// function renderCategoryButtons(categoriesSet) {
//     const categoriesContainer = document.querySelector('.categories');
//
//     const allButton = document.createElement('button');
//     allButton.className = 'category';
//     allButton.textContent = 'All';
//     allButton.addEventListener('click', () => renderRecipes(fullRecipeData));
//     categoriesContainer.appendChild(allButton);
//
//     [...categoriesSet].sort().forEach(cat => {
//         const btn = document.createElement('button');
//         btn.className = 'category';
//         btn.textContent = cat;
//         btn.addEventListener('click', () => {
//             const filtered = fullRecipeData.filter(entry => entry.categories.has(cat));
//             renderRecipes(filtered);
//         });
//         categoriesContainer.appendChild(btn);
//     });
// }
//
// function renderRecipes(recipeEntries) {
//     const container = document.querySelector('.recipe-grid');
//     container.innerHTML = '';
//
//     recipeEntries.forEach(entry => {
//         const { data, match } = entry;
//         const card = document.createElement('a');
//         card.classList.add('recipe-card');
//         card.href = "recipe-detail.html";
//         card.innerHTML = `
//             <div class="image-wrapper">
//                 <img src="${data.image}" alt="${data.title}"/>
//                 <button class="save-recipe">
//                     <i class="fa-regular fa-heart"></i>
//                 </button>
//             </div>
//             <div class="recipe-info">
//                 <p class="recipe-title">${data.title}</p>
//                 <p class="recipe-match">${match}% Ingredient-Match</p>
//                 <p class="recipe-duration">
//                     <i class="fa-solid fa-stopwatch"></i>
//                     ${data.readyInMinutes}min
//                 </p>
//             </div>
//         `;
//         card.addEventListener("click", () => {
//             sessionStorage.setItem("selectedRecipe", JSON.stringify(data));
//         });
//         container.appendChild(card);
//     });
// }

//TODO GPT
import { saveRecipe, removeRecipe, isRecipeSaved } from './indexeddb.js';

document.addEventListener('click', event => {
    const saveButton = event.target.closest('.save-recipe');
    if (saveButton) {
        event.preventDefault();
        event.stopPropagation();

        const icon = saveButton.querySelector('i');
        saveButton.classList.toggle('active');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');

        // Rezept-ID aus parent card holen
        const recipeCard = saveButton.closest('.recipe-card');
        const title = recipeCard.querySelector('.recipe-title').textContent;
        const recipeEntry = fullRecipeData.find(r => r.data.title === title);

        if (recipeEntry) {
            const recipe = recipeEntry.data;
            if (saveButton.classList.contains('active')) {
                saveRecipe(recipe); // speichern
            } else {
                removeRecipe(recipe.id); // entfernen
            }
        }
    }
});


// // Herz-Button (Speichern) -- TODO nur Toggle Effekt derzeit
// document.addEventListener('click', event => {
//     const saveButton = event.target.closest('.save-recipe');
//     if (saveButton) {
//         event.preventDefault();
//         event.stopPropagation();
//
//         const icon = saveButton.querySelector('i');
//         saveButton.classList.toggle('active');
//         icon.classList.toggle('fa-regular');
//         icon.classList.toggle('fa-solid');
//     }
// });

// Globale Variablen für Pagination und Filter
let offset = 0;
const limit = 10;
let isLoading = false;
let allRecipesLoaded = false;
let currentFilter = null;

const fullRecipeData = [];

// Zutaten aus SessionStorage holen
const ingredients = JSON.parse(sessionStorage.getItem('ingredients') || '[]');

if (!ingredients.length) {
    console.warn('No ingredients found in sessionStorage.');
} else {
    loadRecipesChunk(ingredients, offset);
}

// Funktion zum Laden eines Chunks Rezepte von Spoonacular
async function loadRecipesChunk(ingredients, startOffset) {
    if (isLoading || allRecipesLoaded) return;
    isLoading = true;

    const query = ingredients.join(',');
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=${limit}&offset=${startOffset}&apiKey=${SPOONACULAR_API_KEY}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP Fehler! Status: ${res.status}`);
        const recipes = await res.json();

        if (!recipes.length) {
            allRecipesLoaded = true;
            isLoading = false;
            return;
        }

        // Details zu jedem Rezept laden
        for (const recipe of recipes) {
            const recipeId = recipe.id;
            try {
                const detailRes = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`);
                if (!detailRes.ok) throw new Error(`Detail-HTTP Fehler! Status: ${detailRes.status}`);
                const data = await detailRes.json();

                fullRecipeData.push({
                    id: recipeId,
                    match: getMatch(recipe),
                    data,
                    categories: getCategoriesFromRecipe(data)
                });
            } catch (err) {
                console.error(`Fehler beim Laden der Details für Rezept ID ${recipeId}:`, err);
            }
        }

        offset += limit;

        // Kategorien neu sammeln und Buttons rendern
        const allCategories = new Set();
        fullRecipeData.forEach(r => r.categories.forEach(c => allCategories.add(c)));

        renderCategoryButtons(allCategories);

        // Render mit Filter, falls gesetzt
        if (currentFilter) {
            renderRecipes(fullRecipeData.filter(r => r.categories.has(currentFilter)));
        } else {
            renderRecipes(fullRecipeData);
        }

    } catch (err) {
        console.error("Fehler beim Laden der Rezepte:", err);
    }

    isLoading = false;
}

// Kategorie-Button erstellen und filtern
function renderCategoryButtons(categoriesSet) {
    const categoriesContainer = document.querySelector('.categories');
    categoriesContainer.innerHTML = '';

    const allButton = document.createElement('button');
    allButton.className = 'category';
    allButton.textContent = 'All';
    allButton.addEventListener('click', () => {
        currentFilter = null;
        renderRecipes(fullRecipeData);
    });
    categoriesContainer.appendChild(allButton);

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

// // Rezepte rendern (Array von Einträgen)
// function renderRecipes(recipeEntries) {
//     const container = document.querySelector('.recipe-grid');
//     container.innerHTML = '';
//
//     recipeEntries.forEach(entry => {
//         const { data, match } = entry;
//         const card = document.createElement('a');
//         card.classList.add('recipe-card');
//         card.href = "recipe-detail.html";
//         card.innerHTML = `
//             <div class="image-wrapper">
//                 <img src="${data.image}" alt="${data.title}"/>
//                 <button class="save-recipe">
//                     <i class="fa-regular fa-heart"></i>
//                 </button>
//             </div>
//             <div class="recipe-info">
//                 <p class="recipe-title">${data.title}</p>
//                 <p class="recipe-match">${match}% Ingredient-Match</p>
//                 <p class="recipe-duration">
//                     <i class="fa-solid fa-stopwatch"></i>
//                     ${data.readyInMinutes}min
//                 </p>
//             </div>
//         `;
//         card.addEventListener("click", () => {
//             sessionStorage.setItem("selectedRecipe", JSON.stringify(data));
//         });
//         container.appendChild(card);
//     });
// }

// renderRecipes jetzt async, da wir auf isRecipeSaved warten müssen
async function renderRecipes(recipeEntries) {
    const container = document.querySelector('.recipe-grid');
    container.innerHTML = '';

    for (const entry of recipeEntries) {
        const { data, match } = entry;

        const saved = await isRecipeSaved(data.id);  // Prüfen, ob gespeichert

        const card = document.createElement('a');
        card.classList.add('recipe-card');
        card.href = "recipe-detail.html";

        // Herz-Klassen setzen je nach saved-Status
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
        card.addEventListener("click", () => {
            sessionStorage.setItem("selectedRecipe", JSON.stringify(data));
        });
        container.appendChild(card);
    }
}


// Hilfsfunktion für Match-Berechnung
function getMatch(recipe) {
    const used = recipe.usedIngredientCount;
    const missed = recipe.missedIngredientCount;
    return Math.round((used / (used + missed)) * 100);
}

// Hilfsfunktion zum Extrahieren von Kategorien
function getCategoriesFromRecipe(data) {
    const categories = new Set();
    if (data.vegetarian) categories.add('vegetarian');
    if (data.vegan) categories.add('vegan');
    if (!data.vegetarian && !data.vegan) categories.add('meat');

    (data.diets || []).forEach(diet => categories.add(diet));
    (data.dishTypes || []).forEach(type => categories.add(type));

    return categories;
}

// Eventlistener für Load More Button
document.querySelector('.load-more').addEventListener('click', () => {
    loadRecipesChunk(ingredients, offset);
});
