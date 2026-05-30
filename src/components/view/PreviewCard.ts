import { IProduct, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap, TEXT } from '../../utils/constants';
import { Component } from '../base/Component';

export class PreviewCard extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) { this._title.textContent = value; }
    set price(value: number | null) {
        this._price.textContent = value === null ? TEXT.PRICELESS : `${value} ${TEXT.PRICE_SUFFIX}`;
        if (value === null) {
            this._button.disabled = true;
            this._button.textContent = TEXT.UNAVAILABLE;
        }
    }
    set image(value: string) { this._image.src = value; }
    set category(value: string) {
        this._category.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${modifier}`;
    }
    set description(value: string) { this._description.textContent = value; }
    set buttonText(value: string) { this._button.textContent = value; }
}