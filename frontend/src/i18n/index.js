import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

// Or create inline translations if files don't exist
const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "login": "Login",
      "register": "Register",
      "dashboard": "Dashboard",
      "marketplace": "Marketplace",
      "diagnose": "Diagnose",
      "profile": "Profile",
      "settings": "Settings",
      "logout": "Logout"
    }
  },
  hi: {
    translation: {
      "welcome": "स्वागत है",
      "login": "लॉगिन",
      "register": "रजिस्टर",
      "dashboard": "डैशबोर्ड",
      "marketplace": "मार्केटप्लेस",
      "diagnose": "निदान",
      "profile": "प्रोफाइल",
      "settings": "सेटिंग्स",
      "logout": "लॉगआउट"
    }
  },
  mr: {
    translation: {
      "welcome": "स्वागत आहे",
      "login": "लॉगिन",
      "register": "नोंदणी",
      "dashboard": "डॅशबोर्ड",
      "marketplace": "मार्केटप्लेस",
      "diagnose": "निदान",
      "profile": "प्रोफाइल",
      "settings": "सेटिंग्ज",
      "logout": "लॉगआउट"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;