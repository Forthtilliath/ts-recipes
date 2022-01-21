export const sortAlphabetically = (a, b) => a.localeCompare(b);
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
export function searchFilter(e) {
    const el = e?.target;
    const items = el.closest('.list_container').querySelectorAll('li');
    items.forEach((item) => {
        if (item.innerText.toLowerCase().includes(el.value.toLowerCase())) {
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
