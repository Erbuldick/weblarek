import { IApi, IOrderData, IOrderResponse, IProduct, IProductResponse } from "../types";


export interface IApiClient {
    getProducts(): Promise<IProduct[]>;
    postOrder(order: IOrderData): Promise<IOrderResponse>;
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
        const result = await this.api.get<IProductResponse>("/product/");
        return result.items;
    }

    /**
     * Выполняет запрос на покупку товаров
     * @param order Запрос
     * @returns Результат
     */
    async postOrder(order: IOrderData): Promise<IOrderResponse> {
        return await this.api.post<IOrderResponse>("/order", order);
    }
    }