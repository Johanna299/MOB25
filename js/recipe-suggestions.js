// //save a recipe with a click on the heart-buttond (TODO derzeit nur farbig, aber ned wirklich gespeichert)
// document.querySelectorAll('.save-recipe').forEach(button => {
//     button.addEventListener('click', () => {
//         const icon = button.querySelector('i');
//         button.classList.toggle('active');
//         //toggle between filled and outline icon
//         icon.classList.toggle('fa-regular');
//         icon.classList.toggle('fa-solid');
//     });
// });
//
// // load recipes from sessionStorage
// const recipes = sessionStorage.getItem('recipes-result');
// if(recipes) {
//     displayRecipes(recipes);
// } else {
//     console.warn('Keine Rezeptdaten gefunden.');
// }
//
// //TODO nach Rezept-Match sortieren (höchste %-Zahl oben)
// function displayRecipes(recipes) {
//     const container = document.querySelector('.recipe-grid');
//     JSON.parse(recipes).forEach(recipe => {
//         const recipeId = recipe.id;
//         fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`)
//             .then(res => res.json())
//             .then(data => {
//                 console.log("TEST", data);
//                 const title = data.title;
//                 const image = data.image;
//                 const duration = data.readyInMinutes;
//
//                 const card = document.createElement('a');
//                 card.classList.add('recipe-card');
//                 card.href = "recipe-detail.html";
//                 card.innerHTML = `
//                 <div class="image-wrapper">
//                     <img src="${image}" alt="${title}"/>
//                     <button class="save-recipe">
//                         <i class="fa-regular fa-heart"></i>
//                     </button>
//                 </div>
//                 <div class="recipe-info">
//                     <p class="recipe-title">${title}</p>
//                     <p class="recipe-match">${getMatch(recipe)}% Zutaten-Match</p>
//                     <p class="recipe-duration">
//                         <i class="fa-solid fa-stopwatch"></i>
//                         ${duration}min
//                     </p>
//                 </div>
//             `;
//                 card.addEventListener("click", () => {
//                     sessionStorage.setItem("selectedRecipe", JSON.stringify(data));
//                 });
//                 container.appendChild(card);
//             });
//     });
// }
//
// function getMatch(recipe) {
//     const used = recipe.usedIngredientCount;
//     const missed = recipe.missedIngredientCount;
//     const match = Math.round((used / (used + missed)) * 100);
//     return match;
// }

//TODO GPT 1. Versuch
// // Herz-Button (Speichern) – derzeit nur Toggle-Effekt
// document.addEventListener('click', event => {
//     if (event.target.closest('.save-recipe')) {
//         const button = event.target.closest('.save-recipe');
//         const icon = button.querySelector('i');
//         button.classList.toggle('active');
//         icon.classList.toggle('fa-regular');
//         icon.classList.toggle('fa-solid');
//     }
// });
//
// // Rezepte aus sessionStorage laden
// const recipes = sessionStorage.getItem('recipes-result');
// if (recipes) {
//     displayRecipes(recipes);
// } else {
//     console.warn('Keine Rezeptdaten gefunden.');
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
//     // Rezepte sortieren nach Zutaten-Match (absteigend)
//     parsedRecipes.sort((a, b) => {
//         const matchA = getMatch(a);
//         const matchB = getMatch(b);
//         return matchB - matchA;
//     });
//
//     for (const recipe of parsedRecipes) {
//         const recipeId = recipe.id;
//
//         try {
//             const res = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`);
//             const data = await res.json();
//
//             // Kategorien sammeln
//             if (data.vegetarian) allCategories.add('Vegetarisch');
//             if (data.vegan) allCategories.add('Vegan');
//             if (!data.vegetarian && !data.vegan) allCategories.add('Fleischgerichte');
//
//             data.diets?.forEach(diet => allCategories.add(formatCategoryName(diet)));
//             data.dishTypes?.forEach(type => allCategories.add(formatCategoryName(type)));
//
//             // Rezeptkarte erzeugen
//             const card = document.createElement('a');
//             card.classList.add('recipe-card');
//             card.href = "recipe-detail.html";
//             card.innerHTML = `
//                 <div class="image-wrapper">
//                     <img src="${data.image}" alt="${data.title}"/>
//                     <button class="save-recipe">
//                         <i class="fa-regular fa-heart"></i>
//                     </button>
//                 </div>
//                 <div class="recipe-info">
//                     <p class="recipe-title">${data.title}</p>
//                     <p class="recipe-match">${getMatch(recipe)}% Zutaten-Match</p>
//                     <p class="recipe-duration">
//                         <i class="fa-solid fa-stopwatch"></i>
//                         ${data.readyInMinutes}min
//                     </p>
//                 </div>
//             `;
//             card.addEventListener("click", () => {
//                 sessionStorage.setItem("selectedRecipe", JSON.stringify(data));
//             });
//             container.appendChild(card);
//         } catch (err) {
//             console.error(`Fehler beim Laden von Rezept-ID ${recipeId}:`, err);
//         }
//     }
//
//     // Kategorie-Buttons anzeigen
//     renderCategoryButtons(allCategories);
// }
//
// function getMatch(recipe) {
//     const used = recipe.usedIngredientCount;
//     const missed = recipe.missedIngredientCount;
//     return Math.round((used / (used + missed)) * 100);
// }
//
// function renderCategoryButtons(categoriesSet) {
//     const categoriesContainer = document.querySelector('.categories');
//
//     // "Alle"-Button zuerst
//     const allButton = document.createElement('button');
//     allButton.className = 'category';
//     allButton.textContent = 'Alle';
//     categoriesContainer.appendChild(allButton);
//
//     [...categoriesSet].sort().forEach(cat => {
//         const btn = document.createElement('button');
//         btn.className = 'category';
//         btn.textContent = cat;
//         categoriesContainer.appendChild(btn);
//     });
// }
//
// function formatCategoryName(name) {
//     switch (name.toLowerCase()) {
//         case 'gluten free': return 'Glutenfrei';
//         case 'ketogenic': return 'Ketogen';
//         case 'lacto vegetarian': return 'Lacto-Vegetarisch';
//         case 'ovo vegetarian': return 'Ovo-Vegetarisch';
//         case 'vegan': return 'Vegan';
//         case 'vegetarian': return 'Vegetarisch';
//         case 'main course': return 'Hauptgericht';
//         case 'side dish': return 'Beilage';
//         case 'dessert': return 'Dessert';
//         case 'appetizer': return 'Vorspeise';
//         case 'salad': return 'Salat';
//         case 'breakfast': return 'Frühstück';
//         case 'soup': return 'Suppe';
//         case 'beverage': return 'Getränk';
//         case 'sauce': return 'Soße';
//         case 'marinade': return 'Marinade';
//         default:
//             return name.charAt(0).toUpperCase() + name.slice(1);
//     }
// }

//TODO GPT 2. versuch
// // Herz-Button (Speichern) – derzeit nur Toggle-Effekt
// document.addEventListener('click', event => {
//     if (event.target.closest('.save-recipe')) {
//         const button = event.target.closest('.save-recipe');
//         const icon = button.querySelector('i');
//         button.classList.toggle('active');
//         icon.classList.toggle('fa-regular');
//         icon.classList.toggle('fa-solid');
//     }
// });
//
// // Rezepte aus sessionStorage laden
// const recipes = sessionStorage.getItem('recipes-result');
// if (recipes) {
//     displayRecipes(recipes);
// } else {
//     console.warn('Keine Rezeptdaten gefunden.');
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
//     // Rezepte sortieren nach Zutaten-Match (absteigend)
//     parsedRecipes.sort((a, b) => getMatch(b) - getMatch(a));
//
//     for (const recipe of parsedRecipes) {
//         const recipeId = recipe.id;
//
//         try {
//             const res = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`);
//             const data = await res.json();
//
//             // Kategorien sammeln
//             if (data.vegetarian) allCategories.add('vegetarian');
//             if (data.vegan) allCategories.add('vegan');
//             if (!data.vegetarian && !data.vegan) allCategories.add('meat');
//
//             (data.diets || []).forEach(diet => allCategories.add(diet));
//             (data.dishTypes || []).forEach(type => allCategories.add(type));
//
//             // Rezeptkarte erzeugen
//             const card = document.createElement('a');
//             card.classList.add('recipe-card');
//             card.href = "recipe-detail.html";
//             card.innerHTML = `
//                 <div class="image-wrapper">
//                     <img src="${data.image}" alt="${data.title}"/>
//                     <button class="save-recipe">
//                         <i class="fa-regular fa-heart"></i>
//                     </button>
//                 </div>
//                 <div class="recipe-info">
//                     <p class="recipe-title">${data.title}</p>
//                     <p class="recipe-match">${getMatch(recipe)}% Zutaten-Match</p>
//                     <p class="recipe-duration">
//                         <i class="fa-solid fa-stopwatch"></i>
//                         ${data.readyInMinutes}min
//                     </p>
//                 </div>
//             `;
//             card.addEventListener("click", () => {
//                 sessionStorage.setItem("selectedRecipe", JSON.stringify(data));
//             });
//             container.appendChild(card);
//         } catch (err) {
//             console.error(`Fehler beim Laden von Rezept-ID ${recipeId}:`, err);
//         }
//     }
//
//     // Kategorie-Buttons anzeigen
//     renderCategoryButtons(allCategories);
// }
//
// function getMatch(recipe) {
//     const used = recipe.usedIngredientCount;
//     const missed = recipe.missedIngredientCount;
//     return Math.round((used / (used + missed)) * 100);
// }
//
// function renderCategoryButtons(categoriesSet) {
//     const categoriesContainer = document.querySelector('.categories');
//
//     // "All"-Button zuerst
//     const allButton = document.createElement('button');
//     allButton.className = 'category';
//     allButton.textContent = 'All';
//     categoriesContainer.appendChild(allButton);
//
//     // Andere Kategorien
//     [...categoriesSet].sort().forEach(cat => {
//         const btn = document.createElement('button');
//         btn.className = 'category';
//         btn.textContent = cat;
//         categoriesContainer.appendChild(btn);
//     });
// }

// Herz-Button (Speichern) -- nur Toggle Effekt derzeit
document.addEventListener('click', event => {
    const saveButton = event.target.closest('.save-recipe');
    if (saveButton) {
        event.preventDefault();     // Verhindert, dass der <a>-Link ausgeführt wird
        event.stopPropagation();    // Verhindert, dass das Klick-Event weiter hochgeht

        const icon = saveButton.querySelector('i');
        saveButton.classList.toggle('active');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    }
});

const recipes = sessionStorage.getItem('recipes-result');
const fullRecipeData = []; // wird mit vollständigen Rezeptinfos befüllt

if (recipes) {
    displayRecipes(recipes);
} else {
    console.warn('Keine Rezeptdaten gefunden.');
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

            // Speichere vollständige Infos inklusive Kategorien
            fullRecipeData.push({
                id: recipeId,
                match: getMatch(recipe),
                data,
                categories
            });

        } catch (err) {
            console.error(`Fehler beim Laden von Rezept-ID ${recipeId}:`, err);
        }
    }

    renderCategoryButtons(allCategories);
    renderRecipes(fullRecipeData); // Initialanzeige aller Rezepte
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
                <p class="recipe-match">${match}% Zutaten-Match</p>
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
