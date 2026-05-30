import { IProduct, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { TEXT } from '../../utils/constants';
import { Component } from '../base/Component';

export class BasketCard extends Component<IProduct & { index: number }> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (actions?.onClick) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) { this._title.textContent = value; }
    set price(value: number | null) {
        this._price.textContent = value === null ? TEXT.PRICELESS : `${value} ${TEXT.PRICE_SUFFIX}`;
    }
    set index(value: number) { this._index.textContent = String(value); }
}