"use strict";

// Version Native v2
console.log("Version Native");

// Fonction principale pour lancer la recherche
const lancerRecherche = (data, motCle) => {
  APP.motCle = motCle;
  data = Array.from(data);

  if (motCle.length != 0) {

    // Using set to avoid duplicate results
    APP.resultatRechercheRecette = new Set([]);

    // Initialisation de la recherche
    for (let i = 0; i < data.length; i++) {
      const recette = data[i];
      let recetteTexte = [];

      // Récupérer tous les ingrédients de la recette
      for (let j = 0; j < recette.ingredients.length; j++) {
        recetteTexte.push(recette.ingredients[j].ingredient);
      }

      // Ajouter le nom de la recette et la description
      recetteTexte.push(recette.name);
      recetteTexte.push(recette.description);

      // Convertir le texte en minuscule pour la comparaison
      recetteTexte = recetteTexte.join(" ").toLowerCase();

      // Vérifier si le mot clé est présent dans le texte de la recette
      if (recetteTexte.includes(motCle.toLowerCase())) {
        APP.resultatRechercheRecette.add(recette);
      }
    }

    // Appliquer les filtres aux résultats de la recherche
    APP.resultatRechercheRecette = appliquerFiltres(APP.resultatRechercheRecette);
  } else {
    // Si aucun mot clé, appliquer les filtres à toutes les données
    APP.resultatRechercheRecette = appliquerFiltres(data);
  }

  // Afficher les recettes, mettre à jour les filtres et les tags
  afficherRecettes(APP.resultatRechercheRecette);
  miseAjourFiltres(APP.resultatRechercheRecette);
  afficherTags();
};

// Fonction pour appliquer les filtres sélectionnés
const appliquerFiltres = (data) => {
  // Si aucun filtre sélectionné, retourner les données telles quelles
  if (APP.donneesFiltresSelected.ingredients.size === 0 &&
    APP.donneesFiltresSelected.ustensils.size === 0 &&
    APP.donneesFiltresSelected.appareils.size === 0
  ) { return new Set(data); } // Modifié cette ligne

  const resultIngredients = new Set([]);
  const resultUstensils = new Set([]);
  const resultAppareils = new Set([]);
  const result = new Set([]);

  // Parcourir chaque recette pour vérifier les filtres
  data.forEach(recipe => {
    // Vérifier les ingrédients sélectionnés
    if (APP.donneesFiltresSelected.ingredients.size > 0) {
      const ings = recipe.ingredients.map(ing => ing.ingredient.toLowerCase());

      if ([...APP.donneesFiltresSelected.ingredients].every(el => ings.includes(el.toLowerCase()))) {
        resultIngredients.add(recipe)
      }
    }

    // Vérifier les ustensiles sélectionnés
    if (APP.donneesFiltresSelected.ustensils.size > 0) {
      const ustens = recipe.ustensils.map(usten => usten.toLowerCase());

      if ([...APP.donneesFiltresSelected.ustensils].every(el => ustens.includes(el.toLowerCase()))) {
        resultUstensils.add(recipe)
      }

    }

    // Vérifier les appareils sélectionnés
    if (APP.donneesFiltresSelected.appareils.size > 0) {
      const apps = recipe.appliance.toLowerCase();
      const appsFilter = [...APP.donneesFiltresSelected.appareils].map(app => app.toLowerCase());

      if (appsFilter.includes(apps.toLowerCase())) {
        resultAppareils.add(recipe)
      }

    }

  })

  // Combiner les résultats des différents filtres
  const list = [...resultIngredients, ...resultUstensils, ...resultAppareils];
  const seen = new Set();

  list.forEach(recipe => {
    if (seen.has(recipe)) result.add(recipe)
    else seen.add(recipe)
  });

  // Afficher le nombre de recettes trouvées
  afficherNombreRecette(result)
  return result.size > 0 ? result : seen;
}

// Fonction pour afficher le nombre de recettes
const afficherNombreRecette = (recettes) => {
  const recetteCount = document.getElementById("recette-count");
  recetteCount.innerText = String(recettes.size).padStart(2, "0") + " recette(s)";
}

// Fonction pour mettre à jour les filtres disponibles
const miseAjourFiltres = (data) => {
  if (data.size > 0) {
    // Réinitialiser les filtres
    APP.donnees_filtres.ingredients = new Set([]);
    APP.donnees_filtres.ustensils = new Set([]);
    APP.donnees_filtres.appareils = new Set([]);

    const callback = recette => {
      // Ajouter les ingrédients, ustensiles et appareils aux filtres
      recette.ingredients.forEach(ingredient => APP.donnees_filtres.ingredients.add(ingredient.ingredient.toLowerCase()));
      recette.ustensils.forEach(ustensil => APP.donnees_filtres.ustensils.add(ustensil.toLowerCase()));
      APP.donnees_filtres.appareils.add(recette.appliance.toLowerCase());
    }

    data.forEach(callback);
  }

  // Afficher les données dans les dropdowns correspondants
  afficherDropdownIngredientsData(APP.donnees_filtres.ingredients);
  afficherDropdownUstensilsData(APP.donnees_filtres.ustensils);
  afficherDropdownAppareilsData(APP.donnees_filtres.appareils);
}

// Fonction pour réinitialiser les tags affichés
const resetTags = () => {
  const tagsRender = document.getElementById("tags-render");
  tagsRender.innerHTML = "";
  return tagsRender;
}

// Fonction pour afficher les tags sélectionnés
const afficherTags = () => {
  const tagsRender = resetTags();

  const addTag = tag => {
    // Créer un bouton pour chaque tag
    const buttonTag = document.createElement("button");
    const labelTag = document.createElement("span");
    labelTag.innerText = tag;
    const iconCloseTag = document.createElement("i");
    iconCloseTag.setAttribute("class", "fa fa-times")

    // Événement pour supprimer le tag
    iconCloseTag.addEventListener("click", ($event) => {
      const ingExist = APP.donneesFiltresSelected.ingredients.delete(tag);
      const ustExist = APP.donneesFiltresSelected.ustensils.delete(tag);
      const appExist = APP.donneesFiltresSelected.appareils.delete(tag);

      // Mettre à jour l'affichage des filtres correspondants
      if (ingExist) {
        const dropdownIngredientsData = document.getElementById("dropdown-filter-data-ingredients");
        const buttonList = dropdownIngredientsData.querySelectorAll("button");

        buttonList.forEach(button => {
          const span = button.querySelector("span");
          const closeIcon = button.querySelector("i");

          if (span.innerText.toLowerCase() === tag) {
            closeIcon.classList.add("d-none")
            button.classList.remove("active")
            button.classList.remove("fw-bold")
            button.classList.remove("fst-italic")
          }
        })
      }

      if (ustExist) {
        const dropdownUstensilsData = document.getElementById("dropdown-filter-data-ustensils");
        const buttonList = dropdownUstensilsData.querySelectorAll("button");

        buttonList.forEach(button => {
          const span = button.querySelector("span");
          const closeIcon = button.querySelector("i");

          if (span.innerText.toLowerCase() === tag) {
            closeIcon.classList.add("d-none")
            button.classList.remove("active")
            button.classList.remove("fw-bold")
            button.classList.remove("fst-italic")
          }
        })
      }

      if (appExist) {
        const dropdownAppareilsData = document.getElementById("dropdown-filter-data-appareils");
        const buttonList = dropdownAppareilsData.querySelectorAll("button");

        buttonList.forEach(button => {
          const span = button.querySelector("span");
          const closeIcon = button.querySelector("i");

          if (span.innerText.toLowerCase() === tag) {
            closeIcon.classList.add("d-none")
            button.classList.remove("active")
            button.classList.remove("fw-bold")
            button.classList.remove("fst-italic")
          }
        })
      }

      // Relancer la recherche avec les filtres mis à jour
      lancerRecherche(APP.recettes, APP.motCle);
    })

    buttonTag.appendChild(labelTag)
    buttonTag.appendChild(iconCloseTag)
    tagsRender.appendChild(buttonTag);
  }

  // Ajouter les tags pour chaque type de filtre
  APP.donneesFiltresSelected.ingredients.forEach(addTag);
  APP.donneesFiltresSelected.ustensils.forEach(addTag);
  APP.donneesFiltresSelected.appareils.forEach(addTag);
}

// Fonction pour afficher les recettes
const afficherRecettes = (data) => {
  const recettesRender = document.getElementById("recettes-render");
  recettesRender.innerHTML = "";

  // Afficher le nombre de recettes
  afficherNombreRecette(data)

  if ("content" in document.createElement("template")) {
    const templateRecette = document.getElementById("recette-template");
    const templateIngredientItem = document.getElementById("ingredient-item-template");

    const callback = recette => {
      // Cloner le template de la recette
      const cloneTemplateRecette = templateRecette.content.querySelector("div.recette-item").cloneNode(true);
      cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${time}", recette.time)
      cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${image}", recette.image)
      cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${name}", recette.name)
      cloneTemplateRecette.innerHTML = cloneTemplateRecette.innerHTML.replaceAll("${description}", recette.description)

      const recettesIngredientsContainer = cloneTemplateRecette.querySelector("#recette-ingredients");

      // Ajouter les ingrédients de la recette
      recette.ingredients.forEach(ing => {
        const cloneTemplateIngredient = templateIngredientItem.content.querySelector("div").cloneNode(true);
        cloneTemplateIngredient.innerHTML = cloneTemplateIngredient.innerHTML.replaceAll("${ingredient}", ing.ingredient)
        cloneTemplateIngredient.innerHTML = cloneTemplateIngredient.innerHTML.replaceAll("${ingredient_quantity}", [ing.quantity, ing.unit].join(' '))
        recettesIngredientsContainer.appendChild(cloneTemplateIngredient)
      })

      recettesRender.appendChild(cloneTemplateRecette)
    }

    // Afficher les recettes (limité à 10)
    [...data].slice(0, 10).forEach(callback);
  }
}

// Fonction pour afficher les ingrédients dans le dropdown
const afficherDropdownIngredientsData = (data) => {
  const dropdownIngredientsData = document.getElementById("dropdown-filter-data-ingredients");
  const buttonList = dropdownIngredientsData.querySelectorAll("button");

  // Supprimer les ingrédients qui ne sont plus disponibles
  buttonList.forEach(button => {
    const span = button.querySelector("span");
    const exist = [...data].map(app => app.toLowerCase()).includes(span.innerText.toLowerCase());
    if (!exist) dropdownIngredientsData.removeChild(button);
  })

  // Ajouter les nouveaux ingrédients
  data.forEach(ingredientLabel => {
    let ingredientExist = [...buttonList].map(button => {
      const span = button.querySelector("span");
      return span.innerText.toLowerCase()
    })
      .includes(ingredientLabel.toLowerCase());

    if (!ingredientExist) {
      const listItemElement = dropdownLink(ingredientLabel.toLowerCase(), "ingredients")
      dropdownIngredientsData.appendChild(listItemElement);
    }

  })

}

// Fonction pour afficher les ustensiles dans le dropdown
const afficherDropdownUstensilsData = (data) => {
  const dropdownUstensilsData = document.getElementById("dropdown-filter-data-ustensils");
  const buttonList = dropdownUstensilsData.querySelectorAll("button");

  // Supprimer les ustensiles qui ne sont plus disponibles
  buttonList.forEach(button => {
    const span = button.querySelector("span");
    const exist = [...data].map(app => app.toLowerCase()).includes(span.innerText.toLowerCase());
    if (!exist) dropdownUstensilsData.removeChild(button);
  })

  // Ajouter les nouveaux ustensiles
  data.forEach(ustensilLabel => {
    let ustensilExist = [...buttonList].map(button => {
      const span = button.querySelector("span");
      return span.innerText.toLowerCase()
    })
      .includes(ustensilLabel.toLowerCase());

    if (!ustensilExist) {
      const listItemElement = dropdownLink(ustensilLabel.toLowerCase(), "ustensils")
      dropdownUstensilsData.appendChild(listItemElement);
    }

  })

}

// Fonction pour afficher les appareils dans le dropdown
const afficherDropdownAppareilsData = (data) => {
  const dropdownAppareilsData = document.getElementById("dropdown-filter-data-appareils");
  const buttonList = dropdownAppareilsData.querySelectorAll("button");

  // Supprimer les appareils qui ne sont plus disponibles
  buttonList.forEach(button => {
    const span = button.querySelector("span");
    const exist = [...data].map(app => app.toLowerCase()).includes(span.innerText.toLowerCase());
    if (!exist) dropdownAppareilsData.removeChild(button);
  })

  // Ajouter les nouveaux appareils
  data.forEach(appareilLabel => {
    let appareilExist = [...buttonList].map(button => {
      const span = button.querySelector("span");
      return span.innerText.toLowerCase()
    })
      .includes(appareilLabel.toLowerCase());

    if (!appareilExist) {
      const listItemElement = dropdownLink(appareilLabel.toLowerCase(), "appareils")
      dropdownAppareilsData.appendChild(listItemElement);
    }

  })

}

// Fonction pour gérer la recherche dans le filtre des ingrédients
const handleOnchangeIngredientsFilterSearch = ($event) => {
  const dropdownIngredientsData = document.getElementById("dropdown-filter-data-ingredients");
  dropdownIngredientsData.innerHTML = "";

  const clearInputIngredient = document.querySelector(".dropdown-filter-input-search .ingre-clear")

  if ($event.target.value.trim().length > 0) clearInputIngredient.classList.remove("d-none")
  else clearInputIngredient.classList.add("d-none")

  // Afficher les ingrédients correspondant à la recherche
  APP.donnees_filtres.ingredients.forEach(ingredient => {
    if (ingredient.toLowerCase().includes($event.target.value.toLowerCase().trim())) {
      dropdownIngredientsData.appendChild(dropdownLink(ingredient, "ingredients"));
    }
  })

}

// Fonction pour gérer la recherche dans le filtre des ustensiles
const handleOnchangeUstensilsFilterSearch = ($event) => {
  const dropdownUstensilsData = document.getElementById("dropdown-filter-data-ustensils");
  dropdownUstensilsData.innerHTML = "";

  const clearInputUstensil = document.querySelector(".dropdown-filter-input-search .ustens-clear")

  if ($event.target.value.trim().length > 0) clearInputUstensil.classList.remove("d-none")
  else clearInputUstensil.classList.add("d-none")

  // Afficher les ustensiles correspondant à la recherche
  APP.donnees_filtres.ustensils.forEach(ustensil => {
    if (ustensil.toLowerCase().includes($event.target.value.toLowerCase().trim())) {
      dropdownUstensilsData.appendChild(dropdownLink(ustensil, "ustensils"));
    }
  })
}

// Fonction pour gérer la recherche dans le filtre des appareils
const handleOnchangeAppareilsFilterSearch = ($event) => {
  const dropdownAppareilsData = document.getElementById("dropdown-filter-data-appareils");
  dropdownAppareilsData.innerHTML = "";

  const clearInputAppareil = document.querySelector(".dropdown-filter-input-search .app-clear")

  if ($event.target.value.trim().length > 0) clearInputAppareil.classList.remove("d-none")
  else clearInputAppareil.classList.add("d-none")

  // Afficher les appareils correspondant à la recherche
  APP.donnees_filtres.appareils.forEach(appareil => {
    if (appareil.toLowerCase().includes($event.target.value.toLowerCase().trim())) {
      dropdownAppareilsData.appendChild(dropdownLink(appareil, "appareils"));
    }
  })
}

// Fonction pour réinitialiser les composants
const resetComponents = () => {
  resetTags();
  APP.donneesFiltresSelected = { ingredients: new Set([]), ustensils: new Set([]), appareils: new Set([]) }
}

// Fonction pour créer un élément de dropdown avec événement au clic
const dropdownLink = (label, type) => {
  const textElement = document.createElement("span");
  textElement.innerText = label

  const closeIcon = document.createElement("i")
  closeIcon.setAttribute("class", "fa fa-times-circle d-none")

  const listItemElement = document.createElement("button");
  listItemElement.setAttribute("class", "list-group-item list-group-item-action d-flex justify-content-between align-items-center");
  listItemElement.appendChild(textElement)
  listItemElement.appendChild(closeIcon)

  // Événement au clic sur l'élément du dropdown
  const eventCall = ($event) => {
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

  // Événement au clic sur l'icône de fermeture
  closeIcon.addEventListener("click", ($event) => {
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

// Fonction pour gérer la soumission du formulaire de recherche
const handleSubmitSearchForm = ($event) => {
  $event.preventDefault();
  const motCle = document.forms["search-form"]["i-search"].value;

  if (motCle.length > 0 && motCle.length < 3)
    return;

  lancerRecherche(APP.recettes, motCle)
}

// Fonction pour gérer le changement dans le champ de recherche principal
const handleChangeSearchInputForm = ($event) => {
  $event.preventDefault();
  const motCle = document.forms["search-form"]["i-search"].value;
  const clearMainSearch = document.getElementById("i-clear");

  if (motCle.trim().length > 0) {
    clearMainSearch.classList.remove("d-none")
    return;
  }

  clearMainSearch.classList.add("d-none")
  lancerRecherche(APP.recettes, motCle)
}

// Initialisation de l'application
(function init() {
  // Réinitialiser les filtres et les tags, et lancer la recherche initiale
  resetComponents();

  // Charger toutes les recettes et afficher le nombre total
  lancerRecherche(APP.recettes, "");

  // Ajouter les événements pour la recherche principale
  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", handleSubmitSearchForm);

  const searchMainButtonSearch = document.getElementById("i-icon");
  searchMainButtonSearch.addEventListener("click", handleSubmitSearchForm);

  const searchInputForm = document.querySelector("input[name='i-search']");
  searchInputForm.addEventListener("keyup", handleChangeSearchInputForm);

  const clearMainSearch = document.getElementById("i-clear");
  clearMainSearch.addEventListener("click", ($event) => {
    searchInputForm.value = "";
    searchInputForm.dispatchEvent(new Event("keyup"));
    searchInputForm.focus();
  });

  // Ajouter les événements pour les filtres
  const ingredientsISearch = document.getElementById("ingredients-i-search");
  ingredientsISearch.addEventListener("keyup", handleOnchangeIngredientsFilterSearch);
  ingredientsISearch.addEventListener("focusout", handleOnchangeIngredientsFilterSearch);

  const ustensilsISearch = document.getElementById("ustensils-i-search");
  ustensilsISearch.addEventListener("keyup", handleOnchangeUstensilsFilterSearch);
  ustensilsISearch.addEventListener("focusout", handleOnchangeUstensilsFilterSearch);

  const appareilsISearch = document.getElementById("appareils-i-search");
  appareilsISearch.addEventListener("keyup", handleOnchangeAppareilsFilterSearch);
  appareilsISearch.addEventListener("focusout", handleOnchangeAppareilsFilterSearch);

  // Ajouter les événements pour effacer les champs de recherche des filtres
  const clearInputSearchIngredient = document.querySelector("#dropdown-filter-ingredients i.fa-times");
  clearInputSearchIngredient.addEventListener("click", ($event) => {
    ingredientsISearch.value = "";
    ingredientsISearch.dispatchEvent(new Event("keyup"));
    $event.stopPropagation();
  });

  const clearInputSearchUstensil = document.querySelector("#dropdown-filter-ustensils i.fa-times");
  clearInputSearchUstensil.addEventListener("click", ($event) => {
    ustensilsISearch.value = "";
    ustensilsISearch.dispatchEvent(new Event("keyup"));
    $event.stopPropagation();
  });

  const clearInputSearchAppareil = document.querySelector("#dropdown-filter-appareils i.fa-times");
  clearInputSearchAppareil.addEventListener("click", ($event) => {
    appareilsISearch.value = "";
    appareilsISearch.dispatchEvent(new Event("keyup"));
    $event.stopPropagation();
  });
})();