import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { createComponent, IComponent } from "../base/Component";

export interface ISuccess {
    cost: number;
}

export type SuccessComponent = IComponent<ISuccess> & ISuccess;

export function createSuccess(
    container: HTMLElement,
    events: IEvents
): SuccessComponent {
    const component = createComponent<ISuccess>(container);

    const descriptionElement = ensureElement<HTMLElement>(
        ".order-success__description",
        container
    );
    const buttonElement = ensureElement<HTMLButtonElement>(
        ".order-success__close",
        container
    );

    buttonElement.addEventListener("click", () => {
        events.emit("modal:close");
    });

    Object.defineProperty(component, 'cost', {
        set(value: number) {
            descriptionElement.textContent = `Списано ${value} синапсов`;
        },
        enumerable: true,
        configurable: true
    });

    return component as SuccessComponent;
}