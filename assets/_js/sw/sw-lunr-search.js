import lunr from 'lunr';
import { matchPrecache, precacheAndRoute } from 'workbox-precaching';

/**
 *
 * @param {string} [versionNumber]
 */
export const precacheSearchData = (versionNumber) =>
  // precache the site json file, so we can use it to respond to search results
  precacheAndRoute([{
    url: '/assets/site.json',
    revision: versionNumber || null,
  }]);

/**
 *
 * @param {string} searchText
 * @returns {Promise<{}|*>}
 */
const setupListenerForSearchRequest = async (searchText) => {
  const response = await matchPrecache('/assets/site.json');

  if (response.ok) {
    const data = await response.json();

    const idxr = lunr(function setConfig() {
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

  return {};
};

export default setupListenerForSearchRequest;
