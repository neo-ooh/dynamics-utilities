import React from 'react';

/**
 *
 * @type {React.Context<{
 *   name: string,
 *   params: Record,
 *   cache: Cache,
 *   api: API,
 *   playerType: string,
 *   support: Record,
 *   context: Context,
 *   isLive: boolean
 * }>}
 */
const DynamicContext = React.createContext({});
export default DynamicContext;
