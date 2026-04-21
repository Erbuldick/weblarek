export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейс для API, описывающий методы взаимодействия с сервером
export interface IApi {
  // Получение данных по указанному URI, возвращает промис с объектом типа T
    get<T extends object>(uri: string): Promise<T>;
  // Отправка данных на сервер (POST, PUT, DELETE), возвращает промис с объектом типа T
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods,
    ): Promise<T>;
}

// Интерфейс для описания товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Тип для способа оплаты это выбор из нескольких вариантов строк.
export type TPayment = "online" | "cash" | "";

// Интерфейс для данных покупателя
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// Интерфейс для ответа с списком товаров
export interface IProductResponse {
    total: number; // Общее количество товаров
    items: IProduct[]; // Массив товаров
}

// Интерфейс для данных заказа, включает данные покупателя и список ID товаров
export interface IOrderData extends IBuyer {
    items: string[]; // Список товаров по их ID (массив строк)
    total: number;
}

// Интерфейс для ответа сервера при отправке заказа.
export interface IOrderResponse {
    id: string; // Идентификатор подтверждения заказа
    total: number; // Итоговая сумма заказа
}