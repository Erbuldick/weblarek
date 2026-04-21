import "./scss/styles.scss";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { ApiClient } from "./components/Client";
import { Cart } from "./components/Models/Cart";
import { Catalog } from "./components/Models/Catalog";
import { Gallery } from "./components/Views/Gallery";
import { Header } from "./components/Views/Header";
import { Modal } from "./components/Views/Modal";
import { Buyer } from "./components/Models/Buyer";
import { Presenter } from "./components/Presenter";
import { Basket } from "./components/Views/Basket";
import { Order } from "./components/Views/Order";
import { Contacts } from "./components/Views/Contacts";
import { Success } from "./components/Views/Success";
import { CardPreview } from "./components/Views/Card/CardPreview";
import { CardCatalog } from "./components/Views/Card/CardCatalog";
import { CardBasket } from "./components/Views/Card/CardBasket";

const api = new Api(API_URL);

const client: ApiClient = new ApiClient(api);

const events = new EventEmitter();

const catalog = new Catalog(events);

const cart = new Cart(events);

const gallery = new Gallery(ensureElement(".gallery"));

const modal = new Modal(ensureElement("#modal-container"), events);

const header = new Header(ensureElement(".header"), events);

const buyer = new Buyer(events);

const basket = new Basket(cloneTemplate("#basket"), events);

const order = new Order(cloneTemplate("#order"), events);

const contacts = new Contacts(cloneTemplate("#contacts"), events);

const success = new Success(cloneTemplate("#success"), events);

const cardPreview = new CardPreview(cloneTemplate("#card-preview"), CDN_URL, events)

const presenter = new Presenter(
  catalog,
  cart,
  events,
  client,
  gallery,
  modal,
  header,
  buyer,
  basket,
  order,
  contacts,
  success,
  cardPreview,
  CardCatalog,
  CardBasket,
);

presenter.start();