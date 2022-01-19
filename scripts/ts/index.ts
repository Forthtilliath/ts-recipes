import { sortAlphabetically, createLi } from './utils.js';
import recipes from './data/recipes.js';

// const searchInputs = document.querySelectorAll('.search_header .search_input') as NodeListOf<HTMLElement>;

const listIngredients = document.querySelector<HTMLElement>('#list_ingredients')!;
const listAppliances = document.querySelector<HTMLElement>('#list_appliances')!;
const listUstensiles = document.querySelector<HTMLElement>('#list_ustensiles')!;

const tagsContainer = document.querySelector<HTMLElement>('.tags_container')!;

const buttons = document.querySelectorAll<HTMLElement>('.btn_search');
const buttonsClose = document.querySelectorAll<HTMLElement>('.btn_close');

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
    const customClass = 'tag_' + el.parentElement?.getAttribute('id')?.slice(5, -1);

    tag.classList.add('tag', customClass);

    // Label
    tag.innerHTML = `<span class="tagLabel">${el.innerText}</span>`;
    tag.appendChild(createBtnDeleteTag());

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
    const listTags: ListTags = {
        tag_ingredient: new Array<string>(),
        tag_appliance: new Array<string>(),
        tag_ustensile: new Array<string>(),
    };

    tags.forEach((tag) => {
        const type = tag.parentElement!.classList[1];
        
        if (type in listTags) {
            listTags[type].push(tag.innerText);
        }
    });
    console.log(listTags);
    

    const el = recipes.map((recipe) => {});

    // tags.forEach(tag => {
    //     const type = tag.parentElement!.classList[1];

    //     ingredients.forEach(ingredient => {
    //         if (ingredient.innerText === tag.innerText) {
    //             ingredient.style.removeProperty('display');
    //         } else {
    //             ingredient.style.setProperty('display', 'none');
    //         }
    //     })
    // });
}

function copyItem(item: HTMLElement) {
    // const a = listIngredients.querySelectorAll('li')[2].cloneNode(true);
    const a = item.cloneNode(true);
    a.addEventListener('click', createTag);

    document.querySelector('#list_ingredients_filtered')?.appendChild(a);
}
