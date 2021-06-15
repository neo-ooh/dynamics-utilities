import React          from 'react';
import DynamicContext from './DynamicContext';

const AutoScale = ({ children }) => {
  const { support } = React.useContext(DynamicContext);

  const style = React.useMemo(() => ({
    transform: `scale(${ support.scale })`,
    width: support.width,
    height: support.height,
  }), [support]);

  return (
    <div id="dynamic-root" style={ style }>
      {  children }
    </div>
  );
};

export default AutoScale;
