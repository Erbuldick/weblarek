import { IProduct } from "../../types";
import { IEvents } from "../base/Events";


export interface ICart {
  addProduct(product: IProduct): void;
  deleteProduct(product: IProduct): void;
  count(): number;
  getProducts(): IProduct[];
  cost(): number;
  isExist(id: string): boolean;
  clear(): void;
}

/**
 * Корзина покупателя
 */
export class Cart implements ICart {
  protected products: IProduct[];

  /**
   * Создание корзины
   */
  constructor(protected events: IEvents) {
    this.products = [];
  }

  /**
   * Добавляет продукт в корзину
   * @param product Продукт
   */
  public addProduct(product: IProduct) {
    this.products.push(product);
    this.events.emit("basket:change");
  }

  /**
   * Удаляет продукт из корзины
   * @param product Продукт
   */
  public deleteProduct(product: IProduct) {
    this.products = this.products.filter((val) => val.id !== product.id);
    this.events.emit("basket:change");
  }

  /**
   * Возвращает количество продуктов
   * @returns Количество
   */
  public count(): number {
    return this.products.length;
  }

  /**
   * Возвращает список продуктов в корзине
   * @returns Список продуктов
   */
  public getProducts(): IProduct[] {
    return this.products;
  }

  /**
   * Возвращает стоимость продуктов в корзине
   * @returns Стоимость
   */
  public cost(): number {
    return this.products.reduce((acc, val) => acc + (val.price ?? 0), 0);
  }

  /**
   * Проверят наличие продукта в корзине по его идентификатору
   * @param id Идентификатор продукта
   * @returns Признак наличия
   */
  public isExist(id: string): boolean {
    return this.products.some((val) => val.id === id);
  }

  /**
   * Очистка корзины
   */
  public clear() {
    this.products = [];
    this.events.emit("basket:change");
  }
}