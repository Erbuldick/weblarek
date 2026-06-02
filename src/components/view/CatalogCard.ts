import { IProduct, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { Card } from './Card';

export class CatalogCard extends Card<IProduct> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set image(value: string) {
        this._image.src = value;
    }

    set category(value: string) {
        this._category.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${modifier}`;
    }
}