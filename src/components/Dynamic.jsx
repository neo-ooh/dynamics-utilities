import queryString         from 'query-string';
import React               from 'react';
import API                 from '../library/API';
import Cache               from '../library/Cache';
import Context             from '../library/Context';
import AutoScale           from './AutoScale';
import DynamicContext      from './DynamicContext';
import LoggingProvider     from './LoggingProvider';
import PlayStartListener   from './PlayStartListener';
import TranslationProvider from './TranslationProvider';


const Dynamic = ({ env, name, version, apiUrl, children, defaultSupport = null, locales = {} }) => {
  // Collect all information needed for the dynamic
  const [ isLive, setIsLive ]       = React.useState(false);
  const [ liveStart, setLiveStart ] = React.useState(false);
  const handleOnDisplay             = React.useCallback((start) => {
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
    support   : context.getSupport('HD'),
    context,
  }), [ params, isLive ]);

  return (
    <DynamicContext.Provider value={ ctx }>
      <LoggingProvider appName={ ctx.name } env={ env } version={ version }>
        <TranslationProvider locales={ locales }>
          <AutoScale>
            { children }
          </AutoScale>
        </TranslationProvider>
        <PlayStartListener onDisplayStart={ handleOnDisplay }/>
      </LoggingProvider>
    </DynamicContext.Provider>
  );
};

export default Dynamic;
