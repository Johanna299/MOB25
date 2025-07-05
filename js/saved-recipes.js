// import { getAllRecipes } from './indexeddb.js';
//
// document.addEventListener('DOMContentLoaded', async () => {
//     const saved = await getAllRecipes();
//     const container = document.querySelector('.recipe-grid');
//     container.innerHTML = '';
//
//     saved.forEach(recipe => {
//         const card = document.createElement('a');
//         card.classList.add('recipe-card');
//         card.href = "recipe-detail.html";
//         card.innerHTML = `
//             <div class="image-wrapper">
//                 <img src="${recipe.image}" alt="${recipe.title}"/>
//                 <button class="save-recipe active">
//                     <i class="fa-solid fa-heart"></i>
//                 </button>
//             </div>
//             <div class="recipe-info">
//                 <p class="recipe-title">${recipe.title}</p>
//                 <p class="recipe-duration">
//                     <i class="fa-solid fa-stopwatch"></i>
//                     ${recipe.readyInMinutes}min
//                 </p>
//             </div>
//         `;
//
//         card.addEventListener("click", () => {
//             sessionStorage.setItem("selectedRecipe", JSON.stringify(recipe));
//         });
//
//         container.appendChild(card);
//     });
// });


import { getAllRecipes, isRecipeSaved, saveRecipe, removeRecipe } from './indexeddb.js';

let fullSavedRecipes = []; // für Zugriff auf alle Rezeptdaten (wie in recipe-suggestions.js)

document.addEventListener('DOMContentLoaded', async () => {
    // check if user is offline
    if (!navigator.onLine) {
        // hide button "Back to the suggestions"
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.style.display = 'none';
        }
    }

    const saved = await getAllRecipes();
    fullSavedRecipes = saved; // speichern für späteren Zugriff

    const container = document.querySelector('.recipe-grid');
    container.innerHTML = '';

    for (const recipe of saved) {
        const savedStatus = await isRecipeSaved(recipe.id); // redundant, aber analog zur Vorlage
        const heartClass = savedStatus ? 'fa-solid' : 'fa-regular';
        const activeClass = savedStatus ? 'active' : '';

        const card = document.createElement('a');
        card.classList.add('recipe-card');
        card.href = "recipe-detail.html";
        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${recipe.image}" alt="${recipe.title}"/>
                <button class="save-recipe ${activeClass}">
                    <i class="fa-heart ${heartClass}"></i>
                </button>
            </div>
            <div class="recipe-info">
                <p class="recipe-title">${recipe.title}</p>
                <p class="recipe-duration">
                    <i class="fa-solid fa-stopwatch"></i>
                    ${recipe.readyInMinutes}min
                </p>
            </div>
        `;

        card.addEventListener("click", () => {
            sessionStorage.setItem("selectedRecipe", JSON.stringify(recipe));
            //remember last visited page (for navigating back from recipe-detail.html)
            sessionStorage.setItem("lastPage", "saved-recipes.html");
        });

        container.appendChild(card);
    }
});

// zentrale Event-Delegation (wie in recipe-suggestions.js)
document.addEventListener('click', event => {
    const saveButton = event.target.closest('.save-recipe');
    if (saveButton) {
        event.preventDefault();
        event.stopPropagation();

        const icon = saveButton.querySelector('i');
        saveButton.classList.toggle('active');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');

        // Rezept-ID aus parent card holen via Titel
        const recipeCard = saveButton.closest('.recipe-card');
        const title = recipeCard.querySelector('.recipe-title')?.textContent;

        const recipe = fullSavedRecipes.find(r => r.title === title);

        if (recipe) {
            if (saveButton.classList.contains('active')) {
                saveRecipe(recipe); // sichern
            } else {
                removeRecipe(recipe.id); // löschen
                recipeCard.remove(); // aus Liste entfernen
            }
        }
    }
});

//hide button "Back to the suggestions" if user is offline
window.addEventListener('offline', () => {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) backBtn.style.display = 'none';
});
//show button "Back to the suggestions" if user is online
window.addEventListener('online', () => {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) backBtn.style.display = 'inline-block'; // oder '' für Standard
});
