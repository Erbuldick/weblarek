import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * Базовый класс для форм
 */
export class Form<T> extends Component<T> {
    protected submitElement: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
    ) {
        super(container);
        this.submitElement = ensureElement<HTMLButtonElement>(
        '[type="submit"]',
        this.container,
        );
        this.errorElement = ensureElement<HTMLElement>(
        ".form__errors",
        this.container,
        );
    }

    set enable(value: boolean) {
        this.submitElement.disabled = !value;
    }

    set error(value: object) {
        this.errorElement.innerHTML = Object.values(value).join("<br/>");
    }
}