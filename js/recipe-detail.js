// const params = new URLSearchParams(window.location.search);
// const recipeId = params.get("id");
//
// fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=4c24a4071a244fcda3e1efad2aa6c563`)
//     .then(res => res.json())
//     .then(data => {
//         // Hier Rezeptdaten einfügen (Titel, Zeit, Anleitung, Zutaten, Bild etc.)
//         console.log(data);
//     });

document.querySelectorAll('.save-recipe').forEach(button => {
    button.addEventListener('click', () => {
        const icon = button.querySelector('i');
        button.classList.toggle('active');
        // Toggle zwischen Outline und Solid Icon
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    });
});

const recipe = JSON.parse(sessionStorage.getItem("selectedRecipe"));
if (recipe) {
    // Daten anzeigen
    console.log(recipe);
    displayRecipe(recipe);
} else {
    console.log("Kein Rezept ausgewählt.");
    document.querySelector('.wrapper').textContent = 'Kein Rezept ausgewählt.';
}

function displayRecipe(recipe) {
    const wrapper = document.querySelector('.wrapper');

    // Template als Template Literal (Backticks), dynamisch mit Rezeptdaten
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
        ${[...(recipe.usedIngredients || []), ...(recipe.missedIngredients || [])]
        .map(ing => `<li>${ing.original || ing.name}</li>`)
        .join('')}
      </ul>

      <div class="tabs">
        <span class="tab active">Details</span>
        <span class="tab inactive">Rezept</span>
      </div>

      <p class="recipe-description">
        ${recipe.summary || recipe.instructions || 'Keine Beschreibung vorhanden.'}
      </p>
    </div>
  `;

    // Wrapper vorher leeren (optional)
    wrapper.innerHTML = '';

    // Template als HTML einfügen
    wrapper.insertAdjacentHTML('beforeend', card);
}
