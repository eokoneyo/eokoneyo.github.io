import { sendWorkerMessage } from '../utils';
import { SEARCH_REQ } from '../constants';

/**
 * @description stores references to DOM elements needed for implementing search
 * @type {{
 *   form: {HTMLElement}
 *   searchInputField: {HTMLElement}
 *   searchResultsContainer: {HTMLElement}
 *   loadingIndicator: {HTMLElement}
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

const setLoadingIndicator = () => {

  if(searchDOM.loadingIndicator.length) return null;

  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'js-loading-indicator';
  loadingIndicator.textContent = 'Loading...';
  searchDOM.searchResultsContainer.appendChild(loadingIndicator);

  // make a reference for the just created loading indicator
  searchDOM.loadingIndicator = searchDOM.searchResultsContainer.querySelector('.js-loading-indicator');
};

/**
 *
 * @param {array} searchResult
 */
const displaySearchResult = ({ data: searchResult }) => {
  if(!searchResult.length) {
    throw new Error('no results!');
  }

  const fragment = document.createDocumentFragment();

  searchResult.forEach(result => {
    const li = document.createElement('li');
    li.innerHTML = searchResultItem(result);
    fragment.appendChild(li);
  });

  searchDOM.searchResultsContainer.replaceChild(fragment, searchDOM.loadingIndicator);
};

/**
 *
 * @param args
 */
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

    if(!searchText || searchText.length < 3) return null;

    // Set loading visual cue
    setLoadingIndicator();

    return searchRequest(searchText)
      .then(displaySearchResult)
      .catch(displaySearchError);
  };

  searchDOM.form.addEventListener('submit', handleSearch);
  searchDOM.searchInputField.addEventListener('input', handleSearch);
};

export default initSearch;
