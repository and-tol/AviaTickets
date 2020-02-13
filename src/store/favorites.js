// TODO: очистку favoritesTickets после смены валюты

class Favorites {
  constructor() {
    this.favoritesTickets = [];
  }

  addFavorite(favoriteTicket, flightID, currency) {
    // проверить что массив не пустой
    if (this.favoritesTickets.length) {
      console.log('this.favoritesTickets', this.favoritesTickets);
      // получаем билет из уже выбранных для проверки на повторный выбор
      const currentTicket = this.favoritesTickets.find(ticket => {
        return ticket.id === flightID;
      });

      // проверить есть ли уже такой рейс и валюта
      if (currentTicket === undefined || currentTicket.id !== flightID || currentTicket.currency !== currency) {
        const favTickets = this.favoritesTickets;

        this.favoritesTickets = [...favTickets, favoriteTicket];
      }
    } else {
      this.favoritesTickets = [favoriteTicket];
    }
  }

  removeFavorite(flightID) {
    this.favoritesTickets = this.favoritesTickets.filter((ticket, index, arr) => {
      return ticket.id !== flightID;
    });
  }

  getFavoritesTickets() {
    return this.favoritesTickets;
  }

  clearFavorites() {
    // return this.favoritesTickets.splice(0, this.favoritesTickets.length);
    this.favoritesTickets.length = 0;
  }
}

const favorites = new Favorites();

export default favorites;
