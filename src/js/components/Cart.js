import {select, settings, templates, classNames} from '../settings.js';
import utils from '/js/utils.js';
import CartProduct from '/js/components/CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions(); // show and hide cart (2)

    // console.log('new Cart:', thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);

    // show and hide cart (1)
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);

    // generate DOM elements
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    // console.log(thisCart.dom.productList);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subTotalPrice: thisCart.subTotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    console.log('payload:', payload);

    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
      
    fetch(url, options);
  }

  initActions() {  // show and hide cart (2)
    const thisCart = this;  // show and hide cart (3)
    // console.log('initActions');

    thisCart.dom.toggleTrigger.addEventListener('click', function(){  // show and hide cart (3)
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);  // show and hide cart (4)
    });

    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    // submit
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;
    console.log('adding product:', menuProduct);

    /* generate HTML based on template */ 
    // generate DOM elements (1)
    const generatedHTML = templates.cartProduct(menuProduct);

    /* create element using utils.createElementFromHTML */ 
    // generate DOM elements (2)
    thisCart.element = utils.createDOMFromHTML(generatedHTML);
    const generatedDOM = thisCart.element;

    // generate DOM elements (3)      
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart.products:', thisCart.products);

    thisCart.update();
  }

  remove(cartProduct) {
    const thisCart = this;

    const index = thisCart.products.indexOf(cartProduct);

    thisCart.products.splice(index, 1);

    cartProduct.dom.wrapper.remove();
 
    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    console.log('deliveryFee:', thisCart.deliveryFee);

    thisCart.totalNumber = 0;
    thisCart.subTotalPrice = 0;

    for (let products of thisCart.products) {
      thisCart.totalNumber += products.amount;
      thisCart.subTotalPrice += products.price;
      console.log('products:', products);
      console.log('thisCart.products:', thisCart.products);
    }
    console.log('totalNumber:', thisCart.totalNumber);
    console.log('subTotalPrice:', thisCart.subTotalPrice);

    if (thisCart.subTotalPrice === 0) {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
    } else {
      thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;
    }

    console.log('totalPrice:', thisCart.totalPrice);

    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;
    for (let price of thisCart.dom.totalPrice) {
      price.innerHTML = thisCart.totalPrice;
    }
        
  }

}

export default Cart;