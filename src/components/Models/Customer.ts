import { IBuyer, TPayment } from "../../types";
import { IEvents } from '../base/Events';

type CustomerErrors = Partial<Record<keyof IBuyer, string>>;

export class Customer {
    private payment: TPayment = "";
    private email: string = "";
    private phone: string = "";
    private address: string = "";
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    public validateData(): CustomerErrors {
        const errors: CustomerErrors = {};
        if (!this.email) errors.email = "Email обязателен";
        if (!this.phone) errors.phone = "Телефон обязателен";
        if (!this.address) errors.address = "Адрес обязателен";
        if (!this.payment) errors.payment = "Способ оплаты обязателен";
        return errors;
    }

    public saveData(buyerData: Partial<IBuyer>): void {
        if (buyerData.email !== undefined) this.email = buyerData.email;
        if (buyerData.phone !== undefined) this.phone = buyerData.phone;
        if (buyerData.address !== undefined) this.address = buyerData.address;
        if (buyerData.payment !== undefined) this.payment = buyerData.payment;
        this.events.emit('customer:changed', this.getAllData());
    }

    public getAllData(): IBuyer {
        return { email: this.email, phone: this.phone, address: this.address, payment: this.payment };
    }

    public clearCustomerData(): void {
        this.email = "";
        this.phone = "";
        this.address = "";
        this.payment = "";
        this.events.emit('customer:changed', this.getAllData());
    }
}