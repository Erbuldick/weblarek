import "./scss/styles.scss";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Api } from "./components/base/Api";
import { createEventEmitter } from "./components/base/Events";
import { ApiClient } from "./components/Client";
import { Cart } from "./components/Models/Cart";
import { Catalog } from "./components/Models/Catalog";
import { createGallery } from "./components/Views/Gallery";
import { createHeader } from "./components/Views/Header";
import { createModal } from "./components/Views/Modal";
import { Buyer } from "./components/Models/Buyer";
import { createPresenter } from "./components/Presenter";
import { createBasket } from "./components/Views/Basket";
import { createOrder } from "./components/Views/Order";
import { createContacts } from "./components/Views/Contacts";
import { createSuccess } from "./components/Views/Success";
import { createCardPreview } from "./components/Views/Card/CardPreview";

const api = new Api(API_URL);

const client: ApiClient = new ApiClient(api);

const events = createEventEmitter();

const catalog = new Catalog(events);

const cart = new Cart(events);

const gallery = createGallery(ensureElement(".gallery"));

const modal = createModal(ensureElement("#modal-container"), events);

const header = createHeader(ensureElement(".header"), events);

const buyer = new Buyer(events);

const basket = createBasket(cloneTemplate("#basket"), events);

const order = createOrder(cloneTemplate("#order"), events);

const contacts = createContacts(cloneTemplate("#contacts"), events);

const success = createSuccess(cloneTemplate("#success"), events);

const cardPreview = createCardPreview(cloneTemplate("#card-preview"), CDN_URL, events)

const presenter = createPresenter(
  catalog, cart, events, client, gallery, modal, header, buyer,
  basket, order, contacts, success, cardPreview
);
presenter.start();