import './scss/styles.scss';

// Модели
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Customer } from './components/Models/Customer';
import { Cart } from './components/Models/Cart';
import { CommunicationLayer } from './components/Communication/CommunicationLayer';

// Компоненты представления
import { Page } from './components/view/Page';
import { Modal } from './components/common/Modal';
import { Card } from './components/view/Card';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/common/Success';

// Базовые классы и утилиты
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Шаблоны
const templates = {
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts'),
    success: ensureElement<HTMLTemplateElement>('#success'),
};

// Событийная шина
const events = new EventEmitter();

// Модели
const productsModel = new ProductCatalog();
const cart = new Cart();
const customer = new Customer();
const api = new Api(API_URL);
const comms = new CommunicationLayer(api);

// UI компоненты
const page = new Page(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);
let currentBasketView: Basket | null = null;
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

// === Вспомогательные функции ===

function updateCartCounter() {
    page.counter = cart.getItemCount();
}

function renderCatalog() {
    const cards = productsModel.getAllProducts().map(product => {
        const cardElement = cloneTemplate(templates.cardCatalog);
        const card = new Card(cardElement, 'catalog', events, {
            onClick: () => events.emit('card:select', { id: product.id })
        });
        card.title = product.title;
        card.price = product.price;
        card.image = product.image;
        card.category = product.category;
        return cardElement;
    });
    page.catalog = cards;
}

function renderBasket() {
    const basketElement = cloneTemplate(templates.basket);
    const basket = new Basket(basketElement, events);
    currentBasketView = basket;

    const items = cart.getItems().map((product, idx) => {
        const cardElement = cloneTemplate(templates.cardBasket);
        const card = new Card(cardElement, 'basket', events, {
            onClick: () => events.emit('basket:remove', { id: product.id })
        });
        card.title = product.title;
        card.price = product.price;
        card.index = idx + 1;
        return cardElement;
    });
    basket.items = items;
    basket.total = cart.getTotalPrice();
    modal.render({ content: basketElement });
}

function showPreview(productId: string) {
    const product = productsModel.getProductById(productId);
    if (!product) return;

    const cardElement = cloneTemplate(templates.cardPreview);
    const card = new Card(cardElement, 'preview', events, {
        onClick: () => {
            if (cart.hasItem(product.id)) {
                cart.removeItem(product.id);
                events.emit('cart:change');
                modal.close();
            } else {
                if (product.price !== null) {
                    cart.addItem(product);
                    events.emit('cart:change');
                    modal.close();
                }
            }
            updateCartCounter();
        }
    });
    card.title = product.title;
    card.price = product.price;
    card.image = product.image;
    card.category = product.category;
    card.description = product.description;
    card.buttonText = cart.hasItem(product.id) ? 'Удалить из корзины' : 'В корзину';
    if (product.price === null) card.buttonText = 'Недоступно';
    modal.render({ content: cardElement });
}

function openOrderForm() {
    const formElement = cloneTemplate(templates.order) as HTMLFormElement;
    const form = new OrderForm(formElement, events);
    currentOrderForm = form;
    const customerData = customer.getAllData();
    form.address = customerData.address;
    form.payment = customerData.payment;
    validateOrderForm();
    modal.render({ content: formElement });
}

function openContactsForm() {
    const formElement = cloneTemplate(templates.contacts) as HTMLFormElement;
    const form = new ContactsForm(formElement, events);
    currentContactsForm = form;
    const customerData = customer.getAllData();
    form.email = customerData.email;
    form.phone = customerData.phone;
    validateContactsForm();
    modal.render({ content: formElement });
}

function showSuccess(total: number) {
    const successElement = cloneTemplate(templates.success);
    const success = new Success(successElement, events);
    success.total = total;
    modal.render({ content: successElement });
}

// === Валидация форм ===

function validateOrderForm() {
    if (!currentOrderForm) return;
    const data = customer.getAllData();
    let isValid = true;
    let errorMsg = '';
    if (!data.address) {
        isValid = false;
        errorMsg = 'Введите адрес доставки';
    } else if (!data.payment) {
        isValid = false;
        errorMsg = 'Выберите способ оплаты';
    }
    currentOrderForm.valid = isValid;
    currentOrderForm.errors = errorMsg;
}

function validateContactsForm() {
    if (!currentContactsForm) return;
    const data = customer.getAllData();
    let isValid = true;
    let errorMsg = '';
    if (!data.email) {
        isValid = false;
        errorMsg = 'Введите email';
    } else if (!data.phone) {
        isValid = false;
        errorMsg = 'Введите телефон';
    }
    currentContactsForm.valid = isValid;
    currentContactsForm.errors = errorMsg;
}

// === Обработчики событий ===

events.on('card:select', (data: { id: string }) => showPreview(data.id));
events.on('basket:open', renderBasket);
events.on('basket:remove', (data: { id: string }) => {
    cart.removeItem(data.id);
    updateCartCounter();
    renderBasket();
    events.emit('cart:change');
});
events.on('cart:change', () => {
    updateCartCounter();
    if (modal.isOpen && currentBasketView) {
        renderBasket();
    }
});
events.on('basket:order', () => {
    if (cart.getItemCount() === 0) return;
    openOrderForm();
});

events.on('order:paymentChange', (data: { payment: string }) => {
    customer.saveData({ payment: data.payment as any });
    validateOrderForm();
});

events.on('form:change', (data: { field: string, value: string }) => {
    if (data.field === 'address') {
        customer.saveData({ address: data.value });
        validateOrderForm();
    } else if (data.field === 'email') {
        customer.saveData({ email: data.value });
        validateContactsForm();
    } else if (data.field === 'phone') {
        customer.saveData({ phone: data.value });
        validateContactsForm();
    }
});

events.on('order:submit', () => {
    const errors = customer.validateData();
    if (errors.address || errors.payment) {
        if (currentOrderForm) {
            currentOrderForm.errors = errors.address || errors.payment || '';
        }
        return;
    }
    openContactsForm();
});

events.on('contacts:submit', async () => {
    const errors = customer.validateData();
    if (errors.email || errors.phone) {
        if (currentContactsForm) {
            currentContactsForm.errors = errors.email || errors.phone || '';
        }
        return;
    }
    const orderData = {
        items: cart.getItems().map(p => p.id),
        total: cart.getTotalPrice(),
        ...customer.getAllData()
    };
    try {
        const response = await comms.sendOrder(orderData);
        cart.clearCart();
        customer.clearCustomerData();
        updateCartCounter();
        showSuccess(response.total);
    } catch (err) {
        console.error('Ошибка отправки заказа', err);
        alert('Не удалось оформить заказ');
    }
});

events.on('success:close', () => modal.close());
events.on('modal:open', () => page.locked = true);
events.on('modal:close', () => page.locked = false);

(async () => {
    try {
        const response = await comms.fetchProducts();
        const productsWithFullPath = response.items.map(product => ({
            ...product,
            image: CDN_URL + product.image
        }));
        productsModel.setAllProducts(productsWithFullPath);
        renderCatalog();
    } catch (err) {
        console.warn('Используем моковые данные');
        const { apiProducts } = await import('./utils/data');
        const fixedProducts = apiProducts.items.map(product => ({
            ...product,
            image: `/src/images/${product.image.replace(/^\//, '')}`
        }));
        productsModel.setAllProducts(fixedProducts);
        renderCatalog();
    }
})();

updateCartCounter();