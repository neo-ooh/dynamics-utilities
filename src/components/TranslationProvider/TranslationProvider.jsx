/*
 * Copyright 2020 (c) Neo-OOH - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Valentin Dufois <vdufois@neo-ooh.com>
 *
 * neo-access - TranslationProvider.jsx
 */

import { Settings as DateTimeSettings }    from 'luxon';
import React                               from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import SetTranslationsDefault              from 'src/components/TranslationProvider/SetTranslationsDefault';
import initI18n                            from './i18n';

/**
 * The Translation provider takes care of initializing the localization system (i18n) and load locales
 * @returns {*}
 * @constructor
 */
const TranslationProvider = ({ children, locales }) => {
  const i18n = React.useMemo(() => initI18n(locales), [locales])

  return (
    <I18nextProvider i18n={ i18n }>
      <SetTranslationsDefault />
      { children }
    </I18nextProvider>
  );
};

export default TranslationProvider;
