/**
 * Tri en ordre alphabétique sans tenir compte de la casse
 * @param a Mot A à comparer
 * @param b Mot B à comparer
 */
export const sortAlphabetically = (a: string, b: string) => a.localeCompare(b);

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
              <span>${recipe.time} min</span>
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

/**
 * Filtre les éléments en fonction de la recherche
 * @param e Input
 */
export function searchFilter(e: Event) {
    const el = e?.target as HTMLInputElement;
    const items = el.closest('.list_container')!.querySelectorAll('li');

    items.forEach((item) => {
        if (item.innerText.toLowerCase().includes(el.value.toLowerCase())) {
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
