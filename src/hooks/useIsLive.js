import React   from 'react';
import DynamicContext from '../components/DynamicContext';

/**
 * @return {[boolean, number]} An array with its first entry as a boolean telling if we are live on the first index, and the second entry as a js timestamp of the start of display, if applicable.
 * @constructor
 */
const UseIsLive = () => {
  const { isLive, liveStart } = React.useContext(DynamicContext);
  return [ isLive, liveStart ];
};

export default UseIsLive;
