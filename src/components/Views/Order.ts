import { IBuyer, TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { createForm, FormComponent } from "./Form";

export type IOrder = Pick<IBuyer, "payment" | "address"> & {
    enable: boolean;
    error: object;
};

export type OrderComponent = FormComponent<IOrder> & {
    payment: TPayment;
    address: string;
};

export function createOrder(
    container: HTMLElement,
    events: IEvents
): OrderComponent {
    const component = createForm<IOrder>(container) as OrderComponent;

    const cardElement = ensureElement<HTMLButtonElement>('[name="card"]', container);
    const cashElement = ensureElement<HTMLButtonElement>('[name="cash"]', container);
    const addressElement = ensureElement<HTMLInputElement>('[name="address"]', container);

    // Обработчики выбора оплаты
    cardElement.addEventListener("click", () => {
        events.emit("buyer:set", { payment: "online" });
    });
    cashElement.addEventListener("click", () => {
        events.emit("buyer:set", { payment: "cash" });
    });

    // Ввод адреса
    addressElement.addEventListener("input", () => {
        events.emit("buyer:set", { address: addressElement.value });
    });

    // Отправка формы → переход к контактам
    container.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();
        events.emit("order:close");
    });

    // Сеттер payment
    Object.defineProperty(component, 'payment', {
        set(value: TPayment) {
            cashElement.classList.toggle("button_alt-active", value === "cash");
            cardElement.classList.toggle("button_alt-active", value === "online");
        },
        enumerable: true,
        configurable: true
    });

    // Сеттер address
    Object.defineProperty(component, 'address', {
        set(value: string) {
            addressElement.value = value;
        },
        enumerable: true,
        configurable: true
    });

    return component;
}