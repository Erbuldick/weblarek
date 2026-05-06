import { ensureElement } from "../../utils/utils";
import { createComponent, IComponent } from "../base/Component";

export type FormComponent<T> = IComponent<T> & {
    enable: boolean;
    error: object;
};

export function createForm<T>(container: HTMLElement): FormComponent<T> {
    const component = createComponent<T>(container) as FormComponent<T>;

    const submitElement = ensureElement<HTMLButtonElement>(
        '[type="submit"]',
        container
    );
    const errorElement = ensureElement<HTMLElement>(".form__errors", container);

    Object.defineProperty(component, 'enable', {
        set(value: boolean) {
            submitElement.disabled = !value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(component, 'error', {
        set(value: object) {
            errorElement.innerHTML = Object.values(value).join("<br/>");
        },
        enumerable: true,
        configurable: true
    });

    return component;
}