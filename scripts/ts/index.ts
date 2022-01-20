import { sortAlphabetically, createLi } from './utils.js';
import recipes from './data/recipes.js';

const searchInputs = document.querySelectorAll<HTMLElement>('.search_header .search_input')!;

const listIngredients = document.querySelector<HTMLElement>('#list_ingredients')!;
const listAppliances = document.querySelector<HTMLElement>('#list_appliances')!;
const listUstensiles = document.querySelector<HTMLElement>('#list_ustensiles')!;

const tagsContainer = document.querySelector<HTMLElement>('.tags_container')!;
const recipesContainer = document.querySelector<HTMLElement>('.recipes_container');

const buttons = document.querySelectorAll<HTMLElement>('.btn_search');
const buttonsClose = document.querySelectorAll<HTMLElement>('.btn_close');
let recipesArr = new Array<RecipeItem>();

generateDOM();

const ingredients = listIngredients.querySelectorAll('li');

// Ouvertures / Fermetures des boxes
buttons.forEach((input) => input.addEventListener('focus', handleOpen));
buttonsClose.forEach((close) => close.addEventListener('click', handleClose));

searchInputs.forEach((input) => input.addEventListener('input', searchFilter));

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

        // Tableau pour mieux filtrer par la suite
        recipesArr.push({
            ingredients: recipe.ingredients.map((ing) => ing.name) as string[],
            appliance: recipe.appliance,
            ustensils: recipe.ustensils.map((ust) => ust),
            // NOTE: Add recipeItem
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

    const ingSet = new Set<string>();
    const appSet = new Set<string>();
    const ustSet = new Set<string>();

    const recipesDiv = document.querySelectorAll<HTMLElement>('.recipe_wrapper');

    tags.forEach((tag) => {
        const type = tag.parentElement!.classList[1];

        if (type === 'tag_ingredient') {
            recipesArr.forEach((recipe, i) => {
                if (recipe.ingredients.includes(tag.innerText)) {
                    recipe.ingredients.forEach((ing) => ing !== tag.innerText && ingSet.add(ing));
                    appSet.add(recipe.appliance);
                    recipe.ustensils.forEach((ust) => ustSet.add(ust));
                } else {
                    recipesDiv[i].style.setProperty('display', 'none');
                }
            });
        }
    });
    console.log('ingSet', [...ingSet], [...appSet], [...ustSet]);

    const ingItems = document.querySelectorAll<HTMLElement>('#list_ingredients li');
    const appItems = document.querySelectorAll<HTMLElement>('#list_appliances li');
    const ustItems = document.querySelectorAll<HTMLElement>('#list_ustensiles li');
    filterArray2(ingItems, [...ingSet]);
    filterArray2(appItems, [...appSet]);
    filterArray2(ustItems, [...ustSet]);
}

/**
 * Filtre les éléments en fonction de la recherche
 * @param e Input
 */
function searchFilter(e: Event) {
    const el = e?.target as HTMLInputElement;
    const items = el.closest('.list_container')!.querySelectorAll('li');

    filterArray(items, el.value);
}

function filterArray(array: NodeListOf<HTMLElement>, value: string) {
    array?.forEach((item) => {
        if (item.innerText.toLowerCase().includes(value.toLowerCase())) {
            item.style.removeProperty('display');
        } else {
            item.style.setProperty('display', 'none');
        }
    });
}

function filterArray2(array: NodeListOf<HTMLElement>, values: string[]) {
    array?.forEach((item) => {
        item.style.setProperty('display', 'none');
        if (values.includes(item.innerText)) {
            item.style.removeProperty('display');
        }
    });
}

function addRecipe(recipe: Recipe) {
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
