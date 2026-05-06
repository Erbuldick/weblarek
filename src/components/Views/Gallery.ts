import { createComponent, IComponent } from "../base/Component";

export interface IGallery {
    catalog: HTMLElement[];
}

// Расширенный тип, описывающий наш компонент
export type GalleryComponent = IComponent<IGallery> & {
    catalog: undefined; // для TypeScript – сеттер объявим через дескриптор
};

export function createGallery(container: HTMLElement): GalleryComponent {
    const component = createComponent<IGallery>(container);

    Object.defineProperty(component, 'catalog', {
        set(value: HTMLElement[]) {
            container.append(...value);
        },
        enumerable: true,
        configurable: true
    });

    return component as GalleryComponent;
}