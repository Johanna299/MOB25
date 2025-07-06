import { getAllRecipes, isRecipeSaved, saveRecipe, removeRecipe } from './indexeddb.js';

//store all saved recipes for later access
let fullSavedRecipes = [];

document.addEventListener('DOMContentLoaded', async () => {
    //check if user is offline
    if (!navigator.onLine) {
        //hide button "Back to the suggestions" when offline
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.style.display = 'none';
        }
    }

    //load saved recipes from IndexedDB
    const saved = await getAllRecipes();
    //store for later use
    fullSavedRecipes = saved;

    const container = document.querySelector('.recipe-grid');
    container.innerHTML = ''; //clear any previous content

    //render each saved recipe as a card
    for (const recipe of saved) {
        //check if recipe is saved
        const savedStatus = await isRecipeSaved(recipe.id); // redundant, aber analog zur Vorlage
        const heartClass = savedStatus ? 'fa-solid' : 'fa-regular';
        const activeClass = savedStatus ? 'active' : '';

        //create the recipe card
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

        //when the card is clicked, store recipe and current page for detail view
        card.addEventListener("click", () => {
            sessionStorage.setItem("selectedRecipe", JSON.stringify(recipe));
            //remember last visited page (for navigating back from recipe-detail.html)
            sessionStorage.setItem("lastPage", "saved-recipes.html");
        });

        //add card to the grid
        container.appendChild(card);
    }
});

//centralized event delegation for all save buttons
document.addEventListener('click', event => {
    const saveButton = event.target.closest('.save-recipe');
    if (saveButton) {
        event.preventDefault(); //prevent navigating to detail page
        event.stopPropagation(); //stop click bubbling

        const icon = saveButton.querySelector('i');
        saveButton.classList.toggle('active');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');

        //get the recipe data by title (from card)
        const recipeCard = saveButton.closest('.recipe-card');
        const title = recipeCard.querySelector('.recipe-title')?.textContent;

        const recipe = fullSavedRecipes.find(r => r.title === title);

        if (recipe) {
            if (saveButton.classList.contains('active')) {
                //save recipe to IndexedDB
                saveRecipe(recipe);
            } else {
                //remove from IndexedDB
                removeRecipe(recipe.id);
                //remove card from list
                recipeCard.remove();
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
    if (backBtn) backBtn.style.display = 'inline-block';
});