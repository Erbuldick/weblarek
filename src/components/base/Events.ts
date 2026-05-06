// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventEnum = 
  | "catalog:change"        // Каталог изменен
  | "catalog:select"        // Выбирается продукт
  | "catalog:selected"      // Продукт выбран
  | "modal:close"           // Закрываем модальное окно
  | "preview:button"        // Нажата кнопка на preview товара
  | "basket:open"           // Открытие корзины пользователя
  | "basket:change"         // Изменилась корзина покупателя
  | "basket:remove"         // Click на иконке удаления продукта из корзины
  | "order:open"            // Открытие первой части ввода заказа, способ оплаты и адрес доставки
  | "order:close"           // Закрываем ввод первой части ввода заказа
  | "buyer:set"             // Установка покупателя
  | "buyer:change"          // Покупатель изменен
  | "contacts:close"        // Закрытие второй части ввода заказа
  | "*";                    // Все события
type EventName = EventEnum | RegExp;
type Subscriber = Function;

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    off(event: EventName, callback: Subscriber): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(
        event: string,
        context?: Partial<T>,
    ): (data: T) => void;
}

export function createEventEmitter(): IEvents {
    // Внутреннее хранилище: Map<EventName, Set<Subscriber>>
    const _events = new Map<EventName, Set<Subscriber>>();

    return {
        on<T extends object>(eventName: EventName, callback: (data: T) => void) {
            let subscribers = _events.get(eventName);
            if (!subscribers) {
                subscribers = new Set<Subscriber>();
                _events.set(eventName, subscribers);
            }
            subscribers.add(callback);
        },

        off(eventName: EventName, callback: Subscriber) {
            const subscribers = _events.get(eventName);
            if (subscribers) {
                subscribers.delete(callback);
                if (subscribers.size === 0) {
                    _events.delete(eventName);
                }
            }
        },

        emit<T extends object>(eventName: string, data?: T) {
            _events.forEach((subscribers, name) => {
                // Событие для перехвата всех событий
                if (name === "*") {
                    subscribers.forEach(callback => callback({ eventName, data }));
                }
                // Проверка на точное совпадение или RegExp
                if ((name instanceof RegExp && name.test(eventName)) || name === eventName) {
                    subscribers.forEach(callback => callback(data));
                }
            });
        },

        trigger<T extends object>(eventName: string, context?: Partial<T>) {
            return (event: object = {}) => {
                this.emit(eventName, { ...(event || {}), ...(context || {}) });
            };
        }
    };
}