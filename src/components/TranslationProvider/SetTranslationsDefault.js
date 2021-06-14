import { Settings as DateTimeSettings } from 'luxon';
import React                            from 'react';
import { useTranslation }               from 'react-i18next';

const SetTranslationsDefault = () => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    DateTimeSettings.defaultLocale = i18n.language;
  }, [ i18n.language ]);

  return (
    <div>

    </div>
  );
};

export default SetTranslationsDefault;
