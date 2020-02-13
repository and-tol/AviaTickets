// FIXME: после смены валюты новый выбор происходит, но значок валюты остается тот же
import { getDropdown } from './../plugins/materialize';
import { getModal } from '../plugins/materialize';
import currencyUI from './currency';
import locations from './../../store/locations'; // ?
import favorites from './../../store/favorites';

class TicketsFavoritesUI {
  constructor(dropdown, modal, currency) {
    // элементы dropdown
    this.container = document.getElementById('dropdown1');
    this.buttonDropdown = document.querySelector('[data-target="dropdown1"]');
    // элементы модального окна
    this.containerModal = document.querySelector('.modal-content');
    this.buttonModal = document.querySelector('.modal-trigger');
    this.modalFavoritesParent = this.containerModal;

    this.buttonFavoriteParent = document.querySelector('.tickets-sections');

    // экземляры/instance из Matialize для вызова методов фрэймворка
    this.toggleDropdown = dropdown(this.buttonDropdown);
    this.triggerModal = modal(this.buttonModal);

    // получаем символ валюты
    this.getCurrencySymbol = currency.getCurrencySymbol.bind(currency);
  }

  // modal methods
  openModal() {
    this.triggerModal.open();
  }

  // dropdown methods
  openDropdown() {
    this.toggleDropdown.open();
  }

  closeDropdown() {
    this.toggleDropdown.close();
  }
  //

  renderTicketsFavorites(favorites) {
    this.clearContainer();

    // если не добавлено ни одного билета
    if (!favorites.length) {
      this.showEmptyMsg();
      return;
    }

    let fragment = '';
    const currency = this.getCurrencySymbol();

    favorites.forEach(ticket => {
      const template = TicketsFavoritesUI.ticketsFavoritesTemplate(ticket);
      fragment += template;
    });

    this.container.insertAdjacentHTML('afterbegin', fragment);
    this.containerModal.insertAdjacentHTML('afterbegin', fragment);
  }

  clearContainer() {
    this.container.innerHTML = '';
    this.containerModal.innerHTML = '';
  }

  showEmptyMsg() {
    const template = TicketsFavoritesUI.emptyMessageTemplate();

    this.container.insertAdjacentHTML('afterbegin', template);
    this.containerModal.insertAdjacentHTML('afterbegin', template);
  }

  static emptyMessageTemplate() {
    return `
    <div class="tickets-empty-res-msg">
      Вы не добавили в избранные ни одного билета.
      </br>
      You have not added any tickets to your favorites.
    </div>
    `;
  }

  static ticketsFavoritesTemplate(ticket, currency) {
    return `
    <div class="favorite-item  d-flex align-items-start" data-flight-id="${ticket.id}">
      <img src="${ticket.airline_logo}" class="favorite-item-airline-img" />
      <div class="favorite-item-info d-flex flex-column">
        <div class="favorite-item-destination d-flex align-items-center">
          <div class="d-flex align-items-center mr-auto">
            <span class="favorite-item-city">${ticket.origin_name}</span>
            <i class="medium material-icons">flight_takeoff</i>
          </div>
          <div class="d-flex align-items-center">
            <i class="medium material-icons">flight_land</i>
            <span class="favorite-item-city">${ticket.destination_name}</span>
          </div>
        </div>
        <div class="ticket-time-price d-flex align-items-center">
          <span class="ticket-time-departure">${ticket.departure_at}</span>
          <span class="ticket-price ml-auto">$${ticket.price}</span>
        </div>
        <div class="ticket-additional-info">
          <span class="ticket-transfers">Пересадок: ${ticket.transfers}</span>
          <span class="ticket-flight-number">Номер рейса: ${ticket.flight_number}</span>
        </div>
        <a class="waves-effect waves-light btn-small pink darken-3 delete-favorite ml-auto">Delete</a>
      </div>
    </div>
    `;
  }
}

const favoritesUI = new TicketsFavoritesUI(getDropdown, getModal, currencyUI);

export default favoritesUI;
