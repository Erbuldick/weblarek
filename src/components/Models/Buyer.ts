import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

type TError = Partial<Record<keyof IBuyer, string>>;

export interface IntBuyer {
    validate(): TError;
    getBuyer(): IBuyer;
    setPayment(payment: TPayment): void;
    setAddress(address: string): void;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    clear(): void;
}

/**
 * Создаёт объект покупателя.
 * @param events брокер событий
 */
export function createBuyer(events: IEvents): IntBuyer {
    const buyer: IBuyer = {
        payment: "",
        address: "",
        email: "",
        phone: "",
    };

    return {
        validate(): TError {
            const result: TError = {};
            if (buyer.payment.length === 0)
                result["payment"] = "Не указан способ оплаты";
            if (buyer.address.length === 0)
                result["address"] = "Не указан адрес";
            if (buyer.email.length === 0)
                result["email"] = "Не указан электронный адрес";
            if (buyer.phone.length === 0)
                result["phone"] = "Не указан телефон";
            return result;
        },

        getBuyer(): IBuyer {
            return buyer;
        },

        setPayment(payment: TPayment) {
            buyer.payment = payment;
            events.emit("buyer:change");
        },

        setAddress(address: string) {
            buyer.address = address;
            events.emit("buyer:change");
        },

        setEmail(email: string) {
            buyer.email = email;
            events.emit("buyer:change");
        },

        setPhone(phone: string) {
            buyer.phone = phone;
            events.emit("buyer:change");
        },

        clear() {
            buyer.payment = "";
            buyer.address = "";
            buyer.email = "";
            buyer.phone = "";
            events.emit("buyer:change");
        }
    };
}