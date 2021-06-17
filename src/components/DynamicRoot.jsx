import React          from 'react';
import DynamicContext from './DynamicContext';

const DynamicRoot = ({ children }) => {
  const { support } = React.useContext(DynamicContext);

  const style = React.useMemo(() => ({
    display        : 'block',
    position       : 'absolute',
    top            : 0,
    left          : 0,
    width          : support.width,
    height         : support.height,
    transform      : `scale(${ support.scale })`,
    transformOrigin: 'top left',
  }), [ support ]);

  return (
    <main id="dynamic-root" style={ style }>
      { children }
    </main>
  );
};

export default DynamicRoot;
