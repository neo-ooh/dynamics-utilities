import React from 'react';
import { init as initApm } from '@elastic/apm-rum';

/**
 * Set up the apm rum service for this app
 * @param appName
 * @param children
 * @return {*}
 * @constructor
 */
const LoggingProvider = ({ appName, children }) => {
  React.useEffect(() => {
    // Init APM for User Experience Tracking
    initApm({
      // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
      serviceName   : appName,
      // Set service version (required for sourcemap feature)
      serviceVersion: process.env.REACT_APP_GIT_SHA,

      // Elastic server
      serverUrl       : 'https://metrics.neo-ooh.info/',
      verifyServerCert: false,

      environment: process.env.NODE_ENV,

      breakdownMetrics: true,
    });
  }, [appName])

  return children;
};

export default LoggingProvider;
