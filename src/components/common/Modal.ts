import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{}> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.closeOnOverlay.bind(this));
    }

    get isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        this.events.emit('modal:close');
    }

    private closeOnOverlay(event: MouseEvent) {
        if (event.target === this.container) {
        this.close();
        }
    }

    render(data?: { content: HTMLElement }): HTMLElement {
        if (data?.content) this.content = data.content;
        this.open();
        return this.container;
    }
}