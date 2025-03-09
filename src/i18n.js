import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// تحميل ملفات الترجمة يدويًا
import translationEN from './locales/en/translation.json';
import translationAR from './locales/ar/translation.json';

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
};

i18n
  .use(initReactI18next) // ربط i18n مع React
  .init({
    resources,
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'ar', // اللغة الاحتياطية إذا لم يتم العثور على الترجمة
    interpolation: { escapeValue: false },
  });

// تغيير اتجاه الصفحة عند تغيير اللغة
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
