import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { CardBase } from "./CardBase";

type CategoryKey = keyof typeof categoryMap;

/**
 * Базовая карточка с наименованием, ценой, категорией и изображением
 */
export class CardBaseCatalog<T> extends CardBase<T> {
    protected categotyElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(
        container: HTMLElement,
        protected cdnUrl: string,
    ) {
        super(container);
        this.categotyElement = ensureElement<HTMLElement>(
        ".card__category",
        this.container,
        );
        this.imageElement = ensureElement<HTMLImageElement>(
        ".card__image",
        this.container,
        );
    }

    set category(value: string) {
        this.categotyElement.textContent = value;

        for (const key in categoryMap) {
        this.categotyElement.classList.toggle(
            categoryMap[key as CategoryKey],
            key === value,
        );
        }
    }

    set image(value: string) {
        const url = `${this.cdnUrl}${value}`;
        this.setImage(this.imageElement, url);
    }
}