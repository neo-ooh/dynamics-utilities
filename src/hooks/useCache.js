import React   from 'react';
import DynamicContext from '../components/DynamicContext';

/**
 * @return {Cache}
 * @constructor
 */
const UseCache = () => {
  const { cache } = React.useContext(DynamicContext);

  return cache;
};

export default UseCache;
