import { IProduct } from "../../../types";
import { Component } from "../../base/Component";
import { CardBaseCatalog } from "./CardBaseCatalog";

type ICardCatalog = Pick<IProduct, "category" | "title" | "image" | "price">;

interface ICardAction {
    onClick?(): void;
}

export interface ClassCardCatalog {
    new (container: HTMLElement, actions: ICardAction, cdnUrl: string): Component<ICardCatalog>;
}

/**
 * Карточка в каталоге
 */
export class CardCatalog extends CardBaseCatalog<ICardCatalog> {
    constructor(container: HTMLElement, actions: ICardAction, cdnUrl: string) {
        super(container, cdnUrl);

    if (actions?.onClick) {
        this.container.addEventListener("click", actions.onClick);
        }
    }
}