import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ISuccess {
    cost: number;
}

/**
 * Заказ создан
 */
export class Success extends Component<ISuccess> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(
        containet: HTMLElement,
        protected evenets: IEvents,
    ) {
        super(containet);
        this.descriptionElement = ensureElement<HTMLElement>(
        ".order-success__description",
        this.container,
        );
        this.buttonElement = ensureElement<HTMLButtonElement>(
        ".order-success__close",
        this.container,
        );
        this.buttonElement.addEventListener("click", () => {
        this.evenets.emit("modal:close");
        });
    }

    set cost(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}