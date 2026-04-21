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
 * Класс покупатель
 */
export class Buyer implements IntBuyer{
  protected buyer: IBuyer;

  /**
   * Создает покупателя
   */
  constructor(protected events: IEvents) {
    this.buyer = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
  }

  /**
   * Производит проверку, возвращает объект, в котором ключом, является поле, а значением - проблемы с этим полем
   * Если проблем нет, возвращается пустой объект
   * @returns Найденные ошибки
   */
  public validate(): TError {
    const result: TError = {};
    if (this.buyer.payment.length === 0)
      result["payment"] = "Не указан способ оплаты";
    if (this.buyer.address.length === 0) result["address"] = "Не указан адрес";
    if (this.buyer.email.length === 0)
      result["email"] = "Не указан электронный адрес";
    if (this.buyer.phone.length === 0) result["phone"] = "Не указан телефон";
    return result;
  }

  /**
   * Возвращает покупателя
   * @returns Покупатель
   */
  public getBuyer(): IBuyer {
    return this.buyer;
  }

  /**
   * Устанавливает способ оплаты
   * @param payment Способ оплаты online, cash
   */
  public setPayment(payment: TPayment) {
    this.buyer.payment = payment;
    this.events.emit("buyer:change");
  }

  /**
   * Устанавливает адрес
   * @param address Адрес
   */
  public setAddress(address: string) {
    this.buyer.address = address;
    this.events.emit("buyer:change");
  }

  /**
   * Устанавливает email
   * @param email email
   */
  public setEmail(email: string) {
    this.buyer.email = email;
    this.events.emit("buyer:change");
  }

  /**
   * Устанавливает телефон
   * @param phone Телефон
   */
  public setPhone(phone: string) {
    this.buyer.phone = phone;
    this.events.emit("buyer:change");
  }

  /**
   * Очищает аттрибуты покупателя
   */
  public clear() {
    this.buyer.payment = "";
    this.buyer.address = "";
    this.buyer.email = "";
    this.buyer.phone = "";
    this.events.emit("buyer:change");
  }
}