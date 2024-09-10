document.addEventListener('DOMContentLoaded', () => {
  const recipeCardsContainer = document.getElementById('recipe-cards');
  const searchBar = document.getElementById('search-bar');
  const ingredientFilter = document.getElementById('ingredient-filter');
  const applianceFilter = document.getElementById('appliance-filter');
  const utensilFilter = document.getElementById('utensil-filter');

  fetch('./data/recipes.json')
    .then(response => response.json())
    .then(recipes => {
      setupFilters(recipes);
      setupEventListeners(recipes);
      renderCards(recipes);
    });

  // Initialize filter options
  function setupFilters(recipes) {
    const filterData = extractFilterData(recipes);
    populateSelectOptions(ingredientFilter, filterData.ingredients);
    populateSelectOptions(applianceFilter, filterData.appliances);
    populateSelectOptions(utensilFilter, filterData.utensils);
  }

  // Set up event listeners for filters
  function setupEventListeners(recipes) {
    const applyCurrentFilters = () => applyFilters(recipes);

    searchBar.addEventListener('input', applyCurrentFilters);
    ingredientFilter.addEventListener('change', applyCurrentFilters);
    applianceFilter.addEventListener('change', applyCurrentFilters);
    utensilFilter.addEventListener('change', applyCurrentFilters);
  }

  // Extract unique filter data from recipes
  const extractFilterData = recipes => ({
    ingredients: getUniqueSortedList(recipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient.toLowerCase()))),
    appliances: getUniqueSortedList(recipes.map(recipe => recipe.appliance.toLowerCase())),
    utensils: getUniqueSortedList(recipes.flatMap(recipe => recipe.ustensils.map(utensil => utensil.toLowerCase())))
  });

  // Apply filters to recipes and render results
  const applyFilters = recipes => {
    const searchText = searchBar.value.toLowerCase();
    const selectedIngredient = ingredientFilter.value.toLowerCase();
    const selectedAppliance = applianceFilter.value.toLowerCase();
    const selectedUtensil = utensilFilter.value.toLowerCase();

    const filteredRecipes = recipes.filter(recipe =>
      matchesSearchText(recipe, searchText) &&
      matchesIngredient(recipe, selectedIngredient) &&
      matchesAppliance(recipe, selectedAppliance) &&
      matchesUtensil(recipe, selectedUtensil)
    );

    renderCards(filteredRecipes);
    
  };

  // Check if a recipe matches the search text
  const matchesSearchText = (recipe, searchText) =>
    [recipe.name, recipe.description].some(field => field.toLowerCase().includes(searchText)) ||
    recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchText));

  const matchesIngredient = (recipe, selectedIngredient) =>
    selectedIngredient === "ingrédients" ||
    recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(selectedIngredient));
  
  const matchesAppliance = (recipe, selectedAppliance) =>
    selectedAppliance === "appareils" ||
    recipe.appliance.toLowerCase().includes(selectedAppliance);
  
  const matchesUtensil = (recipe, selectedUtensil) =>
    selectedUtensil === "ustensiles" ||
    recipe.ustensils.some(utensil => utensil.toLowerCase().includes(selectedUtensil));

  // Utility function to get a unique, sorted list
  const getUniqueSortedList = list => [...new Set(list)].sort();

  // Populate select options
  const populateSelectOptions = (selectElement, options) =>
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = capitalizeFirstLetter(option);
      selectElement.appendChild(optionElement);
    });

  // Render recipe cards
  const renderCards = recipes => {
    recipeCardsContainer.innerHTML = '';
    recipes.forEach(recipe => recipeCardsContainer.appendChild(createRecipeCard(recipe)));
  };

  // Create a recipe card element
  const createRecipeCard = recipe => {
    const card = document.createElement('div');
    card.className = 'card col-md-4 mb-4';
    card.innerHTML = `
      <img class="card-img-top" src="${recipe.image}" alt="${recipe.name}">
      <div class="card-body">
        <h5 class="card-title">${recipe.name}</h5>
        <p class="card-text">${recipe.description}</p>
      </div>
    `;
    return card;
  };

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
});