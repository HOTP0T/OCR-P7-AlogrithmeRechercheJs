// ALGO DE RECHERCHE AVEC BOUCLE NATIVE

document.addEventListener('DOMContentLoaded', () => {
  const recipeCardsContainer = document.getElementById('recipe-cards');
  const searchBar = document.getElementById('search-bar');

  fetch('./data/recipes.json')
    .then(response => response.json())
    .then(recipes => {
      renderCards(recipes);

      searchBar.addEventListener('input', (event) => {
        event.preventDefault();
        const searchText = searchBar.value.toLowerCase();
        if (searchText.length >= 3) {
          const filteredRecipes = [];
          for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            if (recipe.name.toLowerCase().includes(searchText)) {
              filteredRecipes.push(recipe);
              continue;
            }
            for (let j = 0; j < recipe.ingredients.length; j++) {
              const ingredient = recipe.ingredients[j];
              if (ingredient.ingredient.toLowerCase().includes(searchText)) {
                filteredRecipes.push(recipe);
                break;
              }
            }
          }
          renderCards(filteredRecipes);
        } else {
          renderCards(recipes);
        }
      });
    });

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