/*
 * Copyright 2020 (c) Neo-OOH - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Valentin Dufois <vdufois@neo-ooh.com>
 *
 * neo-access - i18n.js
 */

import i18n                 from 'i18next';
import { initReactI18next } from 'react-i18next';

export default (locales) => {
  // Initialize i18n
  i18n
    // .use(Backend)
    .use(initReactI18next)
    .init({
      debug: true,

      fallbackLng  : 'en',
      supportedLngs: [ 'en', 'fr' ],
      resources    : locales,

      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },

      defaultNS : 'common',
      ns        : [ 'common' ],
      fallbackNS: 'common',

      react: {
        transSupportBasicHtmlNodes: true,
      },
    });
}
