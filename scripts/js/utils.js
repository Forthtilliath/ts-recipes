export const compareArrays = (array1, array2) => JSON.stringify(array1) === JSON.stringify(array2);
export const sortAlphabetically = (a, b) => a.localeCompare(b);
export const createLi = (container, content, fn) => {
    const li = document.createElement("li");
    li.innerText = content;
    li.addEventListener('click', fn);
    container.appendChild(li);
};
