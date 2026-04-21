import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export type IContacts = Pick<IBuyer, "email" | "phone"> & {
    enable: boolean;
    error: object;
};

/**
 * Ввод контактов покупателя
 */
export class Contacts extends Form<IContacts> {
    protected emailElement: HTMLInputElement;
    protected phoneElement: HTMLInputElement;


    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.emailElement = ensureElement<HTMLInputElement>(
        '[name="email"]',
        this.container,
        );
        this.phoneElement = ensureElement<HTMLInputElement>(
        '[name="phone"]',
        this.container,
        );
        this.emailElement.addEventListener("input", () => {
            this.events.emit("buyer:set", {email: this.emailElement.value});
        })
        this.phoneElement.addEventListener("input", () => {
            this.events.emit("buyer:set", {phone: this.phoneElement.value});
        })
        this.container.addEventListener("submit", (event: SubmitEvent) => {
            event.preventDefault();
            this.events.emit("contacts:close");
        })

    }

    set email(value: string) {
        this.emailElement.value = value;
    }

    set phone(value: string) {
        this.phoneElement.value = value;
    }

}