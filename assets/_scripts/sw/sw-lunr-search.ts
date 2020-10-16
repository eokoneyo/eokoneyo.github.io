import lunr from 'lunr';
import { matchPrecache, precacheAndRoute } from 'workbox-precaching';

// eslint-disable-next-line no-underscore-dangle
declare let __SEARCH_DATA_PATH__: string;

type SearchResultItem = {
  url: string;
  date: string;
  title: string;
  content: string;
  category: string;
}

/**
 * precaches the site json file, so we can use it to respond to search results
 */
export const precacheSearchData = (versionNumber?: string): void =>
  precacheAndRoute([{
    url: __SEARCH_DATA_PATH__,
    revision: versionNumber,
  }]);

/**
 * handler for responding to search request
 */
export const setupListenerForSearchRequest = async (searchText: string): Promise<SearchResultItem[]> => {
  const response = await matchPrecache(__SEARCH_DATA_PATH__);

  if (response?.ok) {
    const data = await response.json() as SearchResultItem[];

    const idxr = lunr(function configureLunr() {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('category');
      this.field('content');

      data.forEach((datum, index) => this.add({
        id: index,
        title: datum.title,
        content: datum.content,
        category: datum.category,
      }));
    });

    return idxr.search(searchText).map((result) => data[Number(result.ref)]);
  }

  return [];
};

