import { IProduct } from "../../../types";

// Класс ProductCatalog представляет каталог товаров
export class ProductCatalog {
    private allProducts: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    // Метод для получения списка всех товаров из каталога
    public getAllProducts(): IProduct[] {
        return this.allProducts;
    }

    // Метод для получения текущего выбранного товара
    public getSelectedProduct(): IProduct | null {
        return this.selectedProduct; // Возвращает выбранный товар или null
    }

    // Метод для полной замены всего списка товаров в каталоге
    public setAllProducts(products: IProduct[]): void {
        this.allProducts = products;
    }

    // Метод для получения конкретного товара по его ID
    public getProductById(id: string): IProduct | undefined {
        // Ищет товар в массиве allProducts по совпадению ID
        const product = this.allProducts.find((p) => p.id === id);
        return product; // Возвращаем найденный товар или undefined, если товар не найден
    }

    // Метод для установки конкретного товара в качестве выбранного
    public selectProduct(product: IProduct): void {
        this.selectedProduct = product;
    }
}