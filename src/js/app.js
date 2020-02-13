import '../css/style.css';
import './plugins';
import locations from './../store/locations';
import formUI from './views/form';
import ticketsUI from './views/tickets';
import currencyUI from './views/currency';
import favoritesUI from './views/ticketsFavoritesUI';
import favorites from './../store/favorites';

document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // console.log('favorites', favorites);

  const form = formUI.form;
  const dropdown = favoritesUI.container;
  const btnDropdown = favoritesUI.buttonDropdown;
  const btnGetFavorite = favoritesUI.buttonFavoriteParent;
  const btnRemoveFavorite = favoritesUI.containerModal;

  // Events
  // отправка формы
  form.addEventListener('submit', event => {
    event.preventDefault();

    onFormSubmit();
  });

  // слушаем кнопку для открытия -выпадающего списка- с избранными билетами
  btnDropdown.addEventListener('click', openDropdownHandler);
  // слушаем кнопку для открытия -модального окна- с избранными билетами
  btnDropdown.addEventListener('click', openModalHandler);

  // слушаем кнопку добавить в избранное "Favorites"
  btnGetFavorite.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;

    if (target.classList.contains('add-favorite')) {
      // получаем "родителя" кнопки
      const parent = target.closest('[data-flight-id]');
      // читаем информацию в data-* id в "родителе"
      const flightID = parent.dataset.flightId;
      // выбираем нужный рейс в фаворит
      const favoriteTicket = locations.lastSearch.find(ticket => {
        return ticket.id === flightID;
      });
      // определяем валюту рейса
      const favoriteTicketCurrency = favoriteTicket.currency;
      console.log('favoriteTicketCurrency', favoriteTicketCurrency);

      // добавляем выбранный рейс в сторе фавориты
      favorites.addFavorite(favoriteTicket, flightID);
    }

    // сразу добавляем в DOM избранные билеты
    favoritesUI.renderTicketsFavorites(favorites.favoritesTickets);
  });
  //слушаем кнопку удаления билетов из избранного "Favorites"
  btnRemoveFavorite.addEventListener('click', removeFavoriteHandler);

  // Handlers
  // открыть выпадающий список с избранными билетами
  function openDropdownHandler() {
    favoritesUI.openDropdown();
  }
  // открыть -модальное окно- с избранными билетами
  function openModalHandler() {
    favorites.clearFavorites();
    favoritesUI.renderTicketsFavorites(favorites.favoritesTickets);
    favoritesUI.openModal();
  }

  // функция удаления билетов из избранного "Favorites"
  function removeFavoriteHandler(event) {
    event.preventDefault();

    const target = event.target;

    if (target.classList.contains('delete-favorite')) {
      // получаем "родителя" кнопки
      const parent = target.closest('[data-flight-id]');
      // читаем информацию в data-* в "родителе"
      const flightID = parent.dataset.flightId;
      console.log('flightID', flightID);
      // удаляем выбранный рейс
      favorites.removeFavorite(flightID);

      // новый рендер избранных билетов
      favoritesUI.renderTicketsFavorites(favorites.favoritesTickets);
    }
  }

  //

  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList);
  }

  async function onFormSubmit() {
    // 1) собрать данные из интутов формы
    // и Преобразовать в CODE, CODE, 2020-02, 2020-03
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currencyValue;

    // 2) поместить данные в объект
    // 3) отправить эти данные в объекте на сервер для получения билетов
    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });

    ticketsUI.renderTickets(locations.lastSearch);
  }

  favoritesUI.renderTicketsFavorites(favorites.favoritesTickets);
});
