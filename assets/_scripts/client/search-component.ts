import { Component, eventbus } from 'gia';
import throttle from 'lodash.throttle';
import { sendWorkerMessage } from './utils';
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
  constructor(element: HTMLElement) {
    super(element);

    this.ref = {};
  }

  loadingIndicator: HTMLElement | undefined;

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
    loadingIndicator.className =
      'container loading-indicator js-loading-indicator';
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
    searchItemsWrapper.className =
      'container js-search-result-list search-result-list';

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
    noResult.className = 'container loading-indicator js-loading-indicator';
    noResult.textContent = `no results for the term ${this.state.searchText}`;

    this.insertContentInSearchContainer(noResult);
  };

  handleSearch = throttle<EventListener>((evt: Event) => {
    evt.preventDefault();
    const searchText = (<HTMLInputElement>evt.target).value;

    if (!searchText) return;

    // Set loading visual cue
    this.setState({
      done: false,
      searchText,
      searchResultLoading: true,
    });

    SearchComponent.searchRequest(searchText)
      .then(({ data }) =>
        this.setState({
          done: true,
          searchResult: data,
          searchResultLoading: false,
        })
      )
      .catch(SearchComponent.displaySearchError);
  }, 250);

  stateChange(stateChanges: Partial<SearchState>): void {
    if (
      'searchResultLoading' in stateChanges &&
      Boolean(stateChanges.searchResultLoading)
    ) {
      this.setLoadingIndicator();
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
