import api from './../js/service/apiService';
import { formatDate } from './../js/helpers/date';

class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = {};
    this.lastSearch = {};
    this.airlines = {};
    // this.formatDate = helpers;
    this.formatDate = helpers.formatDate;
  }

  async init() {
    const response = await Promise.all([this.api.countries(), this.api.cities(), this.api.airlines()]);
    const [countries, cities, airlines] = response;

    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);
    this.airlines = this.serializeAirlines(airlines);

    return response;
  }

  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find(item => item.full_name === key);

    return city.code;
  }

  getCityNameByCode(code) {
    return this.cities[code].name;
  }

  getAirlinesNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : '';
  }

  getAirlinesLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : '';
  }

  // создание списка городов-стран для автозаполнения формы
  createShortCitiesList(cities) {
    // нужно сформировать данные такого вида {'Cities, Countries': null}
    // Object.entries -> [key, value]
    return Object.entries(cities).reduce((acc, [, city]) => {
      acc[city.full_name] = null;
      return acc;
    });
  }

  // приведение авикомпаний в нужный формат + лого
  serializeAirlines(airlines) {
    return airlines.reduce((acc, item) => {
      item.logo = `http://pics.avs.io/100/100/${item.code}.png`;
      item.name = item.name || item.name_translations.en;
      acc[item.code] = item;
      return acc;
    }, {});
  }

  // приведение стран в нужный формат
  serializeCountries(countries) {
    // {'Country code': {...}}
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }

  // приведение городов в странах в нужный формат для автозаполнения
  serializeCities(cities) {
    // {'City name, Country name':{...}}
    return cities.reduce((acc, city) => {
      const country_name = this.getCountryNameByCode(city.country_code);
      city.name = city.name || city.name_translations.en;
      const city_name = city.name || city.name_translations.en;
      const full_name = `${city_name}, ${country_name}`;
      acc[city.code] = {
        ...city,
        country_name,
        full_name,
      };
      return acc;
    });
  }

  // получаем название страны, к которой привязан город
  getCountryNameByCode(code) {
    // {'Country code': {...}}
    return this.countries[code].name;
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);

    this.lastSearch = this.serializeTickets(response.data, response.currency);
    console.log('lastSearch', this.lastSearch);
  }

  getLastSearch() {
    return this.lastSearch;
  }

  // ?серилизовать поиск так, чтобы внутри были названия города и страны
  serializeTickets(tickets, currency) {
    return Object.values(tickets).map(ticket => {
      return {
        ...ticket,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlinesLogoByCode(ticket.airline),
        airline_name: this.getAirlinesNameByCode(ticket.airline),
        departure_at: this.formatDate(ticket.departure_at, 'dd MMM yyyy hh:mm'),
        return_at: this.formatDate(ticket.return_at, 'dd MMM yyyy hh:mm'),
        id: `${ticket.departure_at}${ticket.flight_number}`,
        // id: `${Math.trunc(Math.random() * 100000)}${ticket.flight_number}`,
        currency,
      };
    });
  }
}

const locations = new Locations(api, { formatDate });

export default locations;

// {'Cities, Countries': null}
// [{}, {}]
//{'Cities': {...} -> cities[code]}
