import { IBuyer } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Form } from '../common/Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<IBuyer> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._emailInput = ensureElement<HTMLInputElement>('input[name=email]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name=phone]', container);
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}