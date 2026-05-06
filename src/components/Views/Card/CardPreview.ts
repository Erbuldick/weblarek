import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { createCardBaseCatalog, CardBaseCatalogComponent } from "./CardBaseCatalog";

export type ICardPreview = Pick<
    IProduct,
    "category" | "title" | "image" | "price" | "description"
> & { enable: boolean; text: string };

export type CardPreviewComponent = CardBaseCatalogComponent<ICardPreview> & {
    description: string;
    enable: boolean;
    text: string;
};

export function createCardPreview(
    container: HTMLElement,
    cdnUrl: string,
    events: IEvents
): CardPreviewComponent {
    const component = createCardBaseCatalog<ICardPreview>(container, cdnUrl) as CardPreviewComponent;

    const descriptionElement = ensureElement<HTMLElement>(".card__text", container);
    const buttonElement = ensureElement<HTMLButtonElement>(".card__button", container);

    buttonElement.addEventListener("click", () => {
        events.emit("preview:button");
    });

    Object.defineProperty(component, 'description', {
        set(value: string) {
            descriptionElement.textContent = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(component, 'enable', {
        set(value: boolean) {
            buttonElement.disabled = !value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(component, 'text', {
        set(value: string) {
            buttonElement.textContent = value;
        },
        enumerable: true,
        configurable: true
    });

    return component;
}