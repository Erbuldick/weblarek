import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { createCardBase, CardBaseComponent } from "./CardBase";

type CategoryKey = keyof typeof categoryMap;

export type CardBaseCatalogComponent<T> = CardBaseComponent<T> & {
    category: string;
    image: string;
};

export function createCardBaseCatalog<T>(
    container: HTMLElement,
    cdnUrl: string
): CardBaseCatalogComponent<T> {
    // Получаем базовый объект с title/price
    const component = createCardBase<T>(container) as CardBaseCatalogComponent<T>;

    const categotyElement = ensureElement<HTMLElement>(".card__category", container);
    const imageElement = ensureElement<HTMLImageElement>(".card__image", container);

    // Сеттер category
    Object.defineProperty(component, 'category', {
        set(value: string) {
            categotyElement.textContent = value;
            for (const key in categoryMap) {
                categotyElement.classList.toggle(
                    categoryMap[key as CategoryKey],
                    key === value
                );
            }
        },
        enumerable: true,
        configurable: true
    });

    // Сеттер image – используем setImage из базового компонента
    Object.defineProperty(component, 'image', {
        set(value: string) {
            const url = `${cdnUrl}${value}`;
            component.setImage(imageElement, url);
        },
        enumerable: true,
        configurable: true
    });

    return component;
}