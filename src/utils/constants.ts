/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

export const TEXT = {
  // Карточки
  ADD_TO_CART: 'В корзину',
  REMOVE_FROM_CART: 'Удалить из корзины',
  UNAVAILABLE: 'Недоступно',
  PRICELESS: 'Бесценно',
  PRICE_SUFFIX: 'синапсов',
  
  // Корзина
  BASKET_EMPTY: 'Корзина пуста',
  BASKET_TOTAL_SUFFIX: 'синапсов',
  
  // Успешное оформление
  SUCCESS_TITLE: 'Заказ оформлен',
  SUCCESS_DESCRIPTION_PREFIX: 'Списано',
  SUCCESS_BUTTON: 'За новыми покупками!',
  
  // Ошибки валидации
  ERROR_ADDRESS_REQUIRED: 'Введите адрес доставки',
  ERROR_PAYMENT_REQUIRED: 'Выберите способ оплаты',
  ERROR_EMAIL_REQUIRED: 'Введите email',
  ERROR_PHONE_REQUIRED: 'Введите телефон',
};

export const settings = {

};