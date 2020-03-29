import { sendMessage } from './utils';
import { SEARCH_REQ } from './constants';

/**
 *
 * @type {{
 *   form: {HTMLElement}
 * }}
 */
const searchDOM = {};

/**
 *
 * @param {Window} global
 */
const initSearch = (global) => {
  const { document } = global;

  searchDOM.form = document.querySelector('.js-expandable-search');

  const displaySearchResult = (...args) => console.log(...args);

  const displaySearchError = (...args) => console.log(...args);

  const handleSearch = (evt) => {
    evt.preventDefault();
    const searchInputField = searchDOM.form.elements.searchInput;

    return sendMessage({ command: SEARCH_REQ, key: searchInputField.value })
      .then(displaySearchResult)
      .catch(displaySearchError)
      .finally(() => {
        searchDOM.form.reset();
      });
  };

  searchDOM.form.addEventListener('submit', handleSearch);
};

export default initSearch;
