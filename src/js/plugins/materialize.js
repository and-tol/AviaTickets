import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';

// Init select
const select = document.querySelectorAll('select');
M.FormSelect.init(select);

export function getSelectInstance(elem) {
  return M.FormSelect.getInstance(elem);
}

// Init autocomplete
const autocomplete = document.querySelectorAll('.autocomplete');
M.Autocomplete.init(autocomplete);

export function getAutocompleteInstance(elem) {
  return M.Autocomplete.getInstance(elem, {
    data: {
      Apple: null,
      Microsoft: null,
      Google: 'https://placehold.it/250x250',
    },
  });
}

// Init datepickers
const datepickers = document.querySelectorAll('.datepicker');

M.Datepicker.init(datepickers, {
  showClearBtn: true,
  format: 'yyyy-mm',
});

export function getDatePickerInstance(elem) {
  return M.Datepicker.getInstance(elem);
}

// Init Dropdown
const dropdown = document.querySelectorAll('.dropdown-trigger');
M.Dropdown.init(dropdown, {
  closeOnClick: false,
});

export function getDropdown(elem) {
  return M.Dropdown.init(elem);
}

// Init Modal
const modal = document.querySelectorAll('.modal');
M.Modal.init(modal);

export function getModal(elem) {
  return M.Modal.getInstance(elem);
}
