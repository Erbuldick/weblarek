import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { createComponent, IComponent } from "../base/Component";

export interface IBasket {
    cost: number;
    products: HTMLElement[];
    enable: boolean;
}

export type BasketComponent = IComponent<IBasket> & IBasket; // IBasket уже содержит типы сеттеров

export function createBasket(
    container: HTMLElement,
    events: IEvents
): BasketComponent {
    const component = createComponent<IBasket>(container);

    const priceElement = ensureElement<HTMLSpanElement>(".basket__price", container);
    const buttonElement = ensureElement<HTMLButtonElement>(".basket__button", container);
    const listElement = ensureElement<HTMLUListElement>(".basket__list", container);

    // Обработчик открытия заказа
    buttonElement.addEventListener("click", () => {
        events.emit("order:open");
    });

    // Сеттер стоимости
    Object.defineProperty(component, 'cost', {
        set(value: number) {
            priceElement.textContent = `${value} синапсов`;
        },
        enumerable: true,
        configurable: true
    });

    // Сеттер списка товаров
    Object.defineProperty(component, 'products', {
        set(items: HTMLElement[]) {
            listElement.replaceChildren(...items);
        },
        enumerable: true,
        configurable: true
    });

    // Сеттер активности кнопки
    Object.defineProperty(component, 'enable', {
        set(value: boolean) {
            buttonElement.disabled = !value;
        },
        enumerable: true,
        configurable: true
    });

    return component as BasketComponent;
}