"use strict";

// Version Programmation Fonctionnelle

// Fonction principale de recherche en programmation fonctionnelle
const lancerRecherche = (data, motCle) => {
  APP.motCle = motCle.trim();

  // Conversion de 'data' en tableau si ce n'est pas déjà un tableau
  data = Array.isArray(data) ? data : Array.from(data);

  // Filtrer par mot-clé si un mot-clé est présent
  let resultats = motCle.length !== 0
      ? data.filter(recette => {
          let recetteTexte = [
              ...recette.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()),
              ...recette.ustensils.map(ustensil => ustensil.toLowerCase()),
              recette.name.toLowerCase()
          ].join(" ");
          return recetteTexte.includes(motCle.toLowerCase());
      })
      : data;

  // Ensuite, appliquer les filtres (ingrédients, ustensils, appareils) sur les résultats filtrés par mot-clé
  APP.resultatRechercheRecette = appliquerFiltres(resultats);

  // Afficher les résultats, mettre à jour les filtres, et afficher les tags
  afficherRecettes(APP.resultatRechercheRecette);
  miseAjourFiltres(APP.resultatRechercheRecette);
  afficherTags();
};

// Appliquer les filtres en programmation fonctionnelle
const appliquerFiltres = (data) => {
  const { ingredients, ustensils, appareils } = APP.donneesFiltresSelected;

  // Ne filtrer que si des filtres sont sélectionnés
  if (!ingredients.size && !ustensils.size && !appareils.size) return data;

  // Filtrer fonctionnellement par ingrédients, ustensils et appareils
  const result = data.filter(recipe => {
      const ingredientsMatch = ingredients.size
          ? [...ingredients].every(ing =>
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(ing.toLowerCase()))
            )
          : true;

      const ustensilsMatch = ustensils.size
          ? [...ustensils].every(ust =>
                recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(ust.toLowerCase()))
            )
          : true;

      const appareilsMatch = appareils.size
          ? [...appareils].some(app => recipe.appliance.toLowerCase().includes(app.toLowerCase()))
          : true;

      return ingredientsMatch && ustensilsMatch && appareilsMatch;
  });

  afficherNombreRecette(result);
  return result;
};

const afficherNombreRecette = (recettes) => {
  const recetteCount = document.getElementById("recette-count");

  // Si 'recettes' est un tableau, utilise 'length', sinon 'size' pour les Set
  const nombreDeRecettes = Array.isArray(recettes) ? recettes.length : recettes.size;

  recetteCount.innerText = String(nombreDeRecettes).padStart(2, "0") + " recette(s)";
};

// Mettre à jour les filtres en programmation fonctionnelle
const miseAjourFiltres = (data) => {
  // Conversion de 'data' en tableau pour éviter les problèmes avec Set
  const recettesArray = Array.isArray(data) ? data : Array.from(data);

  if (recettesArray.length > 0) {
    APP.donnees_filtres.ingredients = new Set(
      recettesArray.flatMap(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()))
    );
    APP.donnees_filtres.ustensils = new Set(
      recettesArray.flatMap(recipe => recipe.ustensils.map(ustensil => ustensil.toLowerCase()))
    );
    APP.donnees_filtres.appareils = new Set(
      recettesArray.map(recipe => recipe.appliance.toLowerCase())
    );
  }

  // Mettre à jour les dropdowns avec des tableaux issus des Set
  afficherDropdownIngredientsData(Array.from(APP.donnees_filtres.ingredients));
  afficherDropdownUstensilsData(Array.from(APP.donnees_filtres.ustensils));
  afficherDropdownAppareilsData(Array.from(APP.donnees_filtres.appareils));
};

const resetTags = () => {
    const tagsRender = document.getElementById("tags-render");
    tagsRender.innerHTML="";
    return tagsRender;
}

const afficherTags = () => 
{
    const tagsRender = resetTags();

    const addTag = tag => 
    {
        const buttonTag = document.createElement("button");
        const labelTag = document.createElement("span");
        labelTag.innerText = tag;
        const iconCloseTag = document.createElement("i");
        iconCloseTag.setAttribute("class", "fa fa-times")

        iconCloseTag.addEventListener("click", ($event) => 
        {
            const ingExist = APP.donneesFiltresSelected.ingredients.delete(tag);
            const ustExist = APP.donneesFiltresSelected.ustensils.delete(tag);
            const appExist = APP.donneesFiltresSelected.appareils.delete(tag);

            if (ingExist) 
            {
                const dropdownIngredientsData = document.getElementById("dropdown-filter-data-ingredients");
                const buttonList = dropdownIngredientsData.querySelectorAll("button");

                buttonList.forEach(button => 
                {
                    const span = button.querySelector("span");
                    const closeIcon = button.querySelector("i");

                    if (span.innerText.toLowerCase() === tag)
                    {
                        closeIcon.classList.add("d-none")
                        button.classList.remove("active")
                        button.classList.remove("fw-bold")
                        button.classList.remove("fst-italic")
                    }
                })
            }

            if (ustExist) 
            {
                const dropdownUstensilsData = document.getElementById("dropdown-filter-data-ustensils");
                const buttonList = dropdownUstensilsData.querySelectorAll("button");

                buttonList.forEach(button => 
                {
                    const span = button.querySelector("span");
                    const closeIcon = button.querySelector("i");
                    
                    if (span.innerText.toLowerCase() === tag)
                    {
                        closeIcon.classList.add("d-none")
                        button.classList.remove("active")
                        button.classList.remove("fw-bold")
                        button.classList.remove("fst-italic")
                    }
                })
            }

            if (appExist) 
            {
                const dropdownAppareilsData = document.getElementById("dropdown-filter-data-appareils");
                const buttonList = dropdownAppareilsData.querySelectorAll("button");

                buttonList.forEach(button => 
                {
                    const span = button.querySelector("span");
                    const closeIcon = button.querySelector("i");
                    
                    if (span.innerText.toLowerCase() === tag)
                    {
                        closeIcon.classList.add("d-none")
                        button.classList.remove("active")
                        button.classList.remove("fw-bold")
                        button.classList.remove("fst-italic")
                    }
                })
            }

            lancerRecherche(APP.recettes, APP.motCle);
        })
        
        buttonTag.appendChild(labelTag)
        buttonTag.appendChild(iconCloseTag)
        tagsRender.appendChild(buttonTag);
    }

    APP.donneesFiltresSelected.ingredients.forEach(addTag);
    APP.donneesFiltresSelected.ustensils.forEach(addTag);
    APP.donneesFiltresSelected.appareils.forEach(addTag);
}

const afficherRecettes = (data) => {
    const recettesRender = document.getElementById("recettes-render");
    recettesRender.innerHTML="";

    afficherNombreRecette(data)

    if ("content" in document.createElement("template")) 
    {
        const templateRecette = document.getElementById("recette-template");
        const templateIngredientItem = document.getElementById("ingredient-item-template");

        const callback = recette => 
        {
            const cloneTemplateRecette = templateRecette.content.querySelector("div.recette-item").cloneNode(true);
            cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${time}", recette.time)
            cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${image}", recette.image)
            cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${name}", recette.name)
            cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${description}", recette.description)

            const recettesIngredientsContainer = cloneTemplateRecette.querySelector("#recette-ingredients");

            recette.ingredients.forEach(ing => 
            {
                const cloneTemplateIngredient = templateIngredientItem.content.querySelector("div").cloneNode(true);
                cloneTemplateIngredient.innerHTML = cloneTemplateIngredient.innerHTML.replaceAll("${ingredient}", ing.ingredient)
                cloneTemplateIngredient.innerHTML = cloneTemplateIngredient.innerHTML.replaceAll("${ingredient_quantity}", [ing.quantity, ing.unit].join(' '))
                recettesIngredientsContainer.appendChild(cloneTemplateIngredient)
            })

            recettesRender.appendChild(cloneTemplateRecette)
        }

        [...data].slice(0, 10).forEach(callback);
    }
}

const afficherDropdownIngredientsData = (data) =>
{
    const dropdownIngredientsData = document.getElementById("dropdown-filter-data-ingredients");
    const buttonList = dropdownIngredientsData.querySelectorAll("button");

    buttonList.forEach(button => 
    {
        const span = button.querySelector("span");
        const exist = [...data].map(app => app.toLowerCase()).includes(span.innerText.toLowerCase());
        if (!exist) dropdownIngredientsData.removeChild(button);
    })

    data.forEach(ingredientLabel => 
    {
        let ingredientExist = [...buttonList].map(button => 
        {  
            const span = button.querySelector("span");
            return span.innerText.toLowerCase()
        })
        .includes(ingredientLabel.toLowerCase());

        if (!ingredientExist) 
        {
            const listItemElement = dropdownLink(ingredientLabel.toLowerCase(), "ingredients")
            dropdownIngredientsData.appendChild(listItemElement);
        }
        
    })

}

const afficherDropdownUstensilsData = (data) =>
{
    const dropdownUstensilsData = document.getElementById("dropdown-filter-data-ustensils");
    const buttonList = dropdownUstensilsData.querySelectorAll("button");

    buttonList.forEach(button => 
    {
        const span = button.querySelector("span");
        const exist = [...data].map(app => app.toLowerCase()).includes(span.innerText.toLowerCase());
        if (!exist) dropdownUstensilsData.removeChild(button);
    })

    data.forEach(ustensilLabel => 
    {
        let ustensilExist = [...buttonList].map(button => 
        {  
            const span = button.querySelector("span");
            return span.innerText.toLowerCase()
        })
        .includes(ustensilLabel.toLowerCase());

        if (!ustensilExist) 
        {
            const listItemElement = dropdownLink(ustensilLabel.toLowerCase(), "ustensils")
            dropdownUstensilsData.appendChild(listItemElement);
        }
        
    })

}

const afficherDropdownAppareilsData = (data) =>
{
    const dropdownAppareilsData = document.getElementById("dropdown-filter-data-appareils");
    const buttonList = dropdownAppareilsData.querySelectorAll("button");

    buttonList.forEach(button => 
    {
        const span = button.querySelector("span");
        const exist = [...data].map(app => app.toLowerCase()).includes(span.innerText.toLowerCase());
        if (!exist) dropdownAppareilsData.removeChild(button);
    })

    data.forEach(appareilLabel => 
    {
        let appareilExist = [...buttonList].map(button => 
        {  
            const span = button.querySelector("span");
            return span.innerText.toLowerCase()
        })
        .includes(appareilLabel.toLowerCase());

        if (!appareilExist) 
        {
            const listItemElement = dropdownLink(appareilLabel.toLowerCase(), "appareils")
            dropdownAppareilsData.appendChild(listItemElement);
        }
        
    })

}

const handleOnchangeIngredientsFilterSearch = ($event) => 
{
    const dropdownIngredientsData = document.getElementById("dropdown-filter-data-ingredients");
    dropdownIngredientsData.innerHTML = "";

    const clearInputIngredient = document.querySelector(".dropdown-filter-input-search .ingre-clear")

    if ($event.target.value.trim().length > 0) clearInputIngredient.classList.remove("d-none")
    else clearInputIngredient.classList.add("d-none")

    APP.donnees_filtres.ingredients.forEach(ingredient => 
    {
        if (ingredient.toLowerCase().includes($event.target.value.toLowerCase().trim()))
        {
            dropdownIngredientsData.appendChild(dropdownLink(ingredient, "ingredients"));
        }
    })

}

const handleOnchangeUstensilsFilterSearch = ($event) => 
{
    const dropdownUstensilsData = document.getElementById("dropdown-filter-data-ustensils");
    dropdownUstensilsData.innerHTML = "";

    const clearInputUstensil = document.querySelector(".dropdown-filter-input-search .ustens-clear")

    if ($event.target.value.trim().length > 0) clearInputUstensil.classList.remove("d-none")
    else clearInputUstensil.classList.add("d-none")

    APP.donnees_filtres.ustensils.forEach(ustensil => 
    {
        if (ustensil.toLowerCase().includes($event.target.value.toLowerCase().trim()))
        {
            dropdownUstensilsData.appendChild(dropdownLink(ustensil, "ustensils"));
        }
    })
}

const handleOnchangeAppareilsFilterSearch = ($event) => 
{
    const dropdownAppareilsData = document.getElementById("dropdown-filter-data-appareils");
    dropdownAppareilsData.innerHTML = "";

    const clearInputAppareil = document.querySelector(".dropdown-filter-input-search .app-clear")

    if ($event.target.value.trim().length > 0) clearInputAppareil.classList.remove("d-none")
    else clearInputAppareil.classList.add("d-none")

    APP.donnees_filtres.appareils.forEach(appareil => 
    {
        if (appareil.toLowerCase().includes($event.target.value.toLowerCase().trim()))
        {
            dropdownAppareilsData.appendChild(dropdownLink(appareil, "appareils"));
        }
    })
}

const resetComponents = () => 
{
    resetTags();
    APP.donneesFiltresSelected = { ingredients: new Set([]), ustensils: new Set([]), appareils: new Set([]) }
}

// Afficher les entrées du dropdown en y ajoutant l'évènement au clic
const dropdownLink = (label, type) => 
{
    const textElement = document.createElement("span");
    textElement.innerText = label

    const closeIcon = document.createElement("i")
    closeIcon.setAttribute("class", "fa fa-times-circle d-none")

    const listItemElement = document.createElement("button");
    listItemElement.setAttribute("class", "list-group-item list-group-item-action d-flex justify-content-between align-items-center");
    listItemElement.appendChild(textElement)
    listItemElement.appendChild(closeIcon)

    const eventCall = ($event) => 
    {
        console.log($event.target.tagName.toLowerCase());
        if ($event.target.tagName.toLowerCase() !== "i") {
            closeIcon.classList.remove("d-none")
            listItemElement.classList.add("active")
            listItemElement.classList.add("fw-bold")
            listItemElement.classList.add("fst-italic")
            APP.donneesFiltresSelected[type].add(label)
            lancerRecherche(APP.resultatRechercheRecette, APP.motCle)
        }
    }

    closeIcon.addEventListener("click", ($event) => 
    {
        closeIcon.classList.add("d-none")
        listItemElement.classList.remove("active")
        listItemElement.classList.remove("fw-bold")
        listItemElement.classList.remove("fst-italic")

        APP.donneesFiltresSelected[type].delete(label);
        lancerRecherche(APP.recettes, APP.motCle);
    })

    listItemElement.addEventListener("click", eventCall)
    return listItemElement;
}

// Traiter evenement de la barre de recherche
const handleSubmitSearchForm = ($event) => {
    $event.preventDefault();
    const motCle = document.forms["search-form"]["i-search"].value;

    if (motCle.length > 0 && motCle.length < 3)
        return;

    resetComponents();
    lancerRecherche(APP.recettes, motCle)
}

const handleChangeSearchInputForm = ($event) => {
  $event.preventDefault();
  const motCle = document.forms["search-form"]["i-search"].value.trim();
  const clearMainSearch = document.getElementById("i-clear");

  if (motCle.length > 0) {
      clearMainSearch.classList.remove("d-none");

      // Si le mot clé a 3 caractères ou plus, lancer la recherche en tenant compte des filtres actuels
      if (motCle.length >= 3) {
          lancerRecherche(APP.recettes, motCle);
      }
  } else {
      clearMainSearch.classList.add("d-none");
      lancerRecherche(APP.recettes, "");  // Réinitialiser si la barre est vide
  }
};


// Initalisation de l'application
(function init() {
    lancerRecherche(APP.recettes, "");
    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", handleSubmitSearchForm)

    const searchMainButtonSearch = document.getElementById("i-icon");
    searchMainButtonSearch.addEventListener("click", handleSubmitSearchForm)

    const searchInputForm = document.querySelector("input[name='i-search']");
    searchInputForm.addEventListener("keyup", handleChangeSearchInputForm)

    const clearMainSearch = document.getElementById("i-clear");

    clearMainSearch.addEventListener("click", ($event) => 
    { 
        searchInputForm.value = ""; 
        searchInputForm.dispatchEvent(new Event("keyup"))
        searchInputForm.focus()
    })

    const ingredientsISearch = document.getElementById("ingredients-i-search");
    ingredientsISearch.addEventListener("keyup", handleOnchangeIngredientsFilterSearch);
    ingredientsISearch.addEventListener("focusout", handleOnchangeIngredientsFilterSearch);

    const ustensilsISearch = document.getElementById("ustensils-i-search");
    ustensilsISearch.addEventListener("keyup", handleOnchangeUstensilsFilterSearch);
    ustensilsISearch.addEventListener("focusout", handleOnchangeIngredientsFilterSearch);

    const appareilsISearch = document.getElementById("appareils-i-search");
    appareilsISearch.addEventListener("keyup", handleOnchangeAppareilsFilterSearch);
    appareilsISearch.addEventListener("focusout", handleOnchangeIngredientsFilterSearch);

    const clearInputSearchIngredient = document.querySelector("#dropdown-filter-ingredients i.fa-times")

    clearInputSearchIngredient.addEventListener("click", ($event) => {
        ingredientsISearch.value = ""
        ingredientsISearch.dispatchEvent(new Event("keyup"))
        $event.stopPropagation()
    })

    const clearInputSearchUstensil = document.querySelector("#dropdown-filter-ustensils i.fa-times")

    clearInputSearchUstensil.addEventListener("click", ($event) => {
        ustensilsISearch.value = ""
        ustensilsISearch.dispatchEvent(new Event("keyup"))
        $event.stopPropagation()
    })

    const clearInputSearchAppareil = document.querySelector("#dropdown-filter-appareils i.fa-times")

    clearInputSearchAppareil.addEventListener("click", ($event) => {
        appareilsISearch.value = ""
        appareilsISearch.dispatchEvent(new Event("keyup"))
        $event.stopPropagation()
    })

})();