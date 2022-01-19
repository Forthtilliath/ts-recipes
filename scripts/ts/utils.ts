export const compareArrays = (array1: any[], array2: any[]) => JSON.stringify(array1) === JSON.stringify(array2);

/**
 * Tri en ordre alphabétique sans tenir compte de la casse
 * @param a Mot A
 * @param b Mot B
 */
// export const sortAlphabetically = (a: string, b: string) => a.toLowerCase() > b.toLowerCase() ? 1 : -1;
export const sortAlphabetically = (a: string, b: string) => a.localeCompare(b);

export const createLi = (container: HTMLElement, content: string, fn: (ev: MouseEvent) => void) => {
    const li = document.createElement("li");
    li.innerText = content;
    li.addEventListener('click', fn);
  
    container.appendChild(li);
  }