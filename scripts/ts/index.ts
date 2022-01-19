import { sortAlphabetically, createLi } from './utils.js';
import recipes from './data/recipes.js';

const searchInputs = document.querySelectorAll('.search_header .search_input') as NodeListOf<HTMLElement>;

const listIngredients = document.querySelector('#list_ingredients') as HTMLElement;
const listAppliances = document.querySelector('#list_appliances') as HTMLElement;
const listUstensiles = document.querySelector('#list_ustensiles') as HTMLElement;

const tagsContainer = document.querySelector('.tags_container') as HTMLElement;

const buttons = document.querySelectorAll('.btn_search') as NodeListOf<HTMLElement>;
const buttonsClose = document.querySelectorAll('.btn_close') as NodeListOf<HTMLElement>;

generateDOM();

const ingredients = listIngredients.querySelectorAll('li');

// Ouvertures / Fermetures des boxes
buttons.forEach((input) => input.addEventListener('focus', handleOpen));
buttonsClose.forEach((close) => close.addEventListener('click', handleClose));

/**
 * Génère le DOM des boxes ingrédients, appareils et ustensiles
 */
function generateDOM() {
    let ingredientsSet = new Set<string>();
    let appliancesSet = new Set<string>();
    let ustensilesSet = new Set<string>();
    
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

/**
 * Ouvre la boxe liée à l'input
 * @param e Input cliqué pour ouvrir une boxe
 */
function handleOpen(e: Event) {
    const button = e.target as HTMLElement;

    handleClose();
    button.parentElement?.classList.add('search_active');
    focusInput(button);
}

/**
 * Ferme toutes les boxes
 */
function handleClose() {
    buttons.forEach((button) => button.parentElement?.classList.remove('search_active'));
}

/**
 * Donne le focus au input du content
 * @param button Input/button sur lequel l'utilisateur a cliqué
 */
function focusInput(button: HTMLElement) {
    const input = button.parentElement?.querySelector('.list_container .search_input') as HTMLInputElement;
    input.value = '';
    input.focus();
}

/**
 * Génère un tag à partir de l'item cliqué.
 * @param e Item de la liste d'une boxe
 */
function createTag(e: Event) {
    const el = e?.target as HTMLElement;
    const tag = document.createElement('div');
    // const bg = window.getComputedStyle(el, null).getPropertyValue('background-color');
    const customClass = 'tag_' + el.parentElement?.getAttribute('id')?.slice(5, -1);

    tag.classList.add('tag', customClass);
    // tag.style.setProperty('background-color', bg);

    // tag.innerText = el.innerText;
    // tag.appendChild(createBtnDeleteTag());

    // Label
    tag.innerHTML = `<span class="tagLabel">${el.innerText}</span>`;
    tag.appendChild(createBtnDeleteTag());

    // tag.innerHTML = `
    //     <span class="tagLabel">${el.innerText}</span>
    //     <button class="btnRemoveTag">&#x2715</button>
    // `;
    tagsContainer.appendChild(tag);

    handleClose();
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
}

/**
 * Met à jour les listes à partir des tags
 */
function updateListes() {
    const tags = document.querySelectorAll<HTMLElement>('.tagLabel');

    const el = recipes.map(recipe => {

    });
    
    tags.forEach(tag => {
        console.log('tag', tag.innerText);
        ingredients.forEach(ingredient => {
            if (ingredient.innerText === tag.innerText) {
                ingredient.style.removeProperty('display');
            } else {
                ingredient.style.setProperty('display', 'none');
            }
        })
    })
}

function copyItem(item: HTMLElement) {
    // const a = listIngredients.querySelectorAll('li')[2].cloneNode(true);
    const a = item.cloneNode(true);
    a.addEventListener('click', createTag);

    document.querySelector('#list_ingredients_filtered')?.appendChild(a);
}
