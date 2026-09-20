import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, TranslationDictionary } from './translations';
import { shieldDB } from '../storage/db';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  availableLanguages: { code: Language; name: string; nativeName: string; isReady: boolean }[];
}

const AVAILABLE_LANGUAGES: { code: Language; name: string; nativeName: string; isReady: boolean }[] = [
  { code: 'en', name: 'English', nativeName: 'English', isReady: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isReady: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isReady: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isReady: false },
  { code: 'kn', name: 'Kannada', nativeName: 'கன்னட / ಕನ್ನಡ', isReady: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'மலையாளம் / മലയാളം', isReady: false },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load persisted language from IndexedDB or localStorage
    async function loadLang() {
      try {
        const prefs = await shieldDB.getPreferences();
        if (prefs && prefs.language) {
          setLanguageState(prefs.language);
          return;
        }
      } catch (e) {
        // Fallback
      }
      const saved = localStorage.getItem('shieldher_lang') as Language;
      if (saved && translations[saved]) {
        setLanguageState(saved);
      }
    }
    loadLang();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('shieldher_lang', lang);
    try {
      const prefs = (await shieldDB.getPreferences()) || {
        language: lang,
        privacyMode: true,
        quickExitUrl: 'https://weather.com',
        theme: 'dark',
        localEncryptionEnabled: true,
        onboardingCompleted: true
      };
      prefs.language = lang;
      await shieldDB.savePreferences(prefs);
    } catch (e) {
      // Ignore fallback errors
    }
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages: AVAILABLE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
