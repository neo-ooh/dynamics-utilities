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
import SetTranslationsDefault              from './SetTranslationsDefault';
import './i18n';

/**
 * The Translation provider takes care of initializing the localization system (i18n) and load locales
 * @returns {*}
 * @constructor
 */
const TranslationProvider = ({ children, locales }) => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    for(const locale in locales) {
      for(const namespace in locales[locale]) {
        i18n.addResources(locale, namespace, locales[locale][namespace])
      }
    }
  }, [i18n, locales])

  React.useEffect(() => {
    DateTimeSettings.defaultLocale = i18n.language;
  }, [ i18n.language ]);

  return (
    <I18nextProvider i18n={ i18n }>
      <SetTranslationsDefault />
      { children }
    </I18nextProvider>
  );
};

export default TranslationProvider;
