import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModalContent {
    content: HTMLElement;
    show: boolean;
}

/**
 * Модальное окно
 */
export class Modal extends Component<IModalContent> {
    protected contentElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
    ) {
        super(container);
        this.contentElement = ensureElement<HTMLElement>(
        ".modal__content",
        this.container,
        );
        this.buttonElement = ensureElement<HTMLButtonElement>(
        ".modal__close",
        this.container,
        );
        this.buttonElement.addEventListener("click", () =>
        this.events.emit("modal:close"),
        );
        this.container.addEventListener("click", (event: MouseEvent) => {
        if (event.target === this.container) this.events.emit("modal:close");
        });
    }

    protected handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" || event.code === "Escape") {
        this.events.emit("modal:close"); // Здесь лучше генерить событие, так как возможно при закрытия модального окна, производятся еще какие-нибудь действия
                                        // как например при закрытия окна об успешном заказе, должно производиться очистка корзины и данных покупателя.
        }
    };

    set show(value: boolean) {
        if (value) {
        this.container.classList.add("modal_active");
        document.addEventListener("keydown", this.handleKeyDown);
        } else {
        this.container.classList.remove("modal_active");
        document.removeEventListener("keydown", this.handleKeyDown);
        }
    }

    set content(value: HTMLElement) {
        this.contentElement.innerHTML = "";
        this.contentElement.append(value);
    }
}