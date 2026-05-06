import { IProduct } from "../../../types";
import { createCardBaseCatalog, CardBaseCatalogComponent } from "./CardBaseCatalog";

type ICardCatalog = Pick<IProduct, "category" | "title" | "image" | "price">;

interface ICardAction {
    onClick?(): void;
}

export type CardCatalogComponent = CardBaseCatalogComponent<ICardCatalog>;

export function createCardCatalog(
    container: HTMLElement,
    actions: ICardAction,
    cdnUrl: string
): CardCatalogComponent {
    const component = createCardBaseCatalog<ICardCatalog>(container, cdnUrl);

    if (actions?.onClick) {
        container.addEventListener("click", actions.onClick);
    }

    return component;
}