import { IApi, IProductResponse, IOrderData, IOrderResponse } from "../../types";

export class CommunicationLayer {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async fetchProducts(): Promise<IProductResponse> {
        const response = await this.api.get<IProductResponse>("/product/");
        return response;
    }

    async sendOrder(orderData: IOrderData): Promise<IOrderResponse> {
        const response = await this.api.post<IOrderResponse>("/order/", orderData);
        return response;
    }
}