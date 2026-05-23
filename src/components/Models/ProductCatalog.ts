import { IProduct } from "../../types";

export class ProductCatalog {
    private allProducts: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    public getAllProducts(): IProduct[] {
        return this.allProducts;
    }

    public getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    public setAllProducts(products: IProduct[]): void {
        this.allProducts = products;
    }

    public getProductById(id: string): IProduct | undefined {
        const product = this.allProducts.find((p) => p.id === id);
        return product;
    }

    public selectProduct(product: IProduct): void {
        this.selectedProduct = product;
    }
}