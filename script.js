// ALGO DE RECHERCHE AVEC BOUCLE NATIVE

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

    const filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const matchesSearchText = recipe.name.toLowerCase().includes(searchText) ||
                                recipe.description.toLowerCase().includes(searchText) ||
                                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchText));
      const matchesIngredient = selectedIngredient === "filtrer par ingrédient" || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedIngredient));
      const matchesAppliance = selectedAppliance === "filtrer par appareil" || recipe.appliance.toLowerCase().includes(selectedAppliance);
      const matchesUtensil = selectedUtensil === "filtrer par ustensile" || recipe.ustensils.some(utensil => utensil.toLowerCase().includes(selectedUtensil));
      
      if (matchesSearchText && matchesIngredient && matchesAppliance && matchesUtensil) {
        filteredRecipes.push(recipe);
      }
    }

    renderCards(filteredRecipes);
  }

  function populateFilters(recipes) {
    const ingredients = {};
    const appliances = {};
    const utensils = {};

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
        if (!ingredients[ingredient]) {
          ingredients[ingredient] = true;
        }
      }
      const appliance = recipe.appliance.toLowerCase();
      if (!appliances[appliance]) {
        appliances[appliance] = true;
      }
      for (let k = 0; k < recipe.ustensils.length; k++) {
        const utensil = recipe.ustensils[k].toLowerCase();
        if (!utensils[utensil]) {
          utensils[utensil] = true;
        }
      }
    }

    addOptionsToSelect(ingredientFilter, Object.keys(ingredients));
    addOptionsToSelect(applianceFilter, Object.keys(appliances));
    addOptionsToSelect(utensilFilter, Object.keys(utensils));
  }

  function addOptionsToSelect(selectElement, options) {
    options.sort();
    for (let i = 0; i < options.length; i++) {
      const option = document.createElement('option');
      option.value = options[i];
      option.textContent = options[i].charAt(0).toUpperCase() + options[i].slice(1);
      selectElement.appendChild(option);
    }
  }

  function renderCards(recipes) {
    recipeCardsContainer.innerHTML = '';
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
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
    }
  }
});