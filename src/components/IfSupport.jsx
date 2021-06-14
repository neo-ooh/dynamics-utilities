import React from 'react';
import DynamicContext from './DynamicContext';

const IfSupport = ({ name, children}) => {

  const { support } = React.useContext(ctx)

  if(support?.name !== name) {
    return null
  }

  return children;
};

export default IfSupport;r
