import React   from 'react';
import DynamicContext from '../components/DynamicContext';

/**
 * @return {Cache}
 * @constructor
 */
const UseCache = () => {

  const { isLive } = React.useContext(DynamicContext);
  return isLive;
};

export default UseCache;
