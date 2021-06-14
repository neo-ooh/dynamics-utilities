import React from 'react';

import DynamicContext from './DynamicContext';

const ContextValidator = ({ children, requiredParams = [] }) => {
  const ctx = React.useContext(DynamicContext);

  const paramsAreValid = React.useMemo(() => (
    requiredParams.every(p => p in ctx.params)
  ), [ requiredParams, ctx ]);

  if (paramsAreValid) {
    return children;
  }

  return (
    <div>
      Missing required parameters for { ctx.name } Dynamic:
      <ul>
        { requiredParams.filter(p => !(p in ctx.params)).map(p => (
          <li key={ p }>p</li>
        )) })) }
      </ul>
    </div>
  );
};

export default ContextValidator;
