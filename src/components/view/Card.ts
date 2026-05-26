import { IProduct, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap, TEXT } from '../../utils/constants';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

type CardType = 'catalog' | 'preview' | 'basket';

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLElement;
    protected _description?: HTMLElement;

    constructor(
        container: HTMLElement,
        protected type: CardType,
        protected events: IEvents,
        actions?: ICardActions
    ) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);

        if (type === 'catalog') {
            this._image = ensureElement<HTMLImageElement>('.card__image', container);
            this._category = ensureElement<HTMLElement>('.card__category', container);
        } else if (type === 'preview') {
            this._image = ensureElement<HTMLImageElement>('.card__image', container);
            this._category = ensureElement<HTMLElement>('.card__category', container);
            this._description = ensureElement<HTMLElement>('.card__text', container);
            this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        } else if (type === 'basket') {
            this._index = ensureElement<HTMLElement>('.basket__item-index', container);
            this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        }

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) { this._title.textContent = value; }

    set price(value: number | null) {
        this._price.textContent = value === null ? TEXT.PRICELESS : `${value} ${TEXT.PRICE_SUFFIX}`;
        if (this._button && value === null) {
            this._button.disabled = true;
            this._button.textContent = TEXT.UNAVAILABLE;
        }
    }

    set image(value: string) {
        if (this._image) this._image.src = value;
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = `card__category ${modifier}`;
        }
    }

    set description(value: string) {
        if (this._description) this._description.textContent = value;
    }

    set index(value: number) {
        if (this._index) this._index.textContent = String(value);
    }

    set buttonText(value: string) {
        if (this._button) this._button.textContent = value;
    }
}