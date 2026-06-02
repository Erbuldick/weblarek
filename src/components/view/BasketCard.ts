import { IProduct, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

export class BasketCard extends Card<IProduct & { index: number }> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (actions?.onClick) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}