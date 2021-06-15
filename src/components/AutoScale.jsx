import React          from 'react';
import DynamicContext from './DynamicContext';

const AutoScale = ({ children }) => {
  const { support } = React.useContext(DynamicContext);

  const style = React.useMemo(() => ({
    transform: `scale(${ support.scale })`,
  }), [support]);

  return (
    <div style={ style }>
      {  children }
    </div>
  );
};

export default AutoScale;
