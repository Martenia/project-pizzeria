/* global Handlebars */

export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product', // CODE ADDED
    bookingWidget: '#template-booking-widget', // new
    home: '#template-home', // home
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages', // new
    booking: '.booking-wrapper', // new
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount', // CODE CHANGED
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
    datePicker: { // start new
      wrapper: '.date-picker',
      input: `input[name="date"]`,
    },
    hourPicker: {
      wrapper: '.hour-picker',
      input: 'input[type="range"]',
      output: '.output',
    }, // end new
  },
  // CODE ADDED START
  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
  booking: { // start new
    peopleAmount: '.people-amount',
    hoursAmount: '.hours-amount',
    tables: '.floor-plan .table',
    starters: '[name="starter"]',
    floor: '.floor-plan',
    form: '.booking-form',
  },
  nav: {
    links: '.main-nav a',
  }, // end new
  // CODE ADDED END
  home: {
    order: '.order-online',
    booking: '.book-a-table',
  }
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  // CODE ADDED START
  cart: {
    wrapperActive: 'active',
  },
  booking: { // start new
    loading: 'loading',
    tableBooked: 'booked',
    tableSelected: 'selected',
  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  }, // end new
  // CODE ADDED END
};
export const settings = {
  hours: { // start new
    open: 12,
    close: 24,
  }, // end new
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  }, // CODE CHANGED
  datePicker: { // start new
    maxDaysInFuture: 14,
  }, // end new
  // CODE ADDED START
  cart: {
    defaultDeliveryFee: 20,
  },
  booking: { // start new
    tableIdAttribute: 'data-table',
  }, // end new
  db: {
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
    product: 'product',
    order: 'order',
    booking: 'booking', // start new
    event: 'event',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false', // end new
  },
  // CODE ADDED END
};

export const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  // CODE ADDED START
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  // CODE ADDED END
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML), // new
  home: Handlebars.compile(document.querySelector(select.templateOf.home).innerHTML), // home
};