import { listes, containers, updateListes } from './index.js';
import * as EventFunctions from './EventFunctions.js';
export const sortAlphabetically = (a, b) => a.localeCompare(b);
export function compare(sourceString, searchString) {
    return sourceString.toLowerCase().includes(searchString.toLowerCase());
}
export function createTag(e, customClass = null) {
    const el = e?.target;
    const tag = document.createElement('div');
    customClass ??= 'tag_' + el.parentElement?.getAttribute('id')?.slice(5, -1);
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
export const createLi = (container, content, fn) => {
    const li = document.createElement('li');
    li.innerText = content;
    li.addEventListener('click', fn);
    container.appendChild(li);
};
export function createRecipe(recipe) {
    const article = document.createElement('article');
    article.classList.add('recipe_wrapper');
    article.innerHTML = `
        <h2 class="recipe_title">${recipe.name}</h2>
        <p class="recipe_desc">${recipe.description}</p>
        <div class="recipe_content">
            <header>
                <h3>Ingrédients pour ${recipe.servings} personne${recipe.servings > 1 ? 's' : ''}</h3>
                <div>
                    <svg viewBox="0 0 1280 1280" width="1280pt" height="1280pt">
                        <use xlink:href="#clock"></use>
                    </svg>
                    <span>${recipe.time} min</span>
                </div>
            </header>
            <ul class="list_ingredients">
                ${recipe.ingredients
        .map((ing) => `<li>${ing.name} ${ing.quantity ? ` : ${ing.quantity}` : ''} ${ing.unit ?? ''}</li>`)
        .join('')}
            </ul>
        </div>
  `;
    return article;
}
export function searchFilter(e) {
    const el = e.target;
    const input = el.closest('.search_input_wrapper').querySelector('input');
    containers.mainResults.innerHTML = '';
    if (input.value.length >= 3) {
        containers.mainInput.classList.add('active');
        searchTagsInComponants(listes.ingredients, input, 'tag_ingredient');
        searchTagsInComponants(listes.appliances, input, 'tag_appliance');
        searchTagsInComponants(listes.ustensiles, input, 'tag_ustensile');
    }
    else {
        containers.mainInput.classList.remove('active');
    }
}
function searchTagsInComponants(liste, input, className) {
    const listTag = getFilteredTags(liste, input.value);
    listTag.forEach((tag) => {
        const element = tag.cloneNode(true);
        element.addEventListener('click', (e) => {
            input.value = '';
            containers.mainInput.classList.remove('active');
            createTag(e, className);
        });
        containers.mainResults.appendChild(element);
    });
}
export function getFilteredTags(list, value) {
    return [...list].filter((item) => compare(item.innerText, value));
}
export function searchFilterTag(e) {
    const el = e.target;
    const items = el.closest('.list_container').querySelectorAll('li');
    items.forEach((item) => {
        if (compare(item.innerText, el.value)) {
            item.style.removeProperty('display');
        }
        else {
            item.style.setProperty('display', 'none');
        }
    });
}
export function tagsFilter(items, values) {
    items.forEach((item) => {
        item.style.setProperty('display', 'none');
        if (values.includes(item.innerText)) {
            item.style.removeProperty('display');
        }
    });
}
function cancelFilters() {
    listes.recipes.forEach((rec) => rec.style.removeProperty('display'));
    listes.ingredients.forEach((ing) => ing.style.removeProperty('display'));
    listes.appliances.forEach((app) => app.style.removeProperty('display'));
    listes.ustensiles.forEach((ust) => ust.style.removeProperty('display'));
}
