import { IProduct, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap, TEXT } from '../../utils/constants';
import { Card } from './Card';

export class PreviewCard extends Card<IProduct> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set image(value: string) {
        this._image.src = value;
    }

    set category(value: string) {
        this._category.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${modifier}`;
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this._button.disabled = true;
            this._button.textContent = TEXT.UNAVAILABLE;
        }
    }
}