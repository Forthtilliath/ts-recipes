import { listes, containers, updateListes } from './index.js';
import * as EventFunctions from './EventFunctions.js';

/******************************************************************************
 * FONCTIONS UTILITAIRES
 *****************************************************************************/

/**
 * Tri en ordre alphabétique sans tenir compte de la casse
 * @param a Mot A à comparer
 * @param b Mot B à comparer
 */
export const sortAlphabetically = (a: string, b: string) => a.localeCompare(b);

/**
 * Vérifie si une chaine de caractère apparait dans un texte.
 * @param sourceString Texte dans lequel on recherche
 * @param searchString Valeur à rechercher dans le texte
 * @returns
 */
export function compare(sourceString: string, searchString: string) {
    return sourceString.toLowerCase().includes(searchString.toLowerCase());
}

/******************************************************************************
 * FONCTIONS LIEES AUX TAGS
 *****************************************************************************/

/**
 * Génère un tag à partir de l'item cliqué.
 * @param e Item de la liste d'une boxe
 */
export function createTag(e: Event, customClass: string | null = null) {
    const el = e?.target as HTMLElement;
    const tag = document.createElement('div');
    customClass ??= 'tag_' + el.parentElement?.getAttribute('id')?.slice(5, -1);

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
 * FONCTIONS LIEES AUX LISTES
 *****************************************************************************/

/**
 * Génère un li à ajouter dans un élément
 * @param container Element dans lequel ajouter le **li**
 * @param content Texte contenu dans le **li**
 * @param fn Fonction à déclencher au click du **li**
 */
export const createLi = (container: HTMLElement, content: string, fn: (ev: MouseEvent) => void) => {
    const li = document.createElement('li');
    li.innerText = content;
    li.addEventListener('click', fn);

    container.appendChild(li);
};

/******************************************************************************
 * FONCTIONS LIEES AUX RECETTES
 *****************************************************************************/

/**
 * Génère un élément article contenent la recette
 * @param recipe Données d'une recette
 */
export function createRecipe(recipe: Recipe) {
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

/******************************************************************************
 * FONCTIONS LIEES AUX FILTRES
 *****************************************************************************/

/**
 * Filtre les éléments en fonction de la recherche principale
 * @param e Input
 */
export function searchFilter(e: Event) {
    const el = e.target as HTMLInputElement;
    const input = el.closest('.search_input_wrapper')!.querySelector('input')!;

    containers.mainResults.innerHTML = '';

    if (input.value.length >= 3) {
        containers.mainInput.classList.add('active');
        
        searchTagsInComponants(listes.ingredients, input, 'tag_ingredient');
        searchTagsInComponants(listes.appliances, input, 'tag_appliance');
        searchTagsInComponants(listes.ustensiles, input, 'tag_ustensile');
    } else {
        containers.mainInput.classList.remove('active');
    }
}

function searchTagsInComponants(liste:NodeListOf<HTMLLIElement>, input: HTMLInputElement, className: string) {
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

export function getFilteredTags(list: NodeListOf<HTMLLIElement>, value: string) {
    return [...list].filter((item) => compare(item.innerText, value));
}

/**
 * Filtre les éléments en fonction de la recherche
 * @param e Input
 */
export function searchFilterTag(e: Event) {
    const el = e.target as HTMLInputElement;
    const items = el.closest('.list_container')!.querySelectorAll('li');

    items.forEach((item) => {
        if (compare(item.innerText, el.value)) {
            item.style.removeProperty('display');
        } else {
            item.style.setProperty('display', 'none');
        }
    });
}

/**
 * Filtre les éléments en fonction des tags séléectionnés
 * @param items Tableau des éléments de la liste de composants ()
 * @param values Tableau contenant les tags à filtrer
 */
export function tagsFilter(items: NodeListOf<HTMLElement>, values: string[]) {
    items.forEach((item) => {
        item.style.setProperty('display', 'none');
        if (values.includes(item.innerText)) {
            item.style.removeProperty('display');
        }
    });
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
