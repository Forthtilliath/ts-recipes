import { sortAlphabetically, createLi } from './utils.js';
import recipes from './data/recipes.js';
const listIngredients = document.querySelector('#list_ingredients');
const listAppliances = document.querySelector('#list_appliances');
const listUstensiles = document.querySelector('#list_ustensiles');
const tagsContainer = document.querySelector('.tags_container');
const buttons = document.querySelectorAll('.btn_search');
const buttonsClose = document.querySelectorAll('.btn_close');
generateDOM();
const ingredients = listIngredients.querySelectorAll('li');
buttons.forEach((input) => input.addEventListener('focus', handleOpen));
buttonsClose.forEach((close) => close.addEventListener('click', handleClose));
function generateDOM() {
    let ingredientsSet = new Set();
    let appliancesSet = new Set();
    let ustensilesSet = new Set();
    for (const recipe of recipes) {
        recipe.ingredients.forEach((ing) => ingredientsSet.add(ing.name));
        appliancesSet.add(recipe.appliance);
        recipe.ustensils.forEach((ust) => ustensilesSet.add(ust));
    }
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
    const listTags = {
        tag_ingredient: new Array(),
        tag_appliance: new Array(),
        tag_ustensile: new Array(),
    };
    tags.forEach((tag) => {
        const type = tag.parentElement.classList[1];
        if (type in listTags) {
            listTags[type].push(tag.innerText);
        }
    });
    console.log(listTags);
    const el = recipes.map((recipe) => { });
}
function copyItem(item) {
    const a = item.cloneNode(true);
    a.addEventListener('click', createTag);
    document.querySelector('#list_ingredients_filtered')?.appendChild(a);
}
