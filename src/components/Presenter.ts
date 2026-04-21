import { IProduct } from "../types";
import { CDN_URL } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { IApiClient } from "./Client";
import { IntBuyer } from "./Models/Buyer";
import { ICart } from "./Models/Cart";
import { ICatalog } from "./Models/Catalog";
import { IBasket } from "./Views/Basket";
import { ClassCardBasket } from "./Views/Card/CardBasket";
import { ClassCardCatalog } from "./Views/Card/CardCatalog";
import { ICardPreview } from "./Views/Card/CardPreview";
import { IContacts } from "./Views/Contacts";
import { IGallery } from "./Views/Gallery";
import { IHeader } from "./Views/Header";
import { IModalContent } from "./Views/Modal";
import { IOrder } from "./Views/Order";
import { ISuccess } from "./Views/Success";

/**
 * Реализует связи между моделями и представлениями с помощью брокера событий
 */
export class Presenter {
    constructor(
        protected catalog: ICatalog,
        protected cart: ICart,
        protected events: IEvents,
        protected client: IApiClient,
        protected galllery: Component<IGallery>,
        protected modal: Component<IModalContent>,
        protected header: Component<IHeader>,
        protected buyer: IntBuyer,
        protected basket: Component<IBasket>,
        protected order: Component<IOrder>,
        protected contacts: Component<IContacts>,
        protected success: Component<ISuccess>,
        protected cardPreview: Component<ICardPreview>,
        protected classCardCatalog: ClassCardCatalog,
        protected classCardBasket: ClassCardBasket,
    ) {
        this.configure();
    }

    /**
     * Задает обработчики событий
     */
    protected configure() {
        // Событие изменения каталога, приводит к его показу
        this.events.on("catalog:change", () => {
        this.galllery.render({
            catalog: this.catalog.getProducts().map((product) => {
            const card = new this.classCardCatalog(
                cloneTemplate<HTMLButtonElement>("#card-catalog"),
                {
                onClick: () => {
                    this.events.emit("catalog:select", product);
                },
                },
                CDN_URL,
            );
            return card.render(product);
            }),
        });
        });
        // Выбор пользователем продукта для просмотра
        this.events.on("catalog:select", (product: IProduct) => {
        this.catalog.setSelected(product);
        });
        // Устанавливаем продукт в качестве выбранного, приводит к его показу в модальном окне
        this.events.on("catalog:selected", () => {
        const product = this.catalog.getSelected();
        if (product) {
            const exists = this.cart.isExist(product.id);
            const text =
            product.price === null
                ? "Недоступно"
                : exists
                ? "Удалить из корзины"
                : "В корзину";
            const enable = product.price !== null;
            this.modal.render({
            content: this.cardPreview.render({
                ...product,
                enable,
                text,
            }),
            show: true,
            });
        }
        });
        // Закрытие модального окна
        this.events.on("modal:close", () => {
        this.modal.render({ show: false });
        });
        // Добавление/удаление продукта из корзины
        this.events.on("preview:button", () => {
        const product = this.catalog.getSelected();
        if (product) {
            if (this.cart.isExist(product.id)) {
            this.cart.deleteProduct(product);
            } else {
            this.cart.addProduct(product);
            }
            this.modal.render({ show: false });
        }
        });
        // Корзина пользователя изменена, приводит к изменению заголовка
        this.events.on("basket:change", () => {
        this.header.render({
            counter: this.cart.count(),
        });
        });
        // Открытие корзины пользователя
        this.events.on("basket:open", () => {
        this.modal.render({
            content: this.basket.render(),
            show: true,
        });
        });
        // Привязка отображение корзины к событию изменения корзины
        this.events.on("basket:change", () => {
        const products = this.cart.getProducts();
        this.basket.render({
            cost: this.cart.cost(),
            products: products.map((product, index) => {
            const card = new this.classCardBasket(cloneTemplate("#card-basket"), {
                onClick: () => {
                this.events.emit("basket:remove", product);
                },
            });
            return card.render({
                title: product.title,
                price: product.price,
                index: index + 1,
            });
            }),
            enable: products.length !== 0,
        });
        });
        // Удаление продукта из корзины
        this.events.on("basket:remove", (product: IProduct) => {
        this.cart.deleteProduct(product);
        });
        // Открытие первой части заказа, ввод способа оплаты и адреса
        this.events.on("order:open", () => {
        this.modal.render({
            content: this.order.render(),
            show: true,
        });
        });
        // Привязка отображения первой заказа при изменения информации о покупателе
        this.events.on("buyer:change", () => {
        const buyer = this.buyer.getBuyer();
        const { email, phone, ...error } = this.buyer.validate();
        const enable = Object.keys(error).length === 0;
        this.order.render({
            ...buyer,
            enable,
            error,
        });
        });
        // Ввод атрибутов покупателя
        this.events.on("buyer:set", (data) => {
        for (let [key, value] of Object.entries(data)) {
            switch (key) {
            case "payment":
                this.buyer.setPayment(value);
                break;
            case "address":
                this.buyer.setAddress(value);
                break;
            case "email":
                this.buyer.setEmail(value);
                break;
            case "phone":
                this.buyer.setPhone(value);
                break;
            }
        }
        });
        // Закрытие первой части ввода заказа и переход на вторую часть, где производиться ввод email и телефона
        this.events.on("order:close", () => {
        this.modal.render({
            content: this.contacts.render(),
            show: true,
        });
        });
        // Отображение ввода контактов при изменении покупателя
        this.events.on("buyer:change", () => {
        const buyer = this.buyer.getBuyer();
        const { payment, address, ...error } = this.buyer.validate();
        const enable = Object.keys(error).length === 0;
        this.contacts.render({
            ...buyer,
            enable,
            error,
        });
        });
        // Завершение ввода заказа и отправка его на back, показ заключительного модального окна
        this.events.on("contacts:close", () => {
        const buyer = this.buyer.getBuyer();
        const order = {
            ...buyer,
            total: this.cart.cost(),
            items: this.cart.getProducts().map((product) => product.id),
        };
        this.client
            .postOrder(order)
            .then((data) => {
            this.modal.render({
                content: this.success.render({
                cost: data.total,
                }),
                show: true,
            });
            this.cart.clear();
            this.buyer.clear();
            })
            .catch(() => {
            alert("Возникла ошибка выполнения заказа !");
            });
        });
    }

    /**
     * Инициирует начальную загрузку каталога
     */
    start() {
        this.client
        .getProducts()
        .then((data) => {
            this.catalog.setProcucts(data);
            this.cart.clear();
            this.buyer.clear();
        })
        .catch(() => {
            alert("Ошибка загрузки списка продуктов !");
        });
    }
    }