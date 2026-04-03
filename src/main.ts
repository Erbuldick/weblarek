import './scss/styles.scss';

// Импортируем классы моделей
import { ProductCatalog } from "./components/base/Models/ProductCatalog";
import { Customer } from "./components/base/Models/Customer";
import { Cart } from "./components/base/Models/Cart";

// Импорт класса для работы с API
import { Api } from "./components/base/Api";
// Импортируем константу с URL API
import { API_URL } from "./utils/constants";
// Импорт слоя коммуникации для взаимодействия с API
import { CommunicationLayer } from "./components/base/Communication/communicationLayer";

// Импорт данных товаров
import { apiProducts } from "./utils/data";


// Создаем экземпляр модели каталога
const productsModel = new ProductCatalog();

// Устанавливаем список всех товаров из полученных данных
productsModel.setAllProducts(apiProducts.items);

console.log("--- ProductCatalog ---");

console.log("Массив товаров из каталога:", productsModel.getAllProducts());

const firstProduct = apiProducts.items[0];

if (firstProduct) {
  // Устанавливаем выбранный продукт, используя первый товар из списка
    productsModel.selectProduct(firstProduct);
} else {
    console.log("Список товаров пуст, невозможно выбрать продукт.");
}

console.log("Выбранный товар (после установки):", productsModel.getSelectedProduct(),);


// Создаем экземпляр модели клиента
const customer = new Customer();

// Данные клиента
const customerData = {
    email: "test@domain.com",
    phone: "+7(999)123-45-67",
    address: "Калининград, ул. Александра Невского, д. 1",
    payment: undefined,
};

// Сохраняем данные клиента в модель
customer.saveData(customerData);

console.log("--- Customer ---");

console.log("Данные клиента:", customer.getAllData());
console.log("Валидность данных:", customer.validateData());

// Вызов очистки данных клиента
customer.clearCustomerData();

// Вывод после очистки данных
console.log("Данные клиента после очистки:", customer.getAllData());

// Создаем экземпляр корзины
const cart = new Cart();

// Добавляет первый товар из каталога в корзину
cart.addItem(productsModel.getAllProducts()[0]);

console.log("--- Cart ---");

// Выводит текущие товары и их количество
console.log("Товары в корзине:", cart.getItems());
console.log("Количество товаров:", cart.getItemCount());
console.log("Общая стоимость:", cart.getTotalPrice());

// Удаляет товар по ID и снова выводит содержимое корзины
const firstProductId = productsModel.getAllProducts()[0].id;
cart.removeItem(firstProductId);
console.log(`После удаления товара с id ${firstProductId}:`);
console.log("Товары в корзине:", cart.getItems());
console.log("Количество товаров:", cart.getItemCount());

// Очищает корзину и выводит содержимое и количество после очистки
cart.clearCart();
console.log("После очистки корзины:");
console.log("Товары в корзине:", cart.getItems());
console.log("Количество товаров:", cart.getItemCount());


// Создаем экземпляр API с указанным URL
const apiInstance = new Api(API_URL);

// Создаем слой коммуникации, передавая ему объект API
const comms = new CommunicationLayer(apiInstance);

console.log("--- CommunicationLayer ---");

(async () => {
    try {
        // Выполняем асинхронный запрос на получение товаров
        const productsResponse = await comms.fetchProducts();
        const products = productsResponse.items;

        // Создаем новый каталог и заполняем его полученными товарами
        const productsModel = new ProductCatalog();
        productsModel.setAllProducts(products);

        console.log("Модель каталога:", productsModel.getAllProducts());
    } catch (error) {
        console.error("Ошибка при получении товаров:", error);
    }
})();