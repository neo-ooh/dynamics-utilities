import TranslationProvider from './TranslationProvider';
import queryString         from 'query-string';
import React               from 'react';
import API                 from '../library/API';
import Cache               from '../library/Cache';
import Context             from '../library/Context';
import DynamicContext      from './DynamicContext';
import LoggingProvider     from './LoggingProvider';
import PlayStartListener   from './PlayStartListener';


const Dynamic = ({ name, apiUrl, children, defaultSupport = null, locales = {} }) => {
  // Collect all information needed for the dynamic
  const [ isLive, setIsLive ] = React.useState(false);
  const [ liveStart, setLiveStart ] = React.useState(false);
  const handleOnDisplay       = React.useCallback((start) => {
    setIsLive(true);
    setLiveStart(start);
  }, []);

  const context = React.useMemo(() => new Context(), []);

  const params = React.useMemo(() => {
    return queryString.parse(location.search);
  }, [ location.search ]);

  const cache = React.useMemo(() => new Cache(`${ name }-dynamic`), [ name ]);

  const api = React.useMemo(() => {
    if (!apiUrl || !('key' in params)) {
      return null;
    }

    return new API(apiUrl, params.key);
  }, [ params, apiUrl ]);


  // Build the context
  const ctx = React.useMemo(() => ({
    name      : `${ name }-dynamic`,
    params,
    cache,
    api,
    isLive,
    liveStart,
    playerType: context.getPlayer(),
    support   : context.getSupport(params.support || params.design),
    context,
  }), [ params, isLive ]);

  return (
    <DynamicContext.Provider value={ ctx }>
      <LoggingProvider appName={ ctx.name }>
        <TranslationProvider locales={ locales }>
          { children }
        </TranslationProvider>
        <PlayStartListener onDisplayStart={ handleOnDisplay }/>
      </LoggingProvider>
    </DynamicContext.Provider>
  );
};

export default Dynamic;
