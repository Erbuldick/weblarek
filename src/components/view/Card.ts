import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { TEXT } from '../../utils/constants';

export abstract class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value === null ? TEXT.PRICELESS : `${value} ${TEXT.PRICE_SUFFIX}`;
    }
}