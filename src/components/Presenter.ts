import { IProduct } from "../types";
import { CDN_URL } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/Events";
import { IApiClient } from "./Client";
import { IntBuyer } from "./Models/Buyer";
import { ICart } from "./Models/Cart";
import { ICatalog } from "./Models/Catalog";
import { HeaderComponent } from "./Views/Header";
import { ModalComponent } from "./Views/Modal";
import { GalleryComponent } from "./Views/Gallery";
import { BasketComponent } from "./Views/Basket";
import { OrderComponent } from "./Views/Order";
import { ContactsComponent } from "./Views/Contacts";
import { SuccessComponent } from "./Views/Success";
import { CardPreviewComponent } from "./Views/Card/CardPreview";
import { createCardCatalog } from "./Views/Card/CardCatalog";
import { createCardBasket } from "./Views/Card/CardBasket";

export function createPresenter(
    catalog: ICatalog,
    cart: ICart,
    events: IEvents,
    client: IApiClient,
    gallery: GalleryComponent,
    modal: ModalComponent,
    header: HeaderComponent,
    buyer: IntBuyer,
    basket: BasketComponent,
    order: OrderComponent,
    contacts: ContactsComponent,
    success: SuccessComponent,
    cardPreview: CardPreviewComponent
) {
    // === Настройка всех обработчиков событий ===

    // Изменение каталога → отрисовка карточек
    events.on("catalog:change", () => {
        gallery.render({
            catalog: catalog.getProducts().map((product) => {
                const card = createCardCatalog(
                    cloneTemplate<HTMLButtonElement>("#card-catalog"),
                    {
                        onClick: () => events.emit("catalog:select", product),
                    },
                    CDN_URL
                );
                return card.render(product);
            }),
        });
    });

    // Выбор продукта
    events.on("catalog:select", (product: IProduct) => {
        catalog.setSelected(product);
    });

    // Продукт выбран → показать в модалке
    events.on("catalog:selected", () => {
        const product = catalog.getSelected();
        if (product) {
            const exists = cart.isExist(product.id);
            const text =
                product.price === null
                    ? "Недоступно"
                    : exists
                    ? "Удалить из корзины"
                    : "В корзину";
            const enable = product.price !== null;
            modal.render({
                content: cardPreview.render({
                    ...product,
                    enable,
                    text,
                }),
                show: true,
            });
        }
    });

    // Закрытие модального окна
    events.on("modal:close", () => {
        modal.render({ show: false });
    });

    // Кнопка в превью → добавить/удалить из корзины
    events.on("preview:button", () => {
        const product = catalog.getSelected();
        if (product) {
            if (cart.isExist(product.id)) {
                cart.deleteProduct(product);
            } else {
                cart.addProduct(product);
            }
            modal.render({ show: false });
        }
    });

    // Изменение корзины → обновить счётчик в шапке
    events.on("basket:change", () => {
        header.render({ counter: cart.count() });
    });

    // Открытие корзины
    events.on("basket:open", () => {
        modal.render({
            content: basket.render(),
            show: true,
        });
    });

    // Перерисовка корзины при изменении
    events.on("basket:change", () => {
        const products = cart.getProducts();
        basket.render({
            cost: cart.cost(),
            products: products.map((product, index) => {
                const card = createCardBasket(
                    cloneTemplate("#card-basket"),
                    {
                        onClick: () => events.emit("basket:remove", product),
                    }
                );
                return card.render({
                    title: product.title,
                    price: product.price,
                    index: index + 1,
                });
            }),
            enable: products.length !== 0,
        });
    });

    // Удаление из корзины
    events.on("basket:remove", (product: IProduct) => {
        cart.deleteProduct(product);
    });

    // Открытие первой части заказа
    events.on("order:open", () => {
        modal.render({
            content: order.render(),
            show: true,
        });
    });

    // При изменении покупателя → обновить форму заказа
    events.on("buyer:change", () => {
        const b = buyer.getBuyer();
        const { email, phone, ...error } = buyer.validate();
        const enable = Object.keys(error).length === 0;
        order.render({
            ...b,
            enable,
            error,
        });
    });

    // Установка полей покупателя
    events.on("buyer:set", (data) => {
        for (let [key, value] of Object.entries(data)) {
            switch (key) {
                case "payment":
                    buyer.setPayment(value);
                    break;
                case "address":
                    buyer.setAddress(value);
                    break;
                case "email":
                    buyer.setEmail(value);
                    break;
                case "phone":
                    buyer.setPhone(value);
                    break;
            }
        }
    });

    // Переход ко второй части заказа
    events.on("order:close", () => {
        modal.render({
            content: contacts.render(),
            show: true,
        });
    });

    // При изменении покупателя → обновить форму контактов
    events.on("buyer:change", () => {
        const b = buyer.getBuyer();
        const { payment, address, ...error } = buyer.validate();
        const enable = Object.keys(error).length === 0;
        contacts.render({
            ...b,
            enable,
            error,
        });
    });

    // Отправка заказа
    events.on("contacts:close", () => {
        const b = buyer.getBuyer();
        const orderData = {
            ...b,
            total: cart.cost(),
            items: cart.getProducts().map((product) => product.id),
        };
        client
            .postOrder(orderData)
            .then((data) => {
                modal.render({
                    content: success.render({
                        cost: data.total,
                    }),
                    show: true,
                });
                cart.clear();
                buyer.clear();
            })
            .catch(() => {
                alert("Возникла ошибка выполнения заказа !");
            });
    });

    // === Публичный API ===
    return {
        start() {
            client
                .getProducts()
                .then((data) => {
                    catalog.setProcucts(data);
                    cart.clear();
                    buyer.clear();
                })
                .catch(() => {
                    alert("Ошибка загрузки списка продуктов !");
                });
        },
    };
}