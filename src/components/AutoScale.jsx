import React          from 'react';
import DynamicContext from './DynamicContext';

const AutoScale = ({ children }) => {
  const { support } = React.useContext(DynamicContext);

  const style = React.useMemo(() => ({
    display        : 'block',
    position       : 'absolute',
    top            : 0,
    right          : 0,
    width          : support.width,
    height         : support.height,
    transform      : `scale(${ support.scale })`,
    transformOrigin: 'top left',
  }), [ support ]);

  return (
    <div id="dynamic-root" style={ style }>
      { children }
    </div>
  );
};

export default AutoScale;
