import { IProduct } from "../../types";
import { IEvents } from '../base/Events';

export class Cart {
    private items: IProduct[] = [];
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    public getItems(): IProduct[] {
        return this.items;
    }

    public addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this.items.push(product);
            this.events.emit('cart:changed', { items: this.items });
        }
    }

    public removeItem(productId: string): void {
        const oldLength = this.items.length;
        this.items = this.items.filter((item) => item.id !== productId);
        if (oldLength !== this.items.length) {
            this.events.emit('cart:changed', { items: this.items });
        }
    }

    public getItemCount(): number {
        return this.items.length;
    }

    public getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    public hasItem(productId: string): boolean {
        return this.items.some((item) => item.id === productId);
    }

    public clearCart(): void {
        this.items = [];
        this.events.emit('cart:changed', { items: this.items });
    }
}