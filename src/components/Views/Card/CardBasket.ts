import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { CardBase } from "./CardBase";

type ICardBasket = Pick<IProduct, "title" | "price"> & { index: number };

interface IActionBasket {
    onClick?(): void;
}

export interface ClassCardBasket {
    new (container: HTMLElement, actions: IActionBasket): Component<ICardBasket>;
}

/**
 * Карточка в корзине покупателя
 */
export class CardBasket extends CardBase<ICardBasket> {
    protected buttonElement: HTMLButtonElement;
    protected indexElement: HTMLSpanElement;

    constructor(container: HTMLElement, actions: IActionBasket) {
        super(container);

        this.buttonElement = ensureElement<HTMLButtonElement>(
        ".card__button",
        this.container,
        );
        this.indexElement = ensureElement<HTMLSpanElement>(
        ".basket__item-index",
        this.container,
        );
        if (actions?.onClick) {
        this.buttonElement.addEventListener("click", actions.onClick);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}