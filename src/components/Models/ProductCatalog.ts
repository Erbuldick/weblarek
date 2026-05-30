import { IProduct } from "../../types";
import { IEvents } from '../base/Events';

export class ProductCatalog {
    private allProducts: IProduct[] = [];
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    public getAllProducts(): IProduct[] {
        return this.allProducts;
    }

    public setAllProducts(products: IProduct[]): void {
        this.allProducts = products;
        this.events.emit('catalog:changed', { products: this.allProducts });
    }

    public getProductById(id: string): IProduct | undefined {
        return this.allProducts.find((p) => p.id === id);
    }
}