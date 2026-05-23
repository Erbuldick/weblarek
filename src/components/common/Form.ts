import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        container.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement;
        const field = target.name as keyof T;
        const value = target.value;
        this.onInputChange(field, value);
        });

        container.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        this.events.emit(`${container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit('form:change', { field, value });
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }

    render(data?: Partial<T>): HTMLFormElement {
        if (data) Object.assign(this, data);
        return this.container;
    }
}