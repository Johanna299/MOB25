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

    // Wrapper vorher leeren (optional)
    wrapper.innerHTML = '';

    // Template als HTML einfügen
    wrapper.insertAdjacentHTML('beforeend', card);

    // 👉 Tabs aktivieren
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
