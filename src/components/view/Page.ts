import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Page extends Component<{}> {
    protected _counter: HTMLElement;
    protected _gallery: HTMLElement;
    protected _basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = ensureElement('.header__basket-counter', container);
        this._gallery = ensureElement('.gallery', container);
        this._basketButton = ensureElement('.header__basket', container);

        this._basketButton.addEventListener('click', () => events.emit('basket:open'));
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    set catalog(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
        document.body.classList.add('modal-open');
        } else {
        document.body.classList.remove('modal-open');
        }
    }
}