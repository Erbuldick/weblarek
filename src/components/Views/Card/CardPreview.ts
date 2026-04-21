import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { CardBaseCatalog } from "./CardBaseCatalog";

export type ICardPreview = Pick<
    IProduct,
    "category" | "title" | "image" | "price" | "description"
> & { enable: boolean; text: string };

/**
 * Preview карточки
 */
export class CardPreview extends CardBaseCatalog<ICardPreview> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        cdnUrl: string,
    protected evenets: IEvents,
    ) {
        super(container, cdnUrl);
        this.descriptionElement = ensureElement<HTMLElement>(
        ".card__text",
        this.container,
        );
        this.buttonElement = ensureElement<HTMLButtonElement>(
        ".card__button",
        this.container,
        );
        this.buttonElement.addEventListener("click", () => {
        this.evenets.emit("preview:button");
        })
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set enable(value: boolean) {
        this.buttonElement.disabled = !value;
    }

    set text(value: string) {
        this.buttonElement.textContent = value;
    }
    }