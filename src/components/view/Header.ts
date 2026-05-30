import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Header extends Component<{ counter: number }> {
    protected _counter: HTMLElement;
    protected _basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = ensureElement('.header__basket-counter', container);
        this._basketButton = ensureElement('.header__basket', container);
        this._basketButton.addEventListener('click', () => events.emit('basket:open'));
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }
}