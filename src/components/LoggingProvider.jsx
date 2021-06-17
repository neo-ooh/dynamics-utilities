import React from 'react';
import { init as initApm } from '@elastic/apm-rum';

/**
 * Set up the apm rum service for this app
 * @param appName
 * @param env
 * @param version
 * @param children
 * @return {*}
 * @constructor
 */
const LoggingProvider = ({ appName, env, version, children }) => {
  React.useEffect(() => {
    // Init APM for User Experience Tracking
    initApm({
      // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
      serviceName   : appName,
      // Set service version (required for sourcemap feature)
      serviceVersion: version,

      // Elastic server
      serverUrl       : 'https://metrics.neo-ooh.info/',
      verifyServerCert: false,

      environment: env,

      breakdownMetrics: true,
    });
  }, [appName])

  return children;
};

export default LoggingProvider;
