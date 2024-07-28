// // #region TEST
// const userCardTemplate = document.querySelector("[data-user-template]")
// const userCardContainer = document.querySelector("[data-user-cards-container]")
// const searchInput = document.querySelector("[data-search]")

// let users = []

// searchInput.addEventListener("input", e => {
//   const value = e.target.value.toLowerCase()
//   console.log(value)
//   users.forEach(user => {
//     const isVisible =
//       user.name.toLowerCase().includes(value) ||
//       user.email.toLowerCase().includes(value)
//     user.element.classList.toggle("hide", !isVisible)
//   })
// })

// fetch("https://jsonplaceholder.typicode.com/users")
//   .then(res => res.json())
//   .then(data => {
//     users = data.map(user => {
//       const card = userCardTemplate.content.cloneNode(true).children[0]
//       const header = card.querySelector("[data-header]")
//       const body = card.querySelector("[data-body]")
//       header.textContent = user.name
//       body.textContent = user.email
//       userCardContainer.append(card)
//       return { name: user.name, email: user.email, element: card }
//     })
//   })
//   // #endregion

document.addEventListener('DOMContentLoaded', () => {
  const recipeCardsContainer = document.getElementById('recipe-cards');
  const searchBar = document.getElementById('search-bar');

  fetch('./data/recipes.json')
    .then(response => response.json())
    .then(recipes => {
      renderCards(recipes);

      searchBar.addEventListener('input', () => {
        const searchText = searchBar.value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe =>
          recipe.name.toLowerCase().includes(searchText) ||
          recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchText))
        );
        renderCards(filteredRecipes);
      });
    });

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