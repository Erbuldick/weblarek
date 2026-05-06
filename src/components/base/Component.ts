export interface IComponent<T> {
    render(data?: Partial<T>): HTMLElement;
    setImage(element: HTMLImageElement, src: string, alt?: string): void;
    // container доступен через свойство, если нужно снаружи, но мы его не экспортируем напрямую
}

/**
 * Фабрика для создания компонента на основе контейнера.
 * Возвращает объект с методами render и setImage.
 * Контейнер хранится в замыкании и может быть передан через свойство при необходимости.
 */
export function createComponent<T>(container: HTMLElement): IComponent<T> {
    // Этот объект будет мутироваться через Object.assign в render, поэтому он не чисто IComponent<T>,
    // но для вызывающего кода это прозрачно.
    const instance = {} as IComponent<T> & { container: HTMLElement };

    // Прячем контейнер, но можем дать доступ через геттер, если нужно
    Object.defineProperty(instance, 'container', {
        value: container,
        writable: false,
        configurable: false
    });

    instance.setImage = (element: HTMLImageElement, src: string, alt?: string) => {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    };

    instance.render = function(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return container;
    };

    return instance;
}