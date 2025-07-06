//extract the names of selected ingredients from the DOM
function getIngredientsFromList() {
    //all selected ingredient name elements
    const elements = document.querySelectorAll('.ingredient-text');
    console.log(elements);
    //get trimmed text content and  return as array of strings
    const ingredients = Array.from(elements).map(el => el.textContent.trim());
    return ingredients;
}

//log all selected ingredients
for (let ingredient of getIngredientsFromList()) {
    console.log(ingredient);
}

//fetch recipes from the Spoonacular API based on the selected ingredients
function searchRecipes(ingredients) {
    //combine all selected ingredients into a comma-separated string
    const query = ingredients.join(',');
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=10&apiKey=${SPOONACULAR_API_KEY}`;

    fetch(url)
        //convert the response to JSON
        .then(res => res.json())
        .then(data => {
            console.log("Rezepte:", data);
            //store the recipe results temporarily in sessionStorage
            sessionStorage.setItem('recipes-result', JSON.stringify(data));
            //redirect to the recipe suggestions results page
            window.location.href = 'recipe-suggestions.html';
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

//handle click event on search button
document.querySelector('.btn').addEventListener('click', function(e) {
    //prevent default form submission / page reload
    e.preventDefault();
    //get selected ingredients from UI
    const ingredients = getIngredientsFromList();
    //save ingredients to sessionStorage
    sessionStorage.setItem('ingredients', JSON.stringify(ingredients));
    //start recipe search using selected ingredients
    searchRecipes(ingredients);
});