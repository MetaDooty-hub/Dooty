import { useState, useEffect } from 'react';
import translations from './translations';

const SUPPORTED = ['en', 'pt', 'es', 'zh', 'ar'];

function detectLanguage() {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('md_lang');
  if (saved && SUPPORTED.includes(saved)) return saved;
  const browser = navigator.language?.slice(0, 2).toLowerCase();
  if (SUPPORTED.includes(browser)) return browser;
  return 'en';
}

export function useLanguage() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setLang(detectLanguage());
  }, []);

  function setLanguage(code) {
    if (!SUPPORTED.includes(code)) return;
    localStorage.setItem('md_lang', code);
    setLang(code);
  }

  function t(key) {
    return translations[lang]?.[key] || translations['en'][key] || key;
  }

  return { lang, setLanguage, t, SUPPORTED };
}