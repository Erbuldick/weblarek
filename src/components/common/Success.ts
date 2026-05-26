import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ISuccess } from '../../types';
import { TEXT } from '../../utils/constants';

export class Success extends Component<ISuccess> {
    protected _closeButton: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);

        this._closeButton.addEventListener('click', () => {
            events.emit('success:close');
        });
    }

    set total(value: number) {
        this._description.textContent = `${TEXT.SUCCESS_DESCRIPTION_PREFIX} ${value} ${TEXT.PRICE_SUFFIX}`;
    }
}