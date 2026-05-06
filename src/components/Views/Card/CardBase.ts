import { ensureElement } from "../../../utils/utils";
import { createComponent, IComponent } from "../../base/Component";

export type CardBaseComponent<T> = IComponent<T> & {
    title: string;
    price: number | null;
};

export function createCardBase<T>(container: HTMLElement): CardBaseComponent<T> {
    const component = createComponent<T>(container);

    const titleElement = ensureElement<HTMLElement>(".card__title", container);
    const priceElement = ensureElement<HTMLElement>(".card__price", container);

    // Сеттер title
    Object.defineProperty(component, 'title', {
        set(value: string) {
            titleElement.textContent = value;
        },
        enumerable: true,
        configurable: true
    });

    // Сеттер price
    Object.defineProperty(component, 'price', {
        set(value: number | null) {
            if (value) {
                priceElement.textContent = `${value} синапсов`;
            } else {
                priceElement.textContent = "Бесценно";
            }
        },
        enumerable: true,
        configurable: true
    });

    return component as CardBaseComponent<T>;
}