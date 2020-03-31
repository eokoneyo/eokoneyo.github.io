import lunr from 'lunr';
import { matchPrecache, precacheAndRoute } from 'workbox-precaching';

/**
 * precaches the site json file, so we can use it to respond to search results
 * @param {string|null} versionNumber
 */
export const precacheSearchData = (versionNumber = null) =>
  precacheAndRoute([{
    url: '/assets/site.json',
    revision: versionNumber,
  }]);

/**
 * handler for responding to search requests
 * @param {string} searchText
 * @returns {Promise<*[]|*>}
 */
const setupListenerForSearchRequest = async (searchText) => {
  const response = await matchPrecache('/assets/site.json');

  if (response.ok) {
    const data = await response.json();

    const idxr = lunr(function configureLunr() {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('category');
      this.field('content');

      data.forEach((datum, index) => this.add({
        id: index,
        title: datum.title,
        category: datum.category,
        content: datum.content,
      }));
    });

    return idxr.search(searchText).map((result) => data[result.ref]);
  }

  return [];
};

export default setupListenerForSearchRequest;
