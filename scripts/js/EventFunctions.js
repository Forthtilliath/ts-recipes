import { buttons } from "./index.js";
export function handleOpen(e) {
    const button = e.target;
    const container = button.parentElement;
    handleClose();
    container.classList.add('search_active');
    const input = container.querySelector('.list_container .search_input');
    input.value = '';
    input.focus();
}
export function handleClose() {
    buttons.search.forEach((button) => button.parentElement?.classList.remove('search_active'));
}
export function focusInput(button) {
    const input = button.parentElement?.querySelector('.list_container .search_input');
    input.value = '';
    input.focus();
}
