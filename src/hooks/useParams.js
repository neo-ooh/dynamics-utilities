import React   from 'react';
import DynamicContext from '../components/DynamicContext';

const useParams = () => {
  const { params } = React.useContext(DynamicContext);

  return params;
};

export default useParams;
