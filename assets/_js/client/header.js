import throttle from 'lodash.throttle';
import { sendWorkerMessage, hasClass, toggleClass } from './utils';
import { SEARCH_REQ } from '../constants';

/**
 * @description stores references to DOM elements needed for implementing search
 * @type {{
 *   header: {HTMLElement}
 *   searchForm: {HTMLElement}
 *   searchInputField: {HTMLElement}
 *   searchResultsContainer: {HTMLElement}
 *   loadingIndicator: {null|HTMLElement}
 * }}
 */
const headerDOM = {};

const headerSearchActive = () => headerDOM.header.hasAttribute('search-expanded');
const setHeaderSearchActive = () =>  headerDOM.header.setAttribute('search-expanded', '');
const setHeaderSearchDisabled = () =>  headerDOM.header.removeAttribute('search-expanded');

/**
 *
 * @param {object} result
 * @param {string} result.url
 * @param {string} result.title
 * @param {string} result.category
 * @returns {string}
 */
const searchResultItem = (result) => `
  <a href="${result.url}" class="search__results__item">
     <p class="search__results__item__title">${result.title}</p>
     <p class="search__results__item__category endnote_ts">${result.category}</p>
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
 * @param content {Node}
 */
const insertContentInSearchContainer = (content) => {
  // replace existing content with new one if they exist
  if(headerDOM.searchResultsContainer.firstChild) {
    headerDOM.searchResultsContainer.replaceChild(content, headerDOM.searchResultsContainer.firstChild);
  } else {
    headerDOM.searchResultsContainer.appendChild(content);
  }
}

/**
 * Adds loading indicator for our search functionality
 * @returns {null}
 */
const setLoadingIndicator = () => {
  // checks if the reference to our loading indicator is still in the DOM
  if(headerDOM.loadingIndicator?.parentElement) return null;

  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'js-loading-indicator';
  loadingIndicator.textContent = 'Loading...';

  // replace search results with loader if they exist
  insertContentInSearchContainer(loadingIndicator);

  // make a reference for the just created loading indicator
  headerDOM.loadingIndicator = headerDOM.searchResultsContainer.querySelector('.js-loading-indicator');

  return null;
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
  const searchItemsWrapper = document.createElement('ul');
  searchItemsWrapper.className = 'js-search-result-list search-result-list';

  searchResult.forEach(result => {
    const li = document.createElement('li');
    li.innerHTML = searchResultItem(result);
    searchItemsWrapper.appendChild(li);
  });

  fragment.appendChild(searchItemsWrapper);

  insertContentInSearchContainer(fragment);
};

/**
 *
 * @param logger
 * @param args
 * @returns {*}
 */
const displaySearchError = (logger,...args) => logger.warn(...args);

/**
 *
 * @param logger
 * @param evt {KeyboardEvent|MouseEvent}
 * @returns {Promise<{} | *>|null}
 */
const handleSearch = throttle((logger, evt) => {
  evt.preventDefault();

  const searchText = evt.target.value;

  if(!searchText) return null;

  // Set loading visual cue
  setLoadingIndicator();

  return searchRequest(searchText)
    .then(displaySearchResult)
    .catch(err => displaySearchError(logger, err))
}, 250);

/**
 *
 * @param landingPage {HTMLElement}
 */
const animateLandingPageHeader = (landingPage) => {
  const toggleBoundary = 10;
  const classToToggle = 'ns-header--hidden';

  const landingPageContent = landingPage.querySelector('.main-content');

  landingPage.addEventListener('scroll', throttle(() => {
    const contentRect = landingPageContent.getBoundingClientRect();
    const classIsSet = hasClass(headerDOM.header, classToToggle);

    requestAnimationFrame(() => {
      if (classIsSet && contentRect.y < toggleBoundary) {
        toggleClass(headerDOM.header, classToToggle, false);
      }

      if(!classIsSet && contentRect.y > toggleBoundary) {
        if(headerSearchActive()) {
          setHeaderSearchDisabled();
        }
        toggleClass(headerDOM.header, classToToggle, true);
      }
    });
  }, 250));
};

/**
 *
 * @param {Window} global
 * @param logger
 */
const initHeaderNav = (global, logger) => {
  const { document } = global;

  headerDOM.header = document.querySelector('#header');
  headerDOM.searchForm = document.querySelector('.js-search-form');
  headerDOM.searchResultsContainer = document.querySelector('.js-search-result');
  headerDOM.searchInputField = headerDOM.searchForm.elements.searchInput;
  headerDOM.loadingIndicator = null;

  const landingPage = document.querySelector('.ns-landing-screen');

  if(landingPage) {
    animateLandingPageHeader(landingPage)
  }

  headerDOM.searchForm.addEventListener('click', () => {
    if(!headerSearchActive()) {
      setHeaderSearchActive()
    }
  });

  // close search if open and
  // the click target is not a descendant of the host element
  document.addEventListener('click', (evt) => {
    if(headerSearchActive() && !headerDOM.searchForm.contains(evt.target)) {
      setHeaderSearchDisabled();
      headerDOM.searchResultsContainer.textContent = '';
    }
  });

  headerDOM.searchForm.addEventListener('submit', handleSearch.bind(null, logger));
  headerDOM.searchInputField.addEventListener('input', handleSearch.bind(null, logger));
};

export default initHeaderNav;
