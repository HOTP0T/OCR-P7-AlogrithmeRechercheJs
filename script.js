// ALGO DE RECHERCHE AVEC PROGRAMMATION FONCTIONNELLE

document.addEventListener('DOMContentLoaded', () => {
  const recipeCardsContainer = document.getElementById('recipe-cards');
  const searchBar = document.getElementById('search-bar');
  const ingredientFilter = document.getElementById('ingredient-filter');
  const applianceFilter = document.getElementById('appliance-filter');
  const utensilFilter = document.getElementById('utensil-filter');

  fetch('./data/recipes.json')
    .then(response => response.json())
    .then(recipes => {
      // Populate filters
      populateFilters(recipes);

      // Initial render
      renderCards(recipes);

      searchBar.addEventListener('input', () => applyFilters(recipes));
      ingredientFilter.addEventListener('change', () => applyFilters(recipes));
      applianceFilter.addEventListener('change', () => applyFilters(recipes));
      utensilFilter.addEventListener('change', () => applyFilters(recipes));
    });

  function applyFilters(recipes) {
    const searchText = searchBar.value.toLowerCase();
    const selectedIngredient = ingredientFilter.value.toLowerCase();
    const selectedAppliance = applianceFilter.value.toLowerCase();
    const selectedUtensil = utensilFilter.value.toLowerCase();

    const filteredRecipes = recipes.filter(recipe =>
      (recipe.name.toLowerCase().includes(searchText) ||
      recipe.description.toLowerCase().includes(searchText) ||
      recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchText))) &&
      (selectedIngredient === "filtrer par ingrédient" || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedIngredient))) &&
      (selectedAppliance === "filtrer par appareil" || recipe.appliance.toLowerCase().includes(selectedAppliance)) &&
      (selectedUtensil === "filtrer par ustensile" || recipe.ustensils.some(utensil => utensil.toLowerCase().includes(selectedUtensil)))
    );

    renderCards(filteredRecipes);
  }

  function populateFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => ingredients.add(ingredient.ingredient.toLowerCase()));
      appliances.add(recipe.appliance.toLowerCase());
      recipe.ustensils.forEach(utensil => utensils.add(utensil.toLowerCase()));
    });

    addOptionsToSelect(ingredientFilter, Array.from(ingredients));
    addOptionsToSelect(applianceFilter, Array.from(appliances));
    addOptionsToSelect(utensilFilter, Array.from(utensils));
  }

  function addOptionsToSelect(selectElement, options) {
    options.sort().forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
      selectElement.appendChild(optionElement);
    });
  }

  function renderCards(recipes) {
    recipeCardsContainer.innerHTML = '';
    recipes.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'card col-md-4 mb-4';
      card.style.width = '18rem';
      card.innerHTML = `
        <img class="card-img-top" src="${recipe.image}" alt="${recipe.name}">
        <div class="card-body">
          <h5 class="card-title">${recipe.name}</h5>
          <p class="card-text">${recipe.description}</p>
        </div>
      `;
      recipeCardsContainer.appendChild(card);
    });
  }
});