const apiKey = "4c24a4071a244fcda3e1efad2aa6c563"; // Spoonacular API-Key

const input = document.getElementById("ingredient-input");
const suggestionBox = document.getElementById("suggestion-box"); // Das neue Dropdown
const dropdown = document.querySelector(".detached-dropdown");
const ingredientList = document.querySelector(".ingredient-list");
const form = document.getElementById("search-form");

let selectedIngredients = [];

input.addEventListener("input", async () => {
    const query = input.value.trim();
    if (query.length < 2) {
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${encodeURIComponent(query)}&number=10&metaInformation=true&apiKey=${apiKey}`);
        const data = await res.json();
        renderDropdownSuggestions(data);
    } catch (err) {
        console.error("Fehler beim Abrufen der Vorschläge:", err);
    }
});
function renderDropdownSuggestions(suggestions) {
    suggestionBox.innerHTML = "";

    if (suggestions.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }

    suggestions.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("dropdown-item");
        div.innerHTML = `
            <img src="https://spoonacular.com/cdn/ingredients_100x100/${item.image}" alt="${item.name}">
            <span>${item.name}</span>
        `;
        div.addEventListener("click", () => {
            addIngredient(item);
            input.value = "";
            suggestionBox.innerHTML = "";
            suggestionBox.style.display = "none";
        });

        suggestionBox.appendChild(div);
    });

    suggestionBox.style.display = "block";
}

function addIngredient(item) {
    if (selectedIngredients.some(ing => ing.name === item.name)) return;

    selectedIngredients.push(item);

    const li = document.createElement("li");
    li.classList.add("ingredient");

    li.innerHTML = `
        <div class="ingredient-circle">
            <img src="https://spoonacular.com/cdn/ingredients_100x100/${item.image}" alt="${item.name}" />
        </div>
        <span>${item.name}</span>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteBtn.addEventListener("click", () => {
        li.remove();
        selectedIngredients = selectedIngredients.filter(i => i.name !== item.name);
    });

    li.appendChild(deleteBtn);
    ingredientList.appendChild(li);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    try {
        const res = await fetch(
            `https://api.spoonacular.com/food/ingredients/autocomplete?query=${encodeURIComponent(value)}&number=1&metaInformation=true&apiKey=${apiKey}`
        );
        const data = await res.json();

        if (data.length > 0 && data[0].name.toLowerCase() === value.toLowerCase()) {
            addIngredient(data[0]);
        } else {
            alert("Diese Zutat ist nicht verfügbar.");
        }
    } catch (err) {
        console.error("Fehler beim Hinzufügen per Enter:", err);
    }

    input.value = "";
    dropdown.innerHTML = "";
    dropdown.style.display = "none";
});

//test