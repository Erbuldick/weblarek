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
 * Создаёт корзину покупателя.
 * @param events брокер событий
 */
export function createCart(events: IEvents): ICart {
    let products: IProduct[] = [];

    return {
        addProduct(product: IProduct) {
            products.push(product);
            events.emit("basket:change");
        },

        deleteProduct(product: IProduct) {
            products = products.filter((val) => val.id !== product.id);
            events.emit("basket:change");
        },

        count(): number {
            return products.length;
        },

        getProducts(): IProduct[] {
            return products;
        },

        cost(): number {
            return products.reduce((acc, val) => acc + (val.price ?? 0), 0);
        },

        isExist(id: string): boolean {
            return products.some((val) => val.id === id);
        },

        clear() {
            products = [];
            events.emit("basket:change");
        }
    };
}