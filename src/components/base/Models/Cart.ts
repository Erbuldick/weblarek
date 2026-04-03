import { IProduct } from "../../../types";

// Класс Cart представляет корзину покупок
export class Cart {
    private items: IProduct[] = [];

  // Метод для получения всех товаров из корзины
    public getItems(): IProduct[] {
        return this.items;
    }

  // Метод для добавления товара в корзину
    public addItem(product: IProduct): void {
        // Проверяет, есть ли товар с таким ID уже в корзине
        if (!this.hasItem(product.id)) {
            this.items.push(product);
        }
    }

  // Метод для удаления товара из корзины по его ID
    public removeItem(productId: string): void {
        this.items = this.items.filter((item) => item.id !== productId);
    }

  // Метод для получения общего количества товаров в корзине
    public getItemCount(): number {
        return this.items.length;
    }

  // Метод для расчета общей стоимости всех товаров в корзине
    public getTotalPrice(): number {
        const total = this.items.reduce((sum, item) => {
        // Добавляет цену товара к сумме, если цена не null, иначе добавляет 0
            return sum + (item.price !== null ? item.price : 0);
        }, 0); // Начальное значение суммы - 0
    return total;
    }

  // Метод для проверки наличия товара в корзине по его ID
    public hasItem(productId: string): boolean {
        return this.items.some((item) => item.id === productId);
    }

  // Метод для полной очистки корзины
    public clearCart(): void {
        this.items = [];
    }
}