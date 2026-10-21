'use client';

/**
 * @file LanguageContext.jsx
 * @description Provides application-wide bilingual localization state ('ar' | 'en'),
 * automatic document direction (`rtl` / `ltr`) synchronization, persistent language
 * preference storage in `localStorage`, and a dot-notated translation lookup helper `t()`.
 */

// 1. React and Next.js core modules
import { createContext, useContext, useState, useEffect } from 'react';

// 3. Internal components, hooks, and utility functions
import { translations } from '@/utils/translations';

/**
 * React context holding the current language code, toggle handler, and translation function.
 * @type {import('react').Context<import('@/types/zaria').LanguageContextValue | undefined>}
 */
const LanguageContext = createContext(undefined);

/**
 * Wraps the application tree with localization state and DOM `lang`/`dir` synchronization.
 *
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - Descendant components consuming localization.
 * @returns {JSX.Element} The context provider element.
 */
export function LanguageProvider({ children }) {
  /** @type {[import('@/types/zaria').LanguageCode, import('react').Dispatch<import('react').SetStateAction<import('@/types/zaria').LanguageCode>>]} */
  const [language, setLanguage] = useState('ar');

  // Restore saved language preference from localStorage on initial client mount
  useEffect(() => {
    const savedLang = localStorage.getItem('zaria_lang');
    if (savedLang === 'ar' || savedLang === 'en') {
      setLanguage(savedLang);
    }
  }, []);

  // Synchronize HTML root `lang` and `dir` attributes whenever the active language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  /**
   * Toggles the active language between Arabic ('ar') and English ('en')
   * and persists the updated value in `localStorage`.
   */
  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('zaria_lang', newLang);
      return newLang;
    });
  };

  /**
   * Resolves a dot-notated translation key (e.g., `'hero.title_1'`) from the dictionary
   * for the currently active language. Falls back to returning the key string if not found.
   *
   * @template [T=string]
   * @param {string} key - Dot-separated path in the translations dictionary.
   * @returns {T} The localized string or nested translation object.
   */
  const t = (key) => {
    const keys = key.split('.');
    let result = translations[language];

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        return key; // Fallback to raw key if path does not exist
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook to access the localization context (`language`, `toggleLanguage`, and `t`).
 * Must be invoked within a component wrapped by `<LanguageProvider>`.
 *
 * @returns {import('@/types/zaria').LanguageContextValue} The active localization context value.
 * @throws {Error} When called outside of a `<LanguageProvider>`.
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
