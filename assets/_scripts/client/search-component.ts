import { Component, eventbus } from 'gia';
import throttle from 'lodash.throttle';
import clsx from 'clsx';
import { sendWorkerMessage } from './utils/dom';
import { SEARCH_REQ, SEARCH_UI_CLOSE, SEARCH_UI_OPEN } from '../constants';
import logger from './utils/logger';

type SearchResultItem = { url: string; title: string; category: string };

type SearchRequestResponse = {
  data: SearchResultItem[];
};

type SearchState = {
  searchText: string;
  searchResult: SearchResultItem[] | null;
  searchResultLoading: boolean;
  done: boolean;
};

type SearchRef = {
  searchForm: HTMLFormElement[];
  searchResultContainer: HTMLElement[];
};

class SearchComponent extends Component<SearchRef, SearchState> {
  loadingIndicator: HTMLElement | undefined;

  constructor(element: HTMLElement) {
    super(element);

    this.ref = {};
  }

  static noSearchResultIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="99.039" height="94.342" aria-hidden="true" fill="currentColor" stroke="currentColor">
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M93.113 88.415a5.38 5.38 0 0 1-7.61 0L58.862 61.773a1.018 1.018 0 0 1 0-1.44l6.17-6.169a1.018 1.018 0 0 1 1.439 0l26.643 26.643a5.38 5.38 0 0 1 0 7.608z" stroke-width="2.99955"></path>
        <path stroke-width="2" d="M59.969 59.838l-3.246-3.246M61.381 51.934l3.246 3.246M64.609 61.619l13.327 13.327"></path>
        <path stroke-width="3" d="M13.311 47.447A28.87 28.87 0 1 0 36.589 1.5c-10.318 0-20.141 5.083-24.7 13.46M2.121 38.734l15.536-15.536M17.657 38.734L2.121 23.198"></path>
      </g>
    </svg>
  `;

  static searchRequest = (searchText: string): Promise<SearchRequestResponse> =>
    sendWorkerMessage<SearchRequestResponse>({
      command: SEARCH_REQ,
      key: searchText,
    });

  static renderSearchResultItem = (result: SearchResultItem): string => `
      <a href="${result.url}" class="search__results__item">
         <p class="search__results__item__title">${result.title}</p>
         <p class="search__results__item__category endnote_ts">${result.category}</p>
      </a>
    `;

  insertContentInSearchContainer = (
    content: HTMLElement | DocumentFragment
  ): void => {
    const [searchResultsContainer] = this.ref.searchResultContainer ?? [];
    // replace existing content with new one if they exist
    if (searchResultsContainer.firstChild) {
      searchResultsContainer.replaceChild(
        content,
        searchResultsContainer.firstChild
      );
    } else {
      searchResultsContainer.appendChild(content);
    }
  };

  setLoadingIndicator(): void {
    const [searchResultsContainer] = this.ref.searchResultContainer ?? [];

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = clsx(
      'container',
      'loading-indicator',
      'js-loading-indicator'
    );
    loadingIndicator.textContent = `searching matches for ${this.state.searchText}...`;

    // replace search results with loader if they exist
    this.insertContentInSearchContainer(loadingIndicator);

    // make a reference for the just created loading indicator
    this.loadingIndicator = searchResultsContainer.querySelector(
      '.js-loading-indicator'
    ) as HTMLElement;
  }

  displaySearchResult(searchResult: SearchResultItem[]): void {
    // build search result
    const fragment = document.createDocumentFragment();
    const searchItemsWrapper = document.createElement('ul');
    searchItemsWrapper.className = clsx([
      'container',
      'js-search-result-list',
      'search-result-list',
    ]);

    searchResult.reduce((wrapper, cur) => {
      const li = document.createElement('li');
      li.innerHTML = SearchComponent.renderSearchResultItem(cur);
      wrapper.appendChild(li);
      return wrapper;
    }, searchItemsWrapper);

    fragment.appendChild(searchItemsWrapper);

    // insert search result into DOM
    this.insertContentInSearchContainer(fragment);
  }

  static displaySearchError = (err: typeof Error): void => {
    logger.warn(err);
  };

  displayNoResultFound = (): void => {
    const noResult = document.createElement('div');
    noResult.className = clsx([
      'container',
      'loading-indicator',
      'js-loading-indicator',
    ]);
    noResult.innerHTML = `
    <div>
      ${SearchComponent.noSearchResultIcon}
    </div>
    <p>no results for the term ${this.state.searchText}</p>
    `;

    this.insertContentInSearchContainer(noResult);
  };

  handleSearch = throttle<EventListener>((evt: Event) => {
    evt.preventDefault();
    const searchText = (<HTMLInputElement>evt.target).value;

    // Set loading visual cue
    this.setState({
      done: false,
      searchText,
      searchResultLoading: true,
    });
  }, 250);

  stateChange(stateChanges: Partial<SearchState>): void {
    if (
      'searchResultLoading' in stateChanges &&
      Boolean(stateChanges.searchResultLoading)
    ) {
      this.setLoadingIndicator();
    }

    if (stateChanges.searchText) {
      SearchComponent.searchRequest(stateChanges.searchText)
        .then(({ data }) =>
          this.setState({
            done: true,
            searchResult: data,
            searchResultLoading: false,
          })
        )
        .catch(SearchComponent.displaySearchError);
    }

    if (stateChanges.searchResult) {
      this.displaySearchResult(stateChanges.searchResult);
    }

    if (stateChanges.done && !stateChanges.searchResult) {
      this.displayNoResultFound();
    }
  }

  mount(): void {
    const [searchForm] = this.ref.searchForm ?? [];
    const [searchResultsContainer] = this.ref.searchResultContainer ?? [];

    const searchInputField = searchForm.elements.namedItem(
      'searchInput'
    ) as Element;

    searchForm.addEventListener('click', () => eventbus.emit(SEARCH_UI_OPEN));

    // close search if open and
    // the click target is not a descendant of the host element
    document.addEventListener('click', (evt) => {
      if (!searchForm.contains(evt?.target as Node)) {
        eventbus.emit(SEARCH_UI_CLOSE);
        searchResultsContainer.textContent = '';
      }
    });

    searchForm.addEventListener('submit', this.handleSearch);
    searchInputField.addEventListener('input', this.handleSearch);
  }
}

export default SearchComponent;
