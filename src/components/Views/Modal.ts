import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { createComponent, IComponent } from "../base/Component";

export interface IModalContent {
    content: HTMLElement;
    show: boolean;
}

export type ModalComponent = IComponent<IModalContent> & {
    show: boolean;
    content: HTMLElement;
};

export function createModal(
    container: HTMLElement,
    events: IEvents
): ModalComponent {
    const component = createComponent<IModalContent>(container);

    const contentElement = ensureElement<HTMLElement>(".modal__content", container);
    const buttonElement = ensureElement<HTMLButtonElement>(".modal__close", container);

    // Обработчик Escape
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" || event.code === "Escape") {
            events.emit("modal:close");
        }
    };

    // Закрытие по кнопке
    buttonElement.addEventListener("click", () => events.emit("modal:close"));

    // Закрытие по клику на оверлей
    container.addEventListener("click", (event: MouseEvent) => {
        if (event.target === container) events.emit("modal:close");
    });

    // Сеттер show
    Object.defineProperty(component, 'show', {
        set(value: boolean) {
            if (value) {
                container.classList.add("modal_active");
                document.addEventListener("keydown", handleKeyDown);
            } else {
                container.classList.remove("modal_active");
                document.removeEventListener("keydown", handleKeyDown);
            }
        },
        enumerable: true,
        configurable: true
    });

    // Сеттер content
    Object.defineProperty(component, 'content', {
        set(value: HTMLElement) {
            contentElement.innerHTML = "";
            contentElement.append(value);
        },
        enumerable: true,
        configurable: true
    });

    return component as ModalComponent;
}