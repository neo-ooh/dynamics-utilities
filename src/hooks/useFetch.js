import React from 'react';
import useCache from './useCache'
import DynamicContext from '../components/DynamicContext';

/**
 *
 * @param { string|URL|Request } url Url to the resource or an already prepared Request object
 * @param {'get'|'post'} [method='get']
 * @param {Object} [body=null]
 * @param {boolean} [auth=false]
 */
const useFetch = (url, method = 'get', body = null, auth = false) => {
  const { api } = React.useContext(DynamicContext);
  let request;

  if(typeof url === 'string' || url instanceof URL) {
    request = api.prepareUrl(url, method, body, auth)
  } else {
    request = url;
  }

  const cache = useCache();
  const [ isLoading, setIsLoading ] = React.useState(true);
  const [ response, setResponse ] = React.useState(null);

  React.useEffect(() => {
    cache.get(request.url, () => fetch(request))
      .then(response => {
        setResponse(response)
        setIsLoading(false)
      })
  }, [request])

  return [response, isLoading];
};

export default useFetch;
