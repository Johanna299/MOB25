//save a recipe with a click on the heart-buttond (TODO derzeit nur farbig, aber ned wirklich gespeichert)
document.querySelectorAll('.save-recipe').forEach(button => {
    button.addEventListener('click', () => {
        const icon = button.querySelector('i');
        button.classList.toggle('active');
        //toggle between filled and outline icon
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    });
});

//get the one selected recipe from recipe-suggestions
const recipe = JSON.parse(sessionStorage.getItem("selectedRecipe"));
if(recipe){
    console.log(recipe);
    displayRecipe(recipe);
} else {
    console.log("Kein Rezept ausgewählt.");
    document.querySelector('.wrapper').textContent = 'Kein Rezept ausgewählt.';
}

//render recipe in detail view
function displayRecipe(recipe) {
    const wrapper = document.querySelector('.wrapper');

    //template filled with dynamic recipe data
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

      <h3 class="section-title">Zutaten</h3>
      <ul class="ingredient-icons">
        ${recipe.extendedIngredients?.map(ing => `<li>${ing.original}</li>`).join('') || '<li>Keine Zutaten verfügbar.</li>'}
      </ul>

      <div class="tabs">
        <span class="tab active">Details</span>
        <span class="tab inactive">Rezept</span>
      </div>

      <p class="recipe-description">
        ${recipe.summary || 'Keine Beschreibung vorhanden.'}
      </p>
    </div>
  `;

    wrapper.innerHTML = '';
    // insert template
    wrapper.insertAdjacentHTML('beforeend', card);

    //activate tabs
    const detailTab = document.querySelector('.tab:nth-child(1)');
    const recipeTab = document.querySelector('.tab:nth-child(2)');
    const description = document.querySelector('.recipe-description');

    detailTab.addEventListener('click', () => {
        detailTab.classList.add('active');
        detailTab.classList.remove('inactive');
        recipeTab.classList.add('inactive');
        recipeTab.classList.remove('active');
        description.innerHTML = recipe.summary || 'Keine Beschreibung vorhanden.';
    });

    recipeTab.addEventListener('click', () => {
        recipeTab.classList.add('active');
        recipeTab.classList.remove('inactive');
        detailTab.classList.add('inactive');
        detailTab.classList.remove('active');
        description.innerHTML = recipe.instructions || 'Keine Anleitung vorhanden.';
    });
}
