import './scss/styles.scss';
import { IProduct, TPayment, IBuyer } from './types';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Customer } from './components/Models/Customer';
import { Cart } from './components/Models/Cart';
import { CommunicationLayer } from './components/Communication/CommunicationLayer';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/common/Modal';
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketCard } from './components/view/BasketCard';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/common/Success';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL, TEXT } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new Api(API_URL);
const comms = new CommunicationLayer(api);
const productsModel = new ProductCatalog(events);
const cart = new Cart(events);
const customer = new Customer(events);
const header = new Header(document.body, events);
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement('#modal-container'), events);
const basketContainer = cloneTemplate(ensureElement<HTMLTemplateElement>('#basket'));
const basketView = new Basket(basketContainer, events);
const orderFormContainer = cloneTemplate(ensureElement<HTMLTemplateElement>('#order')) as HTMLFormElement;
const orderForm = new OrderForm(orderFormContainer, events);
const contactsFormContainer = cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormContainer, events);
const successContainer = cloneTemplate(ensureElement<HTMLTemplateElement>('#success'));
const successView = new Success(successContainer, events);

function renderCatalog(products: IProduct[]) {
    const cards = products.map(product => {
        const cardElement = cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog'));
        const card = new CatalogCard(cardElement, {
            onClick: () => events.emit('product:select', { id: product.id })
        });
        card.title = product.title;
        card.price = product.price;
        card.image = CDN_URL + product.image;
        card.category = product.category;
        return cardElement;
    });
    gallery.items = cards;
}

function renderBasket(items: IProduct[]) {
    const cardElements = items.map((product, idx) => {
        const cardElement = cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket'));
        const card = new BasketCard(cardElement, {
            onClick: () => events.emit('basket:removeItem', { id: product.id })
        });
        card.title = product.title;
        card.price = product.price;
        card.index = idx + 1;
        return cardElement;
    });
    basketView.items = cardElements;
    basketView.total = cart.getTotalPrice();
}

function updateHeaderCounter() {
    header.counter = cart.getItemCount();
}

function openModal(content: HTMLElement) {
    modal.render({ content });
}

function closeModal() {
    modal.close();
}

function syncOrderForm() {
    const data = customer.getAllData();
    orderForm.address = data.address;
    orderForm.payment = data.payment;
    const errors = customer.validateData();
    const errorsText = [errors.address, errors.payment].filter(Boolean).join('; ');
    orderForm.valid = errorsText.length === 0;
    orderForm.errors = errorsText;
}

function syncContactsForm() {
    const data = customer.getAllData();
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    const errors = customer.validateData();
    const errorsText = [errors.email, errors.phone].filter(Boolean).join('; ');
    contactsForm.valid = errorsText.length === 0;
    contactsForm.errors = errorsText;
}

events.on('catalog:changed', ({ products }: { products: IProduct[] }) => renderCatalog(products));
events.on('cart:changed', ({ items }: { items: IProduct[] }) => {
    renderBasket(items);
    updateHeaderCounter();
});

events.on('product:select', ({ id }: { id: string }) => {
    const product = productsModel.getProductById(id);
    if (!product) return;

    const cardElement = cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview'));
    const preview = new PreviewCard(cardElement, {
        onClick: () => {
            if (cart.hasItem(product.id)) {
                cart.removeItem(product.id);
            } else if (product.price !== null) {
                cart.addItem(product);
            }
            closeModal();
        }
    });
    preview.title = product.title;
    preview.price = product.price;
    preview.image = CDN_URL + product.image;
    preview.category = product.category;
    preview.description = product.description;
    preview.buttonText = cart.hasItem(product.id) ? TEXT.REMOVE_FROM_CART : TEXT.ADD_TO_CART;
    if (product.price === null) preview.buttonText = TEXT.UNAVAILABLE;
    openModal(cardElement);
});

events.on('basket:open', () => {
    openModal(basketContainer);
});

events.on('basket:removeItem', ({ id }: { id: string }) => {
    cart.removeItem(id);
});

events.on('basket:order', () => {
    if (cart.getItemCount() === 0) return;
    openModal(orderFormContainer);
    syncOrderForm();
});

events.on('order:paymentChange', ({ payment }: { payment: string }) => {
    customer.saveData({ payment: payment as TPayment });
});

events.on('form:change', ({ field, value }: { field: keyof IBuyer, value: string }) => {
    if (field === 'address') customer.saveData({ address: value });
    else if (field === 'email') customer.saveData({ email: value });
    else if (field === 'phone') customer.saveData({ phone: value });
});

events.on('order:submit', () => {
    openModal(contactsFormContainer);
    syncContactsForm();
});

events.on('contacts:submit', async () => {
    const orderData = {
        items: cart.getItems().map(p => p.id),
        total: cart.getTotalPrice(),
        ...customer.getAllData()
    };
    try {
        const response = await comms.sendOrder(orderData);
        cart.clearCart();
        customer.clearCustomerData();
        successView.total = response.total;
        openModal(successContainer);
    } catch (err) {
        console.error('Ошибка отправки заказа', err);
        alert('Не удалось оформить заказ');
    }
});

events.on('customer:changed', () => {
    syncOrderForm();
    syncContactsForm();
});

events.on('success:close', () => closeModal());
events.on('modal:open', () => document.body.classList.add('modal-open'));
events.on('modal:close', () => document.body.classList.remove('modal-open'));

(async () => {
    try {
        const response = await comms.fetchProducts();
        productsModel.setAllProducts(response.items);
    } catch {
        const { apiProducts } = await import('./utils/data');
        productsModel.setAllProducts(apiProducts.items);
    }
})();

updateHeaderCounter();