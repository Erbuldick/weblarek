import { IBuyer, TPayment } from "../../../types";

// Вынесение типа ошибок в отдельный тип
type CustomerErrors = Partial<Record<keyof IBuyer, string>>;

// Класс Customer представляет собой покупателя и хранит его данные
export class Customer {
    private payment: TPayment = "";
    private email: string = "";
    private phone: string = "";
    private address: string = "";

  // Метод для валидации данных покупателя
    public validateData(): CustomerErrors {
        const errors: CustomerErrors = {};

    if (!this.email) {
        errors.email = "Email обязателен";
    }
    if (!this.phone) {
        errors.phone = "Телефон обязателен";
    }
    if (!this.address) {
        errors.address = "Адрес обязателен";
    }
    if (!this.payment) {
        errors.payment = "Способ оплаты обязателен";
    }

    return errors;
    }

  // Метод для сохранения данных покупателя с возможностью обновлять частичные поля
    public saveData(buyerData: Partial<IBuyer>): void {
        if (buyerData.email !== undefined) {
            this.email = buyerData.email;
        }
        if (buyerData.phone !== undefined) {
            this.phone = buyerData.phone;
        }
        if (buyerData.address !== undefined) {
            this.address = buyerData.address;
        }
        if (buyerData.payment !== undefined) {
            this.payment = buyerData.payment;
        }
    }

  // Метод для получения всех данных покупателя
    public getAllData(): IBuyer {
    return {
        email: this.email,
        phone: this.phone,
        address: this.address,
        payment: this.payment,
        };
    }

  // Метод для очистки всех данных покупателя
    public clearCustomerData(): void {
        this.email = "";
        this.phone = "";
        this.address = "";
        this.payment = "";
    }
}