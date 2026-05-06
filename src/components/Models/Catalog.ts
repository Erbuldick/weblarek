import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export interface ICatalog {
    setProducts(products: IProduct[]): void;
    getProducts(): IProduct[];
    setSelected(product: IProduct | null): void;
    getSelected(): IProduct | null;
}

/**
 * Создаёт каталог продуктов.
 * @param events брокер событий
 */
export function createCatalog(events: IEvents): ICatalog {
    let products: IProduct[] = [];
    let selected: IProduct | null = null;

    return {
        setProducts(newProducts: IProduct[]) {
            products = newProducts;
            events.emit("catalog:change");
        },

        getProducts(): IProduct[] {
            return products;
        },

        setSelected(product: IProduct | null) {
            selected = product;
            events.emit("catalog:selected");
        },

        getSelected(): IProduct | null {
            return selected;
        }
    };
}