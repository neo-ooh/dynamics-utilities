import { DateTime } from 'luxon';
import parseCacheControl from 'parse-cache-control'

class Cache {
  constructor(cacheName) {
    this.cacheName = cacheName;
    this.validate();
  }

  validate() {
    const refreshKey  = `${ this.cacheName }.refresh`;
    const refreshRate = 1000 * 3600 * 24;
    const lastUpdate  = localStorage.getItem(refreshKey);

    if (!lastUpdate || DateTime.now() - lastUpdate > refreshRate) {
      // Cache doesn't exist or is outdated, delete it
      caches.delete(this.cacheName).then(() => {
        localStorage.setItem(refreshKey, DateTime.now().set({ hour: 0, minutes: 0, seconds: 0 }).toJSDate().getTime());
      });
    }
  }

  __getCache() {
    return caches.open(this.cacheName);
  }

  /**
   * This method will try to get the requested item from the cache.
   * If it is missing, it will use the `onMiss` callback to get the value, store it, and then return it.
   * @param url
   * @param {function(string): Promise<Response>} onMiss a function returning a `fetch()`, unmodified, response.
   */
  async get(url, onMiss = null) {
    // Get the cache
    const cache = await caches.open(this.cacheName);

    // Get the item in the cache corresponding to the given url
    const inStore = await cache.match(url);
    let response;

    if (!inStore) {
      if(!onMiss) {
        // No callback were given to retrieve the missing item, return undefined.
        return undefined;
      }

      // Item is not stored, we need to get it and store it.
      /**
       * @type Response
       */
      const item = await onMiss(url);

      // Was the request successful ?
      if(!item.ok) {
        // No, just return
        return item;
      }

      response   = await this.store(url, item);
    } else {
      response = inStore;
    }

    const cacheControl = response.headers.get('Cache-Control');
    const maxAge       = cacheControl !== null ? parseCacheControl(cacheControl)['max-age'] : 3600;
    const requestDate  = new Date(response.headers.get('Date'));

    // Check the response is not too old
    if (Date.now() - requestDate.getTime() > maxAge * 1000) {
      // The request is too old, let's refresh it
      // We do not return the refreshed response as we do not want to slow down the application. We return the existing
      // response even though it is outdated, while it gets refreshed in the background.
      this.store(url, await onMiss(url));
    }

    return response;
  }

  /**
   *
   * @param url
   * @param response
   * @return {Promise<Response|null>}
   */
  async store(url, response) {
    // If the given response is null, do not store it and pass through
    if (!response) {
      console.warn('Refusing to store null response for ' + url);
      return null;
    }

    const cache = await this.__getCache();

    // Delete any previously stored responses
    await cache.delete(url);

    // Clone the response, as caching consumes it
    const responseCopy = response.clone();

    await cache.put(url, response);

    // Finally, return the cached response.
    return responseCopy;
  }

  async destroy(url) {
    const cache = await caches.open(this.cacheName);
    await cache.delete(url);
  }

  async addAll(...args) {
    return (await this.__getCache()).addAll(args);
  }
}

export default Cache;
