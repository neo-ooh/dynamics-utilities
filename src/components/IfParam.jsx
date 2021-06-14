import React          from 'react';
import useParams      from '../hooks/useParams';
import DynamicContext from './DynamicContext';

/**
 * Only render the passed children if a parameter with the specified name and value exists.
 * @param {string} name
 * @param {string|number} value
 * @param {React.Children} children
 * @return {null|React.Children}
 * @constructor
 */
const IfParam = ({ name, value, children }) => {
  const params = useParams()

  if (!(name in params) || params[name] !== value) {
    return null;
  }

  return children;
};

export default IfParam;
