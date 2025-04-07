import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import ua from './ua.json';
import pl from './pl.json';
import de from './de.json';
import es from './es.json';
import fr from './fr.json';
import it from './it.json';
import pt from './pt.json';
import tr from './tr.json';
import zh from './zh.json';
import ja from './ja.json';
import ko from './ko.json';
import sv from './sv.json';
import ar from './ar.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng:
      Localization.locale.startsWith('uk') ? 'ua' :
      Localization.locale.startsWith('pl') ? 'pl' :
      Localization.locale.startsWith('de') ? 'de' :
      Localization.locale.startsWith('es') ? 'es' :
      Localization.locale.startsWith('fr') ? 'fr' :
      Localization.locale.startsWith('it') ? 'it' :
      Localization.locale.startsWith('pt') ? 'pt' :
      Localization.locale.startsWith('tr') ? 'tr' :
      Localization.locale.startsWith('zh') ? 'zh' :
      Localization.locale.startsWith('ja') ? 'ja' :
      Localization.locale.startsWith('ko') ? 'ko' :
      Localization.locale.startsWith('sv') ? 'sv' :
      Localization.locale.startsWith('ar') ? 'ar' :
      'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ua: { translation: ua },
      pl: { translation: pl },
      de: { translation: de },
      es: { translation: es },
      fr: { translation: fr },
      it: { translation: it },
      pt: { translation: pt },
      tr: { translation: tr },
      zh: { translation: zh },
      ja: { translation: ja },
      ko: { translation: ko },
      sv: { translation: sv },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
