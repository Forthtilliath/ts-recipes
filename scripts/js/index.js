import * as Utils from './utils.js';
import recipes from './data/recipes.js';
import * as EventFunctions from './EventFunctions.js';
const containers = {
    ingredients: document.querySelector('#list_ingredients'),
    appliances: document.querySelector('#list_appliances'),
    ustensiles: document.querySelector('#list_ustensiles'),
    tags: document.querySelector('.tags_container'),
    recipes: document.querySelector('.recipes_container'),
};
export const buttons = {
    search: document.querySelectorAll('.btn_search'),
    close: document.querySelectorAll('.btn_close'),
};
const inputs = {
    main: document.querySelector('.search_main_input'),
    componants: document.querySelectorAll('.search_header .search_input'),
};
let recipesArr = new Array();
generateDOM();
const listes = {
    ingredients: containers.ingredients.querySelectorAll('li'),
    appliances: containers.appliances.querySelectorAll('li'),
    ustensiles: containers.ustensiles.querySelectorAll('li'),
    recipes: document.querySelectorAll('.recipe_wrapper'),
};
buttons.search.forEach((input) => input.addEventListener('focus', EventFunctions.handleOpen));
buttons.close.forEach((close) => close.addEventListener('click', EventFunctions.handleClose));
inputs.componants.forEach((input) => input.addEventListener('input', Utils.searchFilter));
function generateDOM() {
    let ingredientsSet = new Set();
    let appliancesSet = new Set();
    let ustensilesSet = new Set();
    for (const recipe of recipes) {
        recipe.ingredients.forEach((ing) => ingredientsSet.add(ing.name));
        appliancesSet.add(recipe.appliance);
        recipe.ustensils.forEach((ust) => ustensilesSet.add(ust));
        recipesArr.push({
            ingredients: recipe.ingredients.map((ing) => ing.name),
            appliance: recipe.appliance,
            ustensils: recipe.ustensils.map((ust) => ust),
        });
        containers.recipes.appendChild(Utils.createRecipe(recipe));
    }
    const ingredientsArr = [...ingredientsSet].sort(Utils.sortAlphabetically);
    const appliancesArr = [...appliancesSet].sort(Utils.sortAlphabetically);
    const ustensilesArr = [...ustensilesSet].sort(Utils.sortAlphabetically);
    ingredientsArr.forEach((ingredient) => Utils.createLi(containers.ingredients, ingredient, createTag));
    appliancesArr.forEach((appliance) => Utils.createLi(containers.appliances, appliance, createTag));
    ustensilesArr.forEach((ustensile) => Utils.createLi(containers.ustensiles, ustensile, createTag));
}
function createTag(e) {
    const el = e?.target;
    const tag = document.createElement('div');
    const customClass = 'tag_' + el.parentElement?.getAttribute('id')?.slice(5, -1);
    tag.innerHTML = `<span class="tagLabel">${el.innerText}</span>`;
    tag.classList.add('tag', customClass);
    tag.appendChild(createBtnDeleteTag());
    containers.tags.appendChild(tag);
    EventFunctions.handleClose();
    updateListes();
}
function createBtnDeleteTag() {
    const btn = document.createElement('button');
    btn.innerHTML = '&#x2715';
    btn.addEventListener('click', removeTag);
    return btn;
}
function removeTag(e) {
    const el = e?.target;
    el.parentElement?.remove();
    cancelFilters();
    updateListes();
}
function updateListes() {
    const tags = document.querySelectorAll('.tagLabel');
    if (!tags.length)
        return;
    const ingSet = new Set();
    const appSet = new Set();
    const ustSet = new Set();
    let tagsArr = {
        tag_ingredient: [],
        tag_appliance: [],
        tag_ustensile: []
    };
    tags.forEach((tag) => {
        const type = tag.parentElement.classList[1];
        tagsArr[type].push(tag.innerText);
    });
    console.log('tagsArr', tagsArr);
    recipesArr.forEach((recipe, i) => {
        if (tagsArr.tag_ingredient?.every((tag) => recipe.ingredients.includes(tag))
            && tagsArr.tag_appliance?.every((tag) => recipe.appliance.includes(tag))
            && tagsArr.tag_ustensile?.every((tag) => recipe.ustensils.includes(tag))) {
            recipe.ingredients.forEach((ing) => !tagsArr.tag_ingredient.includes(ing) && ingSet.add(ing));
            if (!tagsArr.tag_appliance.includes(recipe.appliance))
                appSet.add(recipe.appliance);
            recipe.ustensils.forEach((ing) => !tagsArr.tag_ustensile.includes(ing) && ustSet.add(ing));
        }
        else {
            listes.recipes[i].style.setProperty('display', 'none');
        }
    });
    Utils.tagsFilter(listes.ingredients, [...ingSet]);
    Utils.tagsFilter(listes.appliances, [...appSet]);
    Utils.tagsFilter(listes.ustensiles, [...ustSet]);
}
function cancelFilters() {
    listes.recipes.forEach((rec) => rec.style.removeProperty('display'));
    listes.ingredients.forEach((ing) => ing.style.removeProperty('display'));
    listes.appliances.forEach((app) => app.style.removeProperty('display'));
    listes.ustensiles.forEach((ust) => ust.style.removeProperty('display'));
}
