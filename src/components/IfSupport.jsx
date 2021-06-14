import React from 'react';
import { ctx } from './Dynamic'

const IfSupport = ({ name, children}) => {

  const { support } = React.useContext(ctx)

  if(support?.name !== name) {
    return null
  }

  return children;
};

export default IfSupport;
