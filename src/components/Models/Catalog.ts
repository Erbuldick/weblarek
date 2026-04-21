import { IProduct } from "../../types";
import { IEvents } from "../base/Events";


export interface ICatalog {
  setProcucts(products: IProduct[]): void;
  getProducts(): IProduct[];
  setSelected(product: IProduct | null): void;
  getSelected(): IProduct | null;
}

/**
 * Каталог продуктов
 */
export class Catalog implements ICatalog {
  /**
   * Собственно каталог
   */
  protected products: IProduct[];

  protected events: IEvents;

  /**
   * Выбранный продукт
   */
  protected selected: IProduct | null;

  /**
   * Создание каталога
   */
  constructor(events: IEvents) {
    this.products = [];
    this.selected = null;
    this.events = events;
  }

  /**
   * Установка полного списка продуктов
   * @param products Список продуктов
   */
  public setProcucts(products: IProduct[]) {
    this.products = products;
    this.events.emit("catalog:change");
  }

  /**
   * Получение списка продуктов
   * @returns Список продуктов
   */
  public getProducts(): IProduct[] {
    return this.products;
  }

  /**
   * Получение продукта по его идентификатору
   * @param id Идентификатор продукта
   * @returns Продукт
   */
  public getProduct(id: string): IProduct | undefined {
    return this.products.find((val) => val.id === id);
  }

  /**
   * Установка выбранного продукта
   * @param product Продукт
   */
  public setSelected(product: IProduct | null) {
    this.selected = product;
    this.events.emit("catalog:selected");
  }

  /**
   * Получение выбранного продукта
   * @returns Продукт
   */
  public getSelected(): IProduct | null {
    return this.selected;
  }
}