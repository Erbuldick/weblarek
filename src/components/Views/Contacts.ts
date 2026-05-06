import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { createForm, FormComponent } from "./Form";

export type IContacts = Pick<IBuyer, "email" | "phone"> & {
    enable: boolean;
    error: object;
};

export type ContactsComponent = FormComponent<IContacts> & {
    email: string;
    phone: string;
};

export function createContacts(
    container: HTMLElement,
    events: IEvents
): ContactsComponent {
    const component = createForm<IContacts>(container) as ContactsComponent;

    const emailElement = ensureElement<HTMLInputElement>('[name="email"]', container);
    const phoneElement = ensureElement<HTMLInputElement>('[name="phone"]', container);

    emailElement.addEventListener("input", () => {
        events.emit("buyer:set", { email: emailElement.value });
    });
    phoneElement.addEventListener("input", () => {
        events.emit("buyer:set", { phone: phoneElement.value });
    });

    container.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();
        events.emit("contacts:close");
    });

    Object.defineProperty(component, 'email', {
        set(value: string) {
            emailElement.value = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(component, 'phone', {
        set(value: string) {
            phoneElement.value = value;
        },
        enumerable: true,
        configurable: true
    });

    return component;
}