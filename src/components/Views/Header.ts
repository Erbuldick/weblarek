import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { createComponent, IComponent } from "../base/Component";

export interface IHeader {
    counter: number;
}

// Тип для компонента хедера
export type HeaderComponent = IComponent<IHeader> & {
    counter: number; // заглушка, чтобы TS не ругался; на самом деле сеттер.
};

/**
 * Создаёт компонент заголовка
 */
export function createHeader(
    container: HTMLElement,
    events: IEvents
): HeaderComponent {
    const component = createComponent<IHeader>(container);

    // Поиск внутренних элементов
    const counterElement = ensureElement<HTMLElement>(
        ".header__basket-counter",
        container
    );
    const basketButton = ensureElement<HTMLButtonElement>(
        ".header__basket",
        container
    );

    // Логика клика по корзине
    basketButton.addEventListener("click", () => {
        events.emit("basket:open");
    });

    // Определяем сеттер counter
    Object.defineProperty(component, 'counter', {
        set(value: number) {
            counterElement.textContent = String(value);
        },
        enumerable: true,
        configurable: true
    });

    return component as HeaderComponent;
}