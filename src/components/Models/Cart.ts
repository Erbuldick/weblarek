import { IProduct } from "../../types";

export class Cart {
    private items: IProduct[] = [];

    public getItems(): IProduct[] {
        return this.items;
    }

    public addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this.items.push(product);
        }
    }

    public removeItem(productId: string): void {
        this.items = this.items.filter((item) => item.id !== productId);
    }

    public getItemCount(): number {
        return this.items.length;
    }

    public getTotalPrice(): number {
        const total = this.items.reduce((sum, item) => {
            return sum + (item.price !== null ? item.price : 0);
        }, 0);
    return total;
    }

    public hasItem(productId: string): boolean {
        return this.items.some((item) => item.id === productId);
    }

    public clearCart(): void {
        this.items = [];
    }
}