import { IProduct, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap, TEXT } from '../../utils/constants';
import { Component } from '../base/Component';

export class CatalogCard extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) { this._title.textContent = value; }
    set price(value: number | null) {
        this._price.textContent = value === null ? TEXT.PRICELESS : `${value} ${TEXT.PRICE_SUFFIX}`;
    }
    set image(value: string) { this._image.src = value; }
    set category(value: string) {
        this._category.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${modifier}`;
    }
}