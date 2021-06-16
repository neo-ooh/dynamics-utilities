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
    const fetchCache = async () => {
      const response = await cache.get(request);

      if(!response) {
        setResponse(null);
        setIsLoading(false);
      }

      const body     = await response.json();

      setResponse(body.content);
      setIsLoading(false);
    };

    fetchCache();
  }, [ request ]);

  return [ response, isLoading ];
};

export default useFetch;
