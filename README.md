# Dynamics Utilities

Collection of methods common to multiple Neo-Traffic dynamics. These methods range from support detection to `CacheStorage` handling. 

### Installation

```shell
$ npm i Neo-Traffic/dynamics-utilities
```

## What's inside

This modules provides the following elements.

**Supports related content**
* `isBroadSignPlayer -> boolean` Tell if the current environment the application is running is a *BroadSign* player.
* `resolveSupport(string hint = null, Object fallback = {FCL}) -> Object` Detect the current support the application is running in. Supports hinting/overriding and fallback values.
* `supports -> [Object]` The actual list of supports recognized as supports with their name, preferred design and dimensions

**Caching methods**
* `cache.setCacheName(string cacheName) -> Void` Sets the name of the cache to work with. The cache name is empty by default.
* `cache.get(string URL) -> Promise<Response>` Takes a url as argument and returns the response for it. The response may be coming from the server or the application cache. Automatically handles refreshing old request and fetching new one.
* `cache.getJson(string URL) -> Promise<Object>` Same as `cache.get` but returns only the response content already formatted as an object.
* `cache.getImage(string URL) -> Promise<String URL>` Same as `cache.get` but returns a link to the stored resource.
* `cache.add(string URL) -> Promise<Response>` Fetch, store the given resource to the cache, and returns a copy of the response 
* `cache.remove(string URL) -> Void` Remove the resource matching the given URL from the cache.

All methods are extensively documented inside the code itself.