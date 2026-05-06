import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { createCardBase, CardBaseComponent } from "./CardBase";

type ICardBasket = Pick<IProduct, "title" | "price"> & { index: number };

interface IActionBasket {
    onClick?(): void;
}

export type CardBasketComponent = CardBaseComponent<ICardBasket> & {
    index: number;
};

export function createCardBasket(
    container: HTMLElement,
    actions: IActionBasket
): CardBasketComponent {
    const component = createCardBase<ICardBasket>(container) as CardBasketComponent;

    const buttonElement = ensureElement<HTMLButtonElement>(".card__button", container);
    const indexElement = ensureElement<HTMLSpanElement>(".basket__item-index", container);

    if (actions?.onClick) {
        buttonElement.addEventListener("click", actions.onClick);
    }

    Object.defineProperty(component, 'index', {
        set(value: number) {
            indexElement.textContent = String(value);
        },
        enumerable: true,
        configurable: true
    });

    return component;
}