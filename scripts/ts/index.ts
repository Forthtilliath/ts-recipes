import * as Utils from './utils.js';
import recipes from './data/recipes.js';
import * as EventFunctions from './EventFunctions.js';

/******************************************************************************
 * CREATION DES OBJETS CONTENANT MES ELEMENTS
 *****************************************************************************/

/** Liste des containers */
export const containers: ListElement = {
    ingredients: document.querySelector('#list_ingredients')!,
    appliances: document.querySelector('#list_appliances')!,
    ustensiles: document.querySelector('#list_ustensiles')!,

    tags: document.querySelector('.tags_container')!,
    recipes: document.querySelector('.recipes_container')!,
    mainInput: document.querySelector('.search_input_wrapper')!,
    mainResults: document.querySelector('.search_main_results')!
};

/** Liste des boutons */
// Export afin de pouvoir y accéder via les events des boutons
export const buttons: ListElements = {
    mainSearch: document.querySelectorAll('#btnSearch')!,
    search: document.querySelectorAll('.btn_search'),
    close: document.querySelectorAll('.btn_close'),
};

/** Liste des champs inputs */
const inputs: ListInputs = {
    main: document.querySelector<HTMLElement>('.search_main_input')!,
    componants: document.querySelectorAll('.search_header .search_input'),
};

let recipesArr = new Array<RecipeItem>();

generateDOM();

/** Liste des composants */
export const listes = {
    ingredients: containers.ingredients.querySelectorAll('li'),
    appliances: containers.appliances.querySelectorAll('li'),
    ustensiles: containers.ustensiles.querySelectorAll('li'),
    recipes: document.querySelectorAll<HTMLDivElement>('.recipe_wrapper'),
};

/******************************************************************************
 * CREATION DES EVENEMENTS
 *****************************************************************************/

// Ouvertures / Fermetures des boxes
buttons.search.forEach((input) => input.addEventListener('focus', EventFunctions.handleOpen));
buttons.close.forEach((close) => close.addEventListener('click', EventFunctions.handleClose));
inputs.main.addEventListener('focus', EventFunctions.handleClose);

buttons.mainSearch[0].addEventListener('click', Utils.searchFilter);
inputs.main.addEventListener('input', Utils.searchFilter);
inputs.componants.forEach((input) => input.addEventListener('input', Utils.searchFilterTag));

/******************************************************************************
 * FONCTIONS LIEES AU DOM
 *****************************************************************************/

/**
 * Génère le DOM des boxes ingrédients, appareils et ustensiles
 */
function generateDOM() {
    // Initialisation des Set()
    let ingredientsSet = new Set<string>();
    let appliancesSet = new Set<string>();
    let ustensilesSet = new Set<string>();

    // Parcours des recettes pour completer les Set et le tableau simplifié des recettes
    for (const recipe of recipes) {
        recipe.ingredients.forEach((ing) => ingredientsSet.add(ing.name));
        appliancesSet.add(recipe.appliance);
        recipe.ustensils.forEach((ust) => ustensilesSet.add(ust));

        // Tableau pour mieux filtrer par la suite
        recipesArr.push({
            ingredients: recipe.ingredients.map((ing) => ing.name) as string[],
            appliance: recipe.appliance,
            ustensils: recipe.ustensils.map((ust) => ust),
        });

        // Ajoute la recette dans le DOM
        containers.recipes.appendChild(Utils.createRecipe(recipe));
    }

    // Trie en ordre alphabétique les listes
    const ingredientsArr = [...ingredientsSet].sort(Utils.sortAlphabetically);
    const appliancesArr = [...appliancesSet].sort(Utils.sortAlphabetically);
    const ustensilesArr = [...ustensilesSet].sort(Utils.sortAlphabetically);

    // Génère les li des listes avec un évenement au click
    ingredientsArr.forEach((ingredient) => Utils.createLi(containers.ingredients, ingredient, Utils.createTag));
    appliancesArr.forEach((appliance) => Utils.createLi(containers.appliances, appliance, Utils.createTag));
    ustensilesArr.forEach((ustensile) => Utils.createLi(containers.ustensiles, ustensile, Utils.createTag));
}

/******************************************************************************
 * FONCTIONS LIEES AUX FILTRES
 *****************************************************************************/

/**
 * Met à jour les listes à partir des tags
 */
export function updateListes() {
    const tags = document.querySelectorAll<HTMLElement>('.tagLabel');

    if (!tags.length) return;

    // Génère un objet contenant tous les tags
    let tagsArr: List = {
        tag_ingredient: [],
        tag_appliance: [],
        tag_ustensile: []
    };
    tags.forEach((tag) => {
        const type = tag.parentElement!.classList[1];
        tagsArr[type].push(tag.innerText);
    });
    console.log('tagsArr', tagsArr);

    const ingSet = new Set<string>();
    const appSet = new Set<string>();
    const ustSet = new Set<string>();

    console.log(recipesArr);
    

    recipesArr.forEach((recipe, i) => {
        // Si tous les tags sont inclus dans une recette, on affiche le tag        
        if (
            tagsArr.tag_ingredient?.every((tag) => recipe.ingredients.includes(tag))
            && tagsArr.tag_appliance?.every((tag) => recipe.appliance.includes(tag))
            && tagsArr.tag_ustensile?.every((tag) => recipe.ustensils.includes(tag))
        ) {
            recipe.ingredients.forEach((ing) => !tagsArr.tag_ingredient.includes(ing) && ingSet.add(ing));
            if(!tagsArr.tag_appliance.includes(recipe.appliance)) appSet.add(recipe.appliance);
            recipe.ustensils.forEach((ing) => !tagsArr.tag_ustensile.includes(ing) && ustSet.add(ing));
        } else {
            listes.recipes[i].style.setProperty('display', 'none');
        }
    });

    Utils.tagsFilter(listes.ingredients, [...ingSet]);
    Utils.tagsFilter(listes.appliances, [...appSet]);
    Utils.tagsFilter(listes.ustensiles, [...ustSet]);
}
