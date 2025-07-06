import { saveRecipe, removeRecipe, isRecipeSaved } from './indexeddb.js';

//when the page loads, set the back button link to the last visited page
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.querySelector('.back-btn');
    const lastPage = sessionStorage.getItem("lastPage") || "recipe-suggestions.html";
    backBtn.href = lastPage;
});

document.addEventListener('DOMContentLoaded', async () => {
    //get the one selected recipe from sessionStorage
    const recipe = JSON.parse(sessionStorage.getItem("selectedRecipe"));
    if(recipe){
        console.log(recipe);
        //display the selected recipe in the detail view
        displayRecipe(recipe);
    } else {
        //if no recipe is selected, show a message
        console.log("No recipe selected.");
        document.querySelector('.wrapper').textContent = 'No recipe selected.';
    }
});


//function to render the selected recipe in the detail view
function displayRecipe(recipe) {
    const wrapper = document.querySelector('.wrapper');

    //HTML template for displaying recipe content dynamically
    const card = `
    <div class="recipe-main">
      <div class="image-wrapper large">
        <img src="${recipe.image}" alt="${recipe.title}" />
      </div>
    </div>

    <div class="recipe-details">
      <div class="recipe-meta">
        <h2 class="recipe-title">${recipe.title}</h2>
        <div class="duration">
          <i class="fa-solid fa-stopwatch"></i>
          <span>${recipe.readyInMinutes ? recipe.readyInMinutes + ' min' : 'N/A'}</span>
        </div>
      </div>

      <h3 class="section-title">Ingredients</h3>
      <ul class="ingredient-icons">
        ${recipe.extendedIngredients?.map(ing => `<li>${ing.original}</li>`).join('') || '<li>No ingredients available.</li>'}
      </ul>

      <div class="tabs">
        <span class="tab active">Details</span>
        <span class="tab inactive">Instructions</span>
      </div>

      <p class="recipe-description">
        ${recipe.summary || 'No description available.'}
      </p>
    </div>`;

    wrapper.innerHTML = '';
    //add new recipe content
    wrapper.insertAdjacentHTML('beforeend', card);

    //setup tab functionality (switch between description and instructions)
    const detailTab = document.querySelector('.tab:nth-child(1)');
    const recipeTab = document.querySelector('.tab:nth-child(2)');
    const description = document.querySelector('.recipe-description');

    detailTab.addEventListener('click', () => {
        //show description
        detailTab.classList.add('active');
        detailTab.classList.remove('inactive');
        recipeTab.classList.add('inactive');
        recipeTab.classList.remove('active');
        description.innerHTML = recipe.summary || 'No description available.';
    });

    recipeTab.addEventListener('click', () => {
        //show instructions
        recipeTab.classList.add('active');
        recipeTab.classList.remove('inactive');
        detailTab.classList.add('inactive');
        detailTab.classList.remove('active');
        description.innerHTML = recipe.instructions || 'No instructions available.';
    });

    //initialize the save (heart) button
    const saveButton = document.querySelector('.save-recipe');
    const icon = saveButton.querySelector('i');

    //check if the recipe is already saved in IndexedDB
    isRecipeSaved(recipe.id).then(saved => {
        if (saved) {
            //update UI to show it's saved
            saveButton.classList.add('active');
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        }
    });

    //toggle recipe saved status on button click
    saveButton.addEventListener('click', () => {
        saveButton.classList.toggle('active');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');

        if (saveButton.classList.contains('active')) {
            //save to IndexedDB
            saveRecipe(recipe);
        } else {
            //remove from IndexedDB
            removeRecipe(recipe.id);
        }
    });
}