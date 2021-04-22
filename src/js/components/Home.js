import {select, templates} from '../settings.js';
import {app} from '../app.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.home(element);

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    element.innerHTML = generatedHTML;

    thisHome.dom.order = document.querySelector(select.home.order);
    thisHome.dom.booking = document.querySelector(select.home.booking);
  }

  initWidgets() {
    const thisHome = this;

    thisHome.dom.booking.addEventListener('click', function() {
      app.activatePage('booking');
      window.location.hash = '#/booking';
    });
    thisHome.dom.order.addEventListener('click', function() {
      app.activatePage('order');
      window.location.hash = '#/order';
    }); 
  }
}

export default Home;