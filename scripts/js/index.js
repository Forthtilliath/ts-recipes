import { sortAlphabetically, createLi } from './utils.js';
import recipes from './data/recipes.js';
const searchInputs = document.querySelectorAll('.search_header .search_input');
const listIngredients = document.querySelector('#list_ingredients');
const listAppliances = document.querySelector('#list_appliances');
const listUstensiles = document.querySelector('#list_ustensiles');
const tagsContainer = document.querySelector('.tags_container');
const recipesContainer = document.querySelector('.recipes_container');
const buttons = document.querySelectorAll('.btn_search');
const buttonsClose = document.querySelectorAll('.btn_close');
let recipesArr = new Array();
generateDOM();
const ingredients = listIngredients.querySelectorAll('li');
buttons.forEach((input) => input.addEventListener('focus', handleOpen));
buttonsClose.forEach((close) => close.addEventListener('click', handleClose));
searchInputs.forEach((input) => input.addEventListener('input', searchFilter));
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
        addRecipe(recipe);
    }
    console.log(recipesArr);
    const ingredientsArr = [...ingredientsSet].sort(sortAlphabetically);
    const appliancesArr = [...appliancesSet].sort(sortAlphabetically);
    const ustensilesArr = [...ustensilesSet].sort(sortAlphabetically);
    ingredientsArr.forEach((ingredient) => createLi(listIngredients, ingredient, createTag));
    appliancesArr.forEach((appliance) => createLi(listAppliances, appliance, createTag));
    ustensilesArr.forEach((ustensile) => createLi(listUstensiles, ustensile, createTag));
}
function handleOpen(e) {
    const button = e.target;
    handleClose();
    button.parentElement?.classList.add('search_active');
    focusInput(button);
}
function handleClose() {
    buttons.forEach((button) => button.parentElement?.classList.remove('search_active'));
}
function focusInput(button) {
    const input = button.parentElement?.querySelector('.list_container .search_input');
    input.value = '';
    input.focus();
}
function createTag(e) {
    const el = e?.target;
    const tag = document.createElement('div');
    const customClass = 'tag_' + el.parentElement?.getAttribute('id')?.slice(5, -1);
    tag.classList.add('tag', customClass);
    tag.innerHTML = `<span class="tagLabel">${el.innerText}</span>`;
    tag.appendChild(createBtnDeleteTag());
    tagsContainer.appendChild(tag);
    handleClose();
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
}
function updateListes() {
    const tags = document.querySelectorAll('.tagLabel');
    const ingSet = new Set();
    const appSet = new Set();
    const ustSet = new Set();
    const recipesDiv = document.querySelectorAll('.recipe_wrapper');
    tags.forEach((tag) => {
        const type = tag.parentElement.classList[1];
        if (type === 'tag_ingredient') {
            recipesArr.forEach((recipe, i) => {
                if (recipe.ingredients.includes(tag.innerText)) {
                    recipe.ingredients.forEach((ing) => ing !== tag.innerText && ingSet.add(ing));
                    appSet.add(recipe.appliance);
                    recipe.ustensils.forEach((ust) => ustSet.add(ust));
                }
                else {
                    recipesDiv[i].style.setProperty('display', 'none');
                }
            });
        }
    });
    console.log('ingSet', [...ingSet], [...appSet], [...ustSet]);
    const ingItems = document.querySelectorAll('#list_ingredients li');
    const appItems = document.querySelectorAll('#list_appliances li');
    const ustItems = document.querySelectorAll('#list_ustensiles li');
    filterArray2(ingItems, [...ingSet]);
    filterArray2(appItems, [...appSet]);
    filterArray2(ustItems, [...ustSet]);
}
function searchFilter(e) {
    const el = e?.target;
    const items = el.closest('.list_container').querySelectorAll('li');
    filterArray(items, el.value);
}
function filterArray(array, value) {
    array?.forEach((item) => {
        if (item.innerText.toLowerCase().includes(value.toLowerCase())) {
            item.style.removeProperty('display');
        }
        else {
            item.style.setProperty('display', 'none');
        }
    });
}
function filterArray2(array, values) {
    array?.forEach((item) => {
        item.style.setProperty('display', 'none');
        if (values.includes(item.innerText)) {
            item.style.removeProperty('display');
        }
    });
}
function addRecipe(recipe) {
    const article = document.createElement('article');
    article.classList.add('recipe_wrapper');
    article.innerHTML = `
        <h2 class="recipe_title">${recipe.name}</h2>
        <p class="recipe_desc">${recipe.description}</p>
        <div class="recipe_content">
            <header>
                <h3>Ingrédients pour ${recipe.servings} personne${recipe.servings > 1 ? 's' : ''}</h3>
                <span>${recipe.time} min</span>
            </header>
            <ul class="list_ingredients">
                ${recipe.ingredients
        .map((ing) => `<li>${ing.name} ${ing.quantity ? ` : ${ing.quantity}` : ''} ${ing.unit ?? ''}</li>`)
        .join('')}
            </ul>
        </div>
    `;
    recipesContainer?.appendChild(article);
}
