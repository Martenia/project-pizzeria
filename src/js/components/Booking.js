import {templates, select, settings, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from '/js/components/AmountWidget.js';
import DatePicker from '/js/components/DatePicker.js';
import HourPicker from '/js/components/HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.dom = {};

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.tableInfo = '';
    // thisBooking.initTables();
  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    // console.log('getData params', params);

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking 
                                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event   
                                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event   
                                     + '?' + params.eventsRepeat.join('&'),
    };

    // console.log('getData urls', urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      }) 
      // .then(function(bookingsResponse) {
      //   return bookingsResponse.json();
      // }) 
      .then(function([bookings, eventsCurrent, eventsRepeat]) {
        // console.log('bookings', bookings);
        // console.log('eventsCurrent', eventsCurrent);
        // console.log('eventsRepeat', eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDom();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      // console.log('loop', hourBlock);

      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }
  
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDom() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      table.classList.remove(classNames.booking.tableSelected);
      thisBooking.tableInfo = null;

      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }

    }
  }

  initTables() {
    const thisBooking = this;
    
    const tableId = parseInt(event.target.getAttribute(settings.booking.tableIdAttribute));
    if (tableId) {
      if(!event.target.classList.contains(classNames.booking.tableBooked)){
        thisBooking.tableInfo = tableId;
        
      }else{
        alert('Stolik jest zajęty');
      }

      for(let table of thisBooking.dom.tables){
        table.classList.remove(classNames.booking.tableSelected);
        if (!event.target.classList.contains(classNames.booking.tableBooked) && thisBooking.tableInfo == tableId){
          event.target.classList.add(classNames.booking.tableSelected);
          thisBooking.tableInfo = tableId;
        }else{
          thisBooking.reservationTable = null;
          event.target.classList.remove(classNames.booking.tableSelected);
        }
      }
      if(!event.target.classList.contains(classNames.booking.tableSelected)){
        thisBooking.tableInfo = null;
      }
    }
    console.log('thisBooking.tableInfo:', thisBooking.tableInfo);
  }

  sendBooking() {
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;
  
    const payload = {
      'date': thisBooking.datePicker.value,
      'hour': thisBooking.hourPicker.value,
      'table': thisBooking.tableInfo,
      'duration': parseInt(thisBooking.hoursAmount.value),
      'ppl': parseInt(thisBooking.peopleAmount.value),
      'starters': [],
      'phone': thisBooking.dom.phone.value,
      'address': thisBooking.dom.address.value,
    }; 

    for(let starter of thisBooking.dom.starters) {
      if (starter.checked == true) {
        payload.starters.push(starter.value);
      }
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

  render(element) {
    const thisBooking = this;

    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget(element);
    // console.log('generatedHTML:', generatedHTML);

    thisBooking.dom = {};
    /* booking container */
    thisBooking.dom.wrapper = element;
    element.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = element.querySelectorAll(select.booking.tables);

    thisBooking.dom.phone = element.querySelector(select.cart.phone);
    thisBooking.dom.address = element.querySelector(select.cart.address);
    thisBooking.dom.starters = element.querySelectorAll(select.booking.starters);

    thisBooking.dom.floor = element.querySelector(select.booking.floor);

    thisBooking.dom.form = element.querySelector(select.booking.form);
    // thisBooking.dom.form = element.querySelector('[type="submit"]');
    
    console.log('thisBooking.dom.form:', thisBooking.dom.form);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function() {
      thisBooking.updateDom();
    });
    
    thisBooking.dom.floor.addEventListener('click', function(event) {
      event.preventDefault();
      thisBooking.initTables();
    });
    
    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });
  }
}

export default Booking;