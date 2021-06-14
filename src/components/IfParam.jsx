import React   from 'react';
import { ctx } from './Dynamic';

/**
 * Only render the passed children if a parameter with the specified name and value exists.
 * @param {string} name
 * @param {string|number} value
 * @param {React.Children} children
 * @return {null|React.Children}
 * @constructor
 */
const IfParam = ({ name, value, children }) => {
  const { params } = React.useContext(ctx);

  if (!params.hasOwnProperty(name) || params[name] !== value) {
    return null;
  }

  return children;
};

export default IfParam;
