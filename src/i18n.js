import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'fr',
        debug: false,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        detection: {
            order: ['localStorage', 'navigator', 'cookie', 'querystring'],
            caches: ['localStorage', 'cookie'],
        }
    });

i18n.on('languageChanged', (lng) => {
    if (typeof document !== 'undefined') {
        document.documentElement.lang = lng;
    }
});

export default i18n;
