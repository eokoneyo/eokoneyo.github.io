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
};

/**
 * precaches the site json file, so we can use it to respond to search results
 */
const precacheSearchData = (versionNumber?: string): void =>
  precacheAndRoute([
    {
      url: __SEARCH_DATA_PATH__,
      revision: versionNumber,
    },
  ]);

/**
 * handler for responding to search request
 */
export const configureSearchHelper = (versionNumber?: string) => {
  let searchIdx: lunr.Index;
  let searchData: SearchResultItem[];

  precacheSearchData(versionNumber);

  return async function processSearchRequest(
    searchText: string
  ): Promise<SearchResultItem[]> {
    if (!searchIdx) {
      const response = await matchPrecache(__SEARCH_DATA_PATH__);

      if (response?.ok) {
        searchData = (await response.json()) as SearchResultItem[];

        searchIdx = lunr(function configureLunr() {
          this.field('id');
          this.field('title', { boost: 10 });
          this.field('category');
          this.field('content');

          searchData.forEach((datum, index) =>
            this.add({
              id: index,
              title: datum.title,
              content: datum.content,
              category: datum.category,
            })
          );
        });
      }
    }

    return (searchIdx.search(searchText) ?? []).map(
      (result) => searchData[Number(result.ref)]
    );
  };
};

export default configureSearchHelper;
