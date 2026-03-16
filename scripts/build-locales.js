/**
 * Converts locales/translations.csv to locales/de.json and locales/en.json.
 * CSV columns: key, de, en, context, status
 * Keys use dot notation (e.g. auth.login.title) and are output as nested objects.
 *
 * Usage: node scripts/build-locales.js
 * Or: npm run build-translations (if script is added to package.json)
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'locales', 'translations.csv');
const LOCALES_DIR = path.join(__dirname, '..', 'locales');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === ',' && !inQuotes) || (c === '\n' && !inQuotes)) {
      result.push(current.trim());
      current = '';
      if (c === '\n') break;
    } else {
      current += c;
    }
  }
  if (current.length) result.push(current.trim());
  return result;
}

function setNested(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in o)) o[p] = {};
    o = o[p];
  }
  o[parts[parts.length - 1]] = value;
}

function buildFromCSV() {
  const csv = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = csv.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    console.warn('CSV has no data rows');
    return { de: {}, en: {} };
  }
  const header = parseCSVLine(lines[0]);
  const keyIdx = header.indexOf('key');
  const deIdx = header.indexOf('de');
  const enIdx = header.indexOf('en');
  if (keyIdx === -1 || deIdx === -1 || enIdx === -1) {
    throw new Error('CSV must have columns: key, de, en');
  }
  const de = {};
  const en = {};
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const key = row[keyIdx];
    const deVal = row[deIdx] ?? '';
    const enVal = row[enIdx] ?? '';
    if (key) {
      setNested(de, key, deVal);
      setNested(en, key, enVal);
    }
  }
  return { de, en };
}

function main() {
  const { de, en } = buildFromCSV();
  fs.writeFileSync(path.join(LOCALES_DIR, 'de.json'), JSON.stringify(de, null, 2), 'utf8');
  fs.writeFileSync(path.join(LOCALES_DIR, 'en.json'), JSON.stringify(en, null, 2), 'utf8');
  const bundle = 'window.__LOCALES__ = ' + JSON.stringify({ de, en }) + ';\n';
  fs.writeFileSync(path.join(LOCALES_DIR, 'bundle.js'), bundle, 'utf8');
  console.log('Generated locales/de.json, locales/en.json, and locales/bundle.js');
}

main();
