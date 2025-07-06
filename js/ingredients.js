//get relevant DOM elements
const input = document.getElementById("ingredient-input");
const suggestionBox = document.getElementById("suggestion-box");
const dropdown = document.querySelector(".detached-dropdown");
const ingredientList = document.querySelector(".ingredient-list");
const form = document.getElementById("search-form");

//array to keep track of selected ingredients
let selectedIngredients = [];

//listen for user typing in the input field
input.addEventListener("input", async () => {
    //remove leading/trailing spaces
    const query = input.value.trim();

    //only fetch suggestions if input is at least 2 characters
    if (query.length < 2) {
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
        return;
    }

    //fetch autocomplete suggestions from Spoonacular API
    try {
        const res = await fetch(
            `https://api.spoonacular.com/food/ingredients/autocomplete?query=${encodeURIComponent(query)}&number=10&metaInformation=true&apiKey=${SPOONACULAR_API_KEY}`);
        const data = await res.json();
        //display suggestions
        renderDropdownSuggestions(data);
    } catch (err) {
        console.error("Error while fetching suggestions: ", err);
    }
});

//render suggestions in dropdown based on API results
function renderDropdownSuggestions(suggestions) {
    //clear old suggestions
    suggestionBox.innerHTML = "";

    //hide dropdown if there are no suggestions
    if (suggestions.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }

    //create a dropdown item for each suggestion
    suggestions.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("dropdown-item");
        div.innerHTML = `
            <img src="https://spoonacular.com/cdn/ingredients_100x100/${item.image}" alt="${item.name}">
            <span>${item.name}</span>
        `;

        //when suggestion is clicked, add it to the selected list
        div.addEventListener("click", () => {
            addIngredient(item);
            input.value = "";
            suggestionBox.innerHTML = "";
            suggestionBox.style.display = "none";
        });

        //add to suggestion box
        suggestionBox.appendChild(div);
    });

    //show dropdown
    suggestionBox.style.display = "block";
}

//add selected ingredient to the ingredient list
function addIngredient(item) {
    //prevent duplicate ingredients
    if (selectedIngredients.some(ing => ing.name === item.name)) return;
    //add to array
    selectedIngredients.push(item);

    const li = document.createElement("li");
    li.classList.add("ingredient");

    //create list item content with image and name
    li.innerHTML = `
        <div class="ingredient-circle">
            <img src="https://spoonacular.com/cdn/ingredients_100x100/${item.image}" alt="${item.name}" />
        </div>
        <span class="ingredient-text">${item.name}</span>
    `;

    //add delete button to remove ingredient
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    //when delete is clicked, remove ingredient from list and array
    deleteBtn.addEventListener("click", () => {
        li.remove();
        selectedIngredients = selectedIngredients.filter(i => i.name !== item.name);
    });

    li.appendChild(deleteBtn);
    //add to UI
    ingredientList.appendChild(li);
}

//handle form submission
form.addEventListener("submit", async (e) => {
    //prevent default form behavior
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    //fetch exact ingredient match from API
    try {
        const res = await fetch(
            `https://api.spoonacular.com/food/ingredients/autocomplete?query=${encodeURIComponent(value)}&number=1&metaInformation=true&apiKey=${SPOONACULAR_API_KEY}`
        );
        const data = await res.json();

        //if API returns an exact match, add it
        if (data.length > 0 && data[0].name.toLowerCase() === value.toLowerCase()) {
            addIngredient(data[0]);
        } else {
            alert("This ingredient is not available.");
        }
    } catch (err) {
        console.error("Error while adding ingredient via Enter: ", err);
    }

    input.value = "";
    dropdown.innerHTML = "";
    dropdown.style.display = "none";
});