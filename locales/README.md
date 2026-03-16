# Localization (DE / EN)

- **Default language:** German (`de`). English (`en`) is available via the login-page toggle.
- **Copy source:** [translations.csv](translations.csv) — can be imported into Google Sheets for team review. Columns: `key`, `de`, `en`, `context`, `status`.

## Workflow

1. **Edit copy:** Update `translations.csv` (or export from your Google Sheet and replace this file). Keep one row per key; use dot-notation keys (e.g. `auth.login.title`).
2. **Regenerate JSON and bundle:**  
   `node scripts/build-locales.js`  
   This updates `de.json`, `en.json`, and `bundle.js` (used by the app at runtime).
3. **App behaviour:** The app loads `locales/bundle.js` and uses the language stored in `localStorage` under `appLang` (`de` or `en`). The login page toggle switches the language and persists the choice.

## Adding a new string

1. Add a row to `translations.csv`: `key`, `de`, `en`, `context`, `status`.
2. Run `node scripts/build-locales.js`.
3. In HTML use `data-i18n="key"`, `data-i18n-placeholder="key"`, `data-i18n-aria-label="key"`, or `data-i18n-alt="key"`. In JS use `t('key')` or `t('key', { param: value })` for placeholders like `{param}`.
