import { IApi, IOrder, IOrderResult, IProduct, IProductList } from "../types";


export interface IApiClient {
    getProducts(): Promise<IProduct[]>;
    postOrder(order: IOrder): Promise<IOrderResult>;
}

/**
 * Взаимодействие с back'ом
 */
export class ApiClient implements IApiClient{
    protected api: IApi;

    /**
     * Создает клиента
     * @param api API
     */
    constructor(api: IApi) {
        this.api = api;
    }

    /**
     * Запрашивает полный список продктов
     * @returns Список продкутов
     */
    async getProducts(): Promise<IProduct[]> {
        const result = await this.api.get<IProductList>("/product/");
        return result.items;
    }

    /**
     * Выполняет запрос на покупку товаров
     * @param order Запрос
     * @returns Результат
     */
    async postOrder(order: IOrder): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>("/order", order);
    }
    }