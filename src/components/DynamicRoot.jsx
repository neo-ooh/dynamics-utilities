import React          from 'react';
import DynamicContext from './DynamicContext';

const DynamicRoot = ({ children }) => {
  const { support } = React.useContext(DynamicContext);

  const style = React.useMemo(() => ({
    width          : support.width,
    height         : support.height,
    transform      : `scale(${ support.scale })`,
  }), [ support ]);

  return (
    <main id="dynamic-root" style={ style } className={ support.design }>
      { children }
    </main>
  );
};

export default DynamicRoot;
