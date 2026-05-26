import { ensureElement, createElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketView } from '../../types';
import { TEXT } from '../../utils/constants';

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => events.emit('basket:order'));
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this._list.replaceChildren(createElement('p', { textContent: TEXT.BASKET_EMPTY }));
            this._button.disabled = true;
        }
    }

    set total(value: number) {
        this._total.textContent = `${value} ${TEXT.BASKET_TOTAL_SUFFIX}`;
    }
}