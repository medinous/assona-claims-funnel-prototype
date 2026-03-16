/**
 * Minimal i18n for plain HTML/JS app.
 * Expects window.__LOCALES__ = { de: {...}, en: {...} } (from locales/bundle.js).
 * Language is persisted in localStorage under key "appLang". Default: de.
 */

const STORAGE_KEY = 'appLang';
const DEFAULT_LANG = 'de';

function getLocales() {
  return window.__LOCALES__ || { de: {}, en: {} };
}

export function getLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'de' || stored === 'en') return stored;
  } catch (_) {}
  return DEFAULT_LANG;
}

export function setLanguage(lang) {
  if (lang !== 'de' && lang !== 'en') return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
  applyToDOM();
}

function getByPath(obj, path) {
  if (!obj || !path) return '';
  const parts = String(path).split('.');
  let cur = obj;
  for (const p of parts) {
    cur = cur && cur[p];
  }
  return cur != null ? String(cur) : '';
}

/**
 * Translate key. Falls back to German if the key is missing in the current language.
 * @param {string} key - Dot path, e.g. "auth.login.title"
 * @param {Record<string, string|number>} [params] - Optional replacements, e.g. { email: "x@y.de", n: 2 }
 */
export function t(key, params) {
  const locales = getLocales();
  const lang = getLanguage();
  let s = getByPath(locales[lang], key) || getByPath(locales.de, key) || key;
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((k) => {
      s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), String(params[k]));
    });
  }
  return s;
}

/**
 * Update all elements with data-i18n, data-i18n-placeholder, data-i18n-title, data-i18n-aria-label.
 */
export function applyToDOM() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const val = t(key);
      if (el.getAttribute('data-i18n-html') !== null) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.title = t(key);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (key) el.setAttribute('aria-label', t(key));
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt');
    if (key) el.setAttribute('alt', t(key));
  });
}

/**
 * Call after DOM is ready and locale bundle is loaded. Applies translations to static HTML.
 */
export function init() {
  applyToDOM();
}
