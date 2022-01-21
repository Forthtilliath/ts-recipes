class CustomEvent {
    static add(element, type, func) {
        if (element instanceof HTMLElement) {
            element.addEventListener(type, func);
        }
        else {
            element.forEach((el) => el.addEventListener(type, func));
        }
    }
}
export default CustomEvent;
