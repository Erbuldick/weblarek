# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

### Иитерфейсы данных

#### товар IProduct

interface IProduct {
  id: string;            - Уникальный идентификатор товара
  description: string;   - Подробное описание товара
  image: string;         - Ссылка или путь к изображению товара
  title: string;         - Название товара
  category: string;      - Категория товара
  price: number | null;  - Цена товара (число или null, если цена не определена)
}

#### Покупатель IBuyer

interface IBuyer {
  payment: TPayment;     - Способ оплаты ('online' (онлайн) или 'on_delivery' (при получении), или undefined/ null, если  способ оплаты не выбран)
  email: string;         - Электронная почта
  phone: string;         - Номер телефона
  address: string;       - Адрес доставки
}

### Модели данных

#### Класс Catalog (каталог товаров)

Поля класса:  
protected products: IProduct[]                      - Собственно каталог
protected selected: IProduct | null                 - Выбранный продукт

Конструктор:
constructor()                                       - Создание каталога

Методы:
public setProcucts(products: IProduct[])            - Установка полного списка продуктов
public getProducts(): IProduct[]                    - Получение списка продуктов
public getProduct(id: string): IProduct | undefined - Получение продукта по его идентификатору
public setSelected(product: IProduct | null)        - Установка выбранного продукта
public getSelected(): IProduct | null               - Получение выбранного продукта

#### Класс Cart (корзина)

Поля класса:
protected products: IProduct[]                      - Список товаров в корзине

Конструктор:
constructor()                                       - Создание корзины

Методы:
public addProduct(product: IProduct)                - Добавляет продукт в корзину
public deleteProduct(product: IProduct)             - Удаляет продукт из корзины
public count(): number                              - Возвращает количество продуктов
public getProducts(): IProduct[]                    - Возвращает список продуктов в корзине
public cost(): number                               - Возвращает стоимость продуктов в корзине
public is_exist(id: string): boolean                - Проверят наличие продукта в корзине по его идентификатору
public clear()                                      - Очистка корзины

#### Класс Buyer (покупатель)

Поля класса:  
protected buyer: IBuyer                             - Покупатель

Конструктор:
constructor()                                       - Конструктор, устанавливает пустое значение

Методы:  
public validate(): TError                           - Производит проверку, возвращает объект, в котором ключом, является поле, а значением - проблемы с этим полем
public getBuyer(): IBuyer                           - Возвращает покупателя
public setPayment(payment: TPayment)                - Устанавливает способ оплаты
public setAddress(address: string)                  - Устанавливает адрес
public setEmail(email: string)                      - Устанавливает email
public setPhone(phone: string)                      - Устанавливает телефон
public clear()                                      - Очищает аттрибуты покупателя

### Представления

#### CardBase - Базовая карточка

Поля класса:
protected titleElement: HTMLElement                 - HMTL элемент загловка
protected priceElement: HTMLElement                 - HTML элемент цены

Конструктор:
constructor(container: HTMLElement)

Сеттеры:
set price(value: number | null)                     - Устанавливает цену
set title(value: string)                            - Устанавливает заголовок

#### CardBaseCatalog - Базовая карточка с наименованием, ценой, категорией и изображением

Поля класса:
protected categotyElement: HTMLElement              - Категория
protected imageElement: HTMLImageElement            - Изображение

Конструктор:
constructor(container: HTMLElement,  protected cdnUrl: string)

Сеттеры:
set category(value: string)                         - Установка категории
set image(value: string)                            - Установка изображения 

#### CardBasket - Карточка в корзине покупателя

Поля класса:
protected buttonElement: HTMLButtonElement          - Кнопка удалить из корзины
protected indexElement: HTMLSpanElement             - Номер продукта по порядку

Конструктор:
constructor(container: HTMLElement, actions: IActionBasket)

Сеттеры:
set index(value: number)                            - Установка номера по порядку

#### CardCatalog - Карточка в каталоге

Конструктор:
constructor(container: HTMLElement, actions: ICardAction, cdnUrl: string)

#### CardPreview - Preview карточки

Поля класса:
protected descriptionElement: HTMLElement           - Подробное описание продукта
protected buttonElement: HTMLButtonElement          - Кнопка Добавить/Удалить

Конструктор:
constructor(container: HTMLElement, cdnUrl: string,  protected evenets: IEvents)

Сеттеры:
set description(value: string)                      - Установка описания
set enable(value: boolean)                          - Разрешенена ди кнопка Добавить/Удалить
set text(value: string)                             - Установка текста кнопки

#### Basket - Корзина покупателя

Поля класса:
protected priceElement: HTMLSpanElement             - Общая стоимость корзины
protected buttonElement: HTMLButtonElement          - Кнопка Оформить
protected listElement: HTMLUListElement             - Список товаров

Конструктор:
constructor(container: HTMLElement, protected events: IEvents)

Сеттеры:
set cost(value: number)                             - Установка стоимости корзины
set products(items: HTMLLIElement[])                - Установка списка продуктов
set enable(value: boolean)                          - Установка разрешения кнопки Оформить

#### Form - Базовый класс для форм

Поля класса:
protected submitElement: HTMLButtonElement          - Кнопка submit
protected errorElement: HTMLElement;                - Ошибка

Конструктор:
constructor(container: HTMLElement, protected events: IEvents)

Сеттеры:
set enable(value: boolean)                          - Установка разрешения кнопки submit
set error(value: object)                            - Установка ошибки

#### Order - Ввод информации о заказе, способ оплаты и адрес доставки

Поля класса:
protected cardElement: HTMLButtonElement            - Кнопка online способа оплаты
protected cashElement: HTMLButtonElement            - Кнопка наличные способа оплаты
protected addressElement: HTMLInputElement          - Поле ввода адреса

Конструктор:
constructor(container: HTMLElement, events: IEvents)

Сеттеры:
set payment(value: TPayment)                        - Установка способа оплаты
set address(value: string)                          - Установка адреса

#### Contacts - Ввод контактов покупателя

Поля класса:
protected emailElement: HTMLInputElement            - поле ввода email
protected phoneElement: HTMLInputElement            - поле ввода телефона

Конструктор:
constructor(container: HTMLElement, events: IEvents)

Сеттеры:
set email(value: string)                            - Установка email
set phone(value: string)                            - Установка телефона

#### Gallery - Каталог продуктов

Конструктор:
constructor(container: HTMLElement)

Сеттеры:
set catalog(value: HTMLElement[])                   - Установка списка продуктов

#### Header - Заголовок страницы

Поля класса:
protected counterElement: HTMLElement               - Количество продуктов в корзине
protected basketButton: HTMLButtonElement           - Кнопка корзины

Конструктор:
constructor(container: HTMLElement, protected events: IEvents)

Сеттеры:
set counter(value: number)                          - Установка количества продуктов в корзине

#### Modal - Модальное окно

Поля класса:
protected contentElement: HTMLElement               - Содержимое модального окна
protected buttonElement: HTMLButtonElement          - Кнопка закрытия модального окна

Конструктор:
constructor(container: HTMLElement, protected events: IEvents)

Сеттеры:
set show(value: boolean)                            - Управляет видимостью модального окна
set content(value: HTMLElement)                     - Устанавливает содержимого модального окна

#### Success - Заказ создан

Поля класса:
protected descriptionElement: HTMLElement           - Описание
protected buttonElement: HTMLButtonElement          - Кнопка закрытия модального окна

Конструктор:
constructor(containet: HTMLElement, protected evenets: IEvents)

Сеттеры:
set cost(value: number)                             - Устанавливает количество списанных синапсов

#### Клас Presenter реализует связывание моделй и представлений с помощью брокера событий

Конструктор:
constructor(
    protected catalog: ICatalog,                     - Модель каталога продуктоа
    protected cart: ICart,                           - Модель корзина покупателя
    protected events: IEvents,                       - Брокер событий
    protected client: IApiClient,                    - API клиент
    protected galllery: Component<IGallery>,         - Представление галерея
    protected modal: Component<IModalContent>,       - Представление модальное окно
    protected header: Component<IHeader>,            - Представление заголовок страницы
    protected buyer: IntBuyer,                       - Модель покупателя
    protected basket: Component<IBasket>,            - Представление корзина покупателя
    protected order: Component<IOrder>,              - Представление первой части заказа, ввод способа оплаты и адреса
    protected contacts: Component<IContacts>,        - Представление второй части заказа, ввод email и телефона
    protected success: Component<ISuccess>,          - Представление успешного завершения заказа
    protected cardPreview: Component<ICardPreview>,  - Представление подробного просмотра продукта
    protected classCardCatalog: ClassCardCatalog,    - Класс представления карточки товара в каталоге
    protected classCardBasket: ClassCardBasket,      - Класс представления карточки товара в корзине
  )

Методы:
protected configure()                                - Задает обработчики событий
start()                                              - Инициирует начальную загрузку каталога

#### Типы событий

catalog:change                                       - Каталог изменен
catalog:select                                       - Выбирается продукт
catalog:selected                                     - Продукт выбран
modal:close                                          - Закрываем модальное окно
preview:button                                       - Нажата кнопка на preview товара
basket:open                                          - Открытие корзины пользователя
basket:change                                        - Изменилась корзина покупателя
basket:remove                                        - Click на иконке удаления продукта из корзины
order:open                                           - Открытие первой части ввода заказа, способ оплаты и адрес доставки
order:close                                          - Закрываем ввод первой части ввода заказа
buyer:set                                            - Установка покупателя
buyer:change                                         - Покупатель изменен
contacts:close                                       - Закрытие второй части ввода заказа