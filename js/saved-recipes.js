import { getAllRecipes } from './indexeddb.js';

document.addEventListener('DOMContentLoaded', async () => {
    const saved = await getAllRecipes();
    const container = document.querySelector('.recipe-grid');
    container.innerHTML = '';

    saved.forEach(recipe => {
        const card = document.createElement('a');
        card.classList.add('recipe-card');
        card.href = "recipe-detail.html";
        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${recipe.image}" alt="${recipe.title}"/>
                <button class="save-recipe active">
                    <i class="fa-solid fa-heart"></i>
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
        });

        container.appendChild(card);
    });
});
