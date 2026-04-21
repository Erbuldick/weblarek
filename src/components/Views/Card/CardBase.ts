import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";


/**
 * Базовая карточка
 */
export class CardBase<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
        this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
    }

    set price(value: number | null) {
        if (value) {
        this.priceElement.textContent = `${value} синапсов`;
        } else {
        this.priceElement.textContent = "Бесценно";
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }
}