import { IBuyer, TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Form } from '../common/Form';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<IBuyer> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._cardButton = ensureElement<HTMLButtonElement>('button[name=card]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name=cash]', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name=address]', container);

        this._cardButton.addEventListener('click', () => {
            this.setPayment('online');
        });
        this._cashButton.addEventListener('click', () => {
            this.setPayment('on_delivery');
        });
    }

    set payment(value: TPayment) {
        if (value === 'online') {
            this._cardButton.classList.add('button_alt-active');
            this._cashButton.classList.remove('button_alt-active');
        } else if (value === 'on_delivery') {
            this._cashButton.classList.add('button_alt-active');
            this._cardButton.classList.remove('button_alt-active');
        } else {
            this._cardButton.classList.remove('button_alt-active');
            this._cashButton.classList.remove('button_alt-active');
        }
    }

    get address(): string {
        return this._addressInput.value;
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    private setPayment(type: TPayment) {
        this.payment = type;
        this.events.emit('order:paymentChange', { payment: type });
    }
}