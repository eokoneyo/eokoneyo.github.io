import { sendWorkerMessage } from '../utils';
import { SEARCH_REQ } from '../constants';

/**
 * @description stores references to DOM elements needed for implementing search
 * @type {{
 *   form: {HTMLElement}
 *   searchInputField: {HTMLElement}
 *   searchResultsContainer: {HTMLElement}
 * }}
 */
const searchDOM = {};

/**
 *
 * @param {object} result
 * @param {string} result.url
 * @param {string} result.title
 * @param {string} result.category
 * @returns {string}
 */
const searchResultItem = (result) => `
  <a href="${result.url}">
    <div>
      <h6>${result.title}</h6>
      <span>${result.category}</span>
    </div>
  </a>
`;

/**
 *
 * @param {string} searchText
 * @returns {Promise<{}|*>}
 */
const searchRequest = (searchText) => sendWorkerMessage({ command: SEARCH_REQ, key: searchText });

/**
 *
 * @param searchResult
 */
const displaySearchResult = ({ data: searchResult }) => {
  if(!searchResult.length) {
    throw new Error('no results!');
  }

  searchDOM.searchResultsContainer.innerHTML =  searchResult.map(result => {
    return `<li>${searchResultItem(result)}</li>`
  }).join(' ');
};

const displaySearchError = (...args) => console.log(...args);

/**
 *
 * @param {Window} global
 */
const initSearch = (global) => {
  const { document } = global;

  searchDOM.form = document.querySelector('.js-search-form');
  searchDOM.searchResultsContainer = document.querySelector('.js-search-result');
  searchDOM.searchInputField = searchDOM.form.elements.searchInput;

  const handleSearch = (evt) => {
    evt.preventDefault();
    const searchText = searchDOM.searchInputField.value;

    if(!searchText) return null;

    return searchRequest(searchText)
      .then(displaySearchResult)
      .catch(displaySearchError);
  };

  searchDOM.form.addEventListener('submit', handleSearch);
  searchDOM.searchInputField.addEventListener('blur', handleSearch);
};

export default initSearch;
