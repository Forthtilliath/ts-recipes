import * as Utils from './utils.js';
import recipes from './data/recipes.js';
import * as EventFunctions from './EventFunctions.js';

/******************************************************************************
 * CREATION DES OBJETS CONTENANT MES ELEMENTS
 *****************************************************************************/

/** Liste des containers */
const containers: ListElement = {
    ingredients: document.querySelector('#list_ingredients')!,
    appliances: document.querySelector('#list_appliances')!,
    ustensiles: document.querySelector('#list_ustensiles')!,

    tags: document.querySelector('.tags_container')!,
    recipes: document.querySelector('.recipes_container')!,
};

/** Liste des boutons */
// Export afin de pouvoir y accéder via les events des boutons
export const buttons: ListElements = {
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
const listes = {
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

inputs.componants.forEach((input) => input.addEventListener('input', Utils.searchFilter));

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
    ingredientsArr.forEach((ingredient) => Utils.createLi(containers.ingredients, ingredient, createTag));
    appliancesArr.forEach((appliance) => Utils.createLi(containers.appliances, appliance, createTag));
    ustensilesArr.forEach((ustensile) => Utils.createLi(containers.ustensiles, ustensile, createTag));
}

/******************************************************************************
 * FONCTIONS LIEES AUX TAGS
 *****************************************************************************/

/**
 * Génère un tag à partir de l'item cliqué.
 * @param e Item de la liste d'une boxe
 */
function createTag(e: Event) {
    const el = e?.target as HTMLElement;
    const tag = document.createElement('div');
    const customClass = 'tag_' + el.parentElement?.getAttribute('id')?.slice(5, -1);

    // Label
    tag.innerHTML = `<span class="tagLabel">${el.innerText}</span>`;
    tag.classList.add('tag', customClass);
    tag.appendChild(createBtnDeleteTag());

    containers.tags.appendChild(tag);

    EventFunctions.handleClose();
    updateListes();
}

/**
 * Génère un bouton pour supprimer un tag
 */
function createBtnDeleteTag() {
    const btn = document.createElement('button');
    btn.innerHTML = '&#x2715';
    btn.addEventListener('click', removeTag);
    return btn;
}

/**
 * Supprime le tag
 * @param e Tag
 */
function removeTag(e: Event) {
    const el = e?.target as HTMLElement;
    el.parentElement?.remove();

    cancelFilters();
    updateListes();
}

/******************************************************************************
 * FONCTIONS LIEES AUX FILTRES
 *****************************************************************************/

/**
 * Met à jour les listes à partir des tags
 */
function updateListes() {
    const tags = document.querySelectorAll<HTMLElement>('.tagLabel');

    if (!tags.length) return;

    const ingSet = new Set<string>();
    const appSet = new Set<string>();
    const ustSet = new Set<string>();

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

/**
 * Annule tous les filtres appliqués
 */
function cancelFilters() {
    listes.recipes.forEach((rec) => rec.style.removeProperty('display'));
    listes.ingredients.forEach((ing) => ing.style.removeProperty('display'));
    listes.appliances.forEach((app) => app.style.removeProperty('display'));
    listes.ustensiles.forEach((ust) => ust.style.removeProperty('display'));
}
