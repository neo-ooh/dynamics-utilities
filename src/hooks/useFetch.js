import React          from 'react';
import DynamicContext from '../components/DynamicContext';
import useCache       from './useCache';

/**
 *
 * @param { string|URL|Request } url Url to the resource or an already prepared Request object
 * @param {'get'|'post'} [method='get']
 * @param {Object} [body=null]
 * @param {boolean} [auth=false]
 */
const useFetch = (url, method = 'get', body = null, auth = false) => {
  const { api } = React.useContext(DynamicContext);
  const request = React.useMemo(() => {
    if (typeof url === 'string' || url instanceof URL) {
      return api.prepareUrl(url, method, body, auth);
    }

    return url;
  }, [ url, method, body, auth ]);


  const cache                       = useCache();
  const [ isLoading, setIsLoading ] = React.useState(true);
  const [ response, setResponse ]   = React.useState(null);

  React.useEffect(() => {
    cache.get(request.url, () => fetch(request))
         .then(response => {
           setResponse(response);
           setIsLoading(false);
         });
  }, [ request ]);

  return [ response, isLoading ];
};

export default useFetch;
