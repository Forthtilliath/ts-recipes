// let buttonsSearch: NodeListOf<HTMLElement>;
import { buttons } from "./index.js";

/**
 * Ouvre la boxe liée à l'input
 * @param e Input cliqué pour ouvrir une boxe
 */
export function handleOpen(e: Event) {
    const button = e.target as HTMLElement;
    const container = button.parentElement!;

    handleClose();
    container.classList.add('search_active');

    const input: HTMLInputElement = container.querySelector('.list_container .search_input')!;
    input.value = '';
    input.focus();
}

/**
 * Ferme toutes les boxes
 */
export function handleClose() {
    buttons.search.forEach((button) => button.parentElement?.classList.remove('search_active'));
}

/**
 * Donne le focus au input du content
 * @param button Input/button sur lequel l'utilisateur a cliqué
 */
export function focusInput(button: HTMLElement) {
    const input: HTMLInputElement = button.parentElement?.querySelector('.list_container .search_input')!;
    input.value = '';
    input.focus();
}
