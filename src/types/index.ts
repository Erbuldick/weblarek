export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods,
    ): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export type TPayment = "online" | "on_delivery" | "";

export interface IProductResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderData extends IBuyer {
    items: string[];
    total: number;
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface ISuccess {
    total: number;
}