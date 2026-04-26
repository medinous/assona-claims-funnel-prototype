#!/usr/bin/env node
/**
 * Assona Token Fixer
 *
 * Replaces hardcoded design values in component CSS files with tokens
 * from styles/tokens.css. Handles multi-value shorthand, neutralises
 * function-call arguments (var/calc/rgba/etc.) so fallbacks are never
 * mangled, and skips @font-face blocks for font-weight.
 *
 * Usage:
 *   node scripts/token-fix.js              — apply fixes in-place
 *   node scripts/token-fix.js --dry-run    — preview without writing
 *
 * Run token-audit.js after to confirm zero errors.
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT    = path.resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

/* ── Files to process ───────────────────────────────────────── */
const CSS_FILES = [
  'styles/base.css',
  'styles/claims.css',
  'styles/damage.css',
  'styles/dashboard.css',
  'styles/guard.css',
  'styles/login.css',
  'styles/review.css',
  'styles/sidepanel.css',
  'styles/upload.css',
  'styles/validation.css',
];

/* ── Token maps ─────────────────────────────────────────────── */

const FONT_SIZE_MAP = {
  '7px':     'var(--text-tiny)',
  '8px':     'var(--text-tiny)',
  '10px':    'var(--text-micro)',
  '11px':    'var(--text-2xs)',
  '12px':    'var(--text-xs)',
  '12.25px': 'var(--text-xs)',       /* Figma sub-pixel — round to xs */
  '13px':    'var(--text-crumb)',
  '14px':    'var(--text-sm)',
  '15px':    'var(--text-sm)',       /* Figma sub-scale — round to sm */
  '16px':    'var(--text-md)',
  '18px':    'var(--text-lg)',
  '22px':    'var(--text-xl-compact)',
  '24px':    'var(--text-xl)',
  '26px':    'var(--text-display-sm)',
  '32px':    'var(--text-2xl)',
  '40px':    'var(--text-3xl)',
};

const FONT_WEIGHT_MAP = {
  '200': 'var(--fw-light)',
  '400': 'var(--fw-regular)',
  '500': 'var(--fw-medium)',
  '600': 'var(--fw-semibold)',
  '700': 'var(--fw-bold)',
  '800': 'var(--fw-extrabold)',
};

/* Only the values in the standard spacing scale get replaced. */
const SPACING_MAP = {
  '4px':  'var(--space-1)',
  '8px':  'var(--space-2)',
  '12px': 'var(--space-3)',
  '16px': 'var(--space-4)',
  '20px': 'var(--space-5)',
  '24px': 'var(--space-6)',
  '28px': 'var(--space-7)',
  '32px': 'var(--space-8)',
  '40px': 'var(--space-10)',
  '48px': 'var(--space-12)',
  '56px': 'var(--space-14)',
  '64px': 'var(--space-16)',
  '80px': 'var(--space-20)',
  '96px': 'var(--space-24)',
};

const RADIUS_MAP = {
  '2px':    'var(--radius-2xs)',
  '3px':    'var(--radius-2xs)',
  '4px':    'var(--radius-xs)',
  '6.75px': 'var(--radius-sm)',      /* Figma sub-pixel — round to sm */
  '6px':   'var(--radius-sm)',
  '8px':   'var(--radius-md)',
  '10px':  'var(--radius-card)',
  '14px':  'var(--radius-lg)',
  '16px':  'var(--radius-dialog)',
  '20px':  'var(--radius-xl)',
  '24px':  'var(--radius-2xl)',
  '50px':  'var(--radius-circle)',
  '100px': 'var(--radius-full)',
  '999px': 'var(--radius-full)',
};

const Z_MAP = {
  '0':     'var(--z-ground)',
  '1':     'var(--z-base)',
  '2':     'var(--z-raised)',
  '20':    'var(--z-topbar)',
  '40':    'var(--z-sidepanel-overlay)',
  '50':    'var(--z-sidepanel)',
  '100':   'var(--z-review-overlay)',
  '120':   'var(--z-confirm)',
  '999':   'var(--z-proto-nav)',
  '9999':  'var(--z-dropdown)',
  '99999': 'var(--z-guard)',
};

/* Exact transition value → composed token */
const TRANSITION_EXACT = {
  'background 0.15s, color 0.15s':           'var(--transition-color)',
  'background 0.15s ease, color 0.15s ease': 'var(--transition-color)',
  'color 0.15s, background 0.15s':           'var(--transition-color)',
  'all 0.15s':                               'var(--transition-all-fast)',
  'all 0.15s ease':                          'var(--transition-all-fast)',
  'all 0.2s':                                'var(--transition-all-normal)',
  'all 0.2s ease':                           'var(--transition-all-normal)',
  /* view transition (login screens) */
  'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)':
    'var(--transition-view)',
};

/* Inline color literals that may appear standalone (not in var() fallbacks) */
const STANDALONE_COLOR_MAP = {
  '#d6d9c0': 'var(--color-sage-300)',
  '#ffffff':  'var(--color-neutral-0)',
  '#fff':     'var(--color-neutral-0)',
};

/*
 * Hex colors that may appear embedded inside multi-part property values
 * (e.g. box-shadow: 0 0 0 3px #f8fcdb). Applied via regex substitution
 * after neutralisation so var() fallbacks are never touched.
 */
const EMBEDDED_COLOR_MAP = {
  '#f8fcdb': 'var(--color-accent-100)',
  '#7a827a': 'var(--color-neutral-600)',
  '#1e40af': 'var(--text-info)',
  '#dbeafe': 'var(--status-info-bg)',
  '#dc2626': 'var(--text-cancel)',
  '#fecaca': 'var(--border-cancel)',
  '#d6d9c0': 'var(--color-sage-300)',
  '#ffffff':  'var(--color-neutral-0)',
  '#fff':     'var(--color-neutral-0)',
};

/* Properties where embedded-color replacement is applied */
const EMBEDDED_COLOR_PROPS = new Set([
  'box-shadow', 'text-shadow', 'color', 'background', 'background-color',
  'border-color', 'border', 'outline', 'fill', 'stroke',
]);

/* ── Paren neutraliser ──────────────────────────────────────── */

/**
 * Walk `str` and replace each balanced function-call expression
 * (var(...), calc(...), rgba(...), cubic-bezier(...), etc.) with a
 * numbered placeholder \x00PHn\x00. Returns the neutralised string
 * and a restore function.
 */
function neutralise(str) {
  const saved = [];
  let out = '';
  let depth = 0;
  let buf = '';
  let inExpr = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (ch === '(' && !inExpr) {
      /* capture preceding word chars as the function name */
      const fn = out.match(/([\w-]+)$/);
      if (fn) out = out.slice(0, -fn[0].length);
      buf = (fn ? fn[0] : '') + '(';
      inExpr = true;
      depth = 1;
    } else if (ch === '(' && inExpr) {
      buf += '('; depth++;
    } else if (ch === ')' && inExpr) {
      buf += ')'; depth--;
      if (depth === 0) {
        saved.push(buf);
        out += `\x00PH${saved.length - 1}\x00`;
        buf = ''; inExpr = false;
      }
    } else if (inExpr) {
      buf += ch;
    } else {
      out += ch;
    }
  }

  if (inExpr) out += buf; /* unclosed paren — restore as-is */

  const restore = (s) =>
    s.replace(/\x00PH(\d+)\x00/g, (_, i) => saved[+i]);

  return { text: out, restore };
}

/* ── Per-property replacement helpers ──────────────────────── */

const PX_RE = /\b(\d+(?:\.\d+)?)px\b/g;

function applySpacing(val) {
  return val.replace(PX_RE, (m) => SPACING_MAP[m] ?? m);
}

function applyRadius(val) {
  return val.replace(PX_RE, (m) => RADIUS_MAP[m] ?? m);
}

function applyFontSize(val) {
  return val.replace(PX_RE, (m) => FONT_SIZE_MAP[m] ?? m);
}

function applyFontWeight(val) {
  /* strip !important temporarily */
  const imp = /\s*!important/.exec(val);
  const suffix = imp ? imp[0] : '';
  const core = val.slice(0, val.length - suffix.length).trim();
  if (/^\d+$/.test(core) && FONT_WEIGHT_MAP[core]) {
    return FONT_WEIGHT_MAP[core] + suffix;
  }
  return val;
}

function applyZIndex(val) {
  const t = val.trim();
  return Z_MAP[t] ? Z_MAP[t] : val;
}

function applyTransition(val) {
  /* 1. Try exact composed-token match */
  const trimmed = val.trim();
  if (TRANSITION_EXACT[trimmed]) return TRANSITION_EXACT[trimmed];

  /* 2. Partial: replace raw duration literals */
  return val
    .replace(/\b0\.15s\b/g, 'var(--duration-fast)')
    .replace(/\b0\.18s\b/g, 'var(--duration-fast)')
    .replace(/\b0\.2s\b/g,  'var(--duration-normal)')
    .replace(/\b0\.25s\b/g, 'var(--duration-normal)')
    .replace(/\b0\.3s\b/g,  'var(--duration-slow)')
    .replace(/\b0\.35s\b/g, 'var(--duration-slow)');
}

function applyStandaloneColor(val) {
  const t = val.trim().toLowerCase();
  return STANDALONE_COLOR_MAP[t] ?? val;
}

/* ── Spacing property set ───────────────────────────────────── */
const SPACING_PROPS = new Set([
  'padding', 'margin', 'gap', 'row-gap', 'column-gap',
  'top', 'right', 'bottom', 'left', 'inset',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-block', 'padding-inline', 'margin-block', 'margin-inline',
]);


/* ── Line processor ─────────────────────────────────────────── */

function processLine(raw, inFontFace) {
  /* Blank / comment lines */
  if (/^\s*$/.test(raw))                       return raw;
  if (/^\s*(\/\*|\*(?!\/)|\/\/)/.test(raw))    return raw;
  /* Lines with braces are selectors / at-rule boundaries */
  if (/[{}]/.test(raw))                        return raw;
  /* @rules */
  if (/^\s*@/.test(raw))                       return raw;

  /* Match: indent  property  :  value  [semicolon+comment]
     Allow for single-line rules that slip through: only process
     if the line starts with optional whitespace + a CSS property name */
  const m = raw.match(/^(\s*)([\w-]+)(\s*:\s*)(.+?)(\s*;[^;]*)?\s*$/);
  if (!m) return raw;

  const [, indent, prop, colon, rawVal, semi = ''] = m;
  const p = prop.toLowerCase();

  /* Never tokenise font-weight inside @font-face */
  if (inFontFace && p === 'font-weight') return raw;

  /* Neutralise function-call arguments */
  const { text: neutral, restore } = neutralise(rawVal);

  let newVal = neutral;

  if (p === 'font-size') {
    newVal = applyFontSize(neutral);
  } else if (p === 'font-weight') {
    newVal = applyFontWeight(neutral);
  } else if (p === 'border-radius') {
    /* Only apply if there are raw px values left after neutralisation */
    if (/\b\d+(?:\.\d+)?px\b/.test(neutral)) newVal = applyRadius(neutral);
  } else if (SPACING_PROPS.has(p)) {
    if (/\b\d+(?:\.\d+)?px\b/.test(neutral)) newVal = applySpacing(neutral);
  } else if (p === 'z-index') {
    newVal = applyZIndex(neutral);
  } else if (p === 'transition') {
    /* Only transform if value contains raw s durations */
    if (/\b\d+(?:\.\d+)?s\b/.test(neutral)) newVal = applyTransition(neutral);
  } else if (EMBEDDED_COLOR_PROPS.has(p)) {
    /* Try exact standalone match first, then embedded replacement */
    const exact = applyStandaloneColor(neutral);
    if (exact !== neutral) {
      newVal = exact;
    } else {
      /* Replace known hex colors anywhere within the (neutralised) value */
      newVal = neutral;
      for (const [hex, token] of Object.entries(EMBEDDED_COLOR_MAP)) {
        const re = new RegExp(hex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        newVal = newVal.replace(re, token);
      }
    }
  }

  if (newVal === neutral) return raw; /* no change */

  const finalVal = restore(newVal);
  return `${indent}${prop}${colon}${finalVal}${semi}`;
}

/* ── File processor ─────────────────────────────────────────── */

function processFile(relPath) {
  const filePath = path.join(ROOT, relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠  ${relPath} — not found, skipping`);
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const lines    = original.split('\n');

  let changes  = 0;
  let inFontFace = false;
  let braceDepth = 0;

  const result = lines.map((line) => {
    /* Track @font-face blocks */
    if (/@font-face\b/.test(line)) {
      inFontFace = true;
      braceDepth = 0;
    }
    if (inFontFace) {
      braceDepth += (line.match(/{/g) || []).length;
      braceDepth -= (line.match(/}/g) || []).length;
      if (braceDepth <= 0 && /}/.test(line)) inFontFace = false;
    }

    const newLine = processLine(line, inFontFace);
    if (newLine !== line) changes++;
    return newLine;
  });

  if (changes === 0) {
    console.log(`  ✓  ${relPath} — already clean`);
    return;
  }

  const output = result.join('\n');
  if (!DRY_RUN) fs.writeFileSync(filePath, output, 'utf8');

  const verb = DRY_RUN ? '[dry]' : '✍ ';
  console.log(`  ${verb} ${relPath} — ${changes} line(s) updated`);
}

/* ── Main ────────────────────────────────────────────────────── */

console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   Assona Token Fixer                         ║');
if (DRY_RUN) {
  console.log('║   DRY RUN — no files will be written         ║');
}
console.log('╚══════════════════════════════════════════════╝');
console.log('');

for (const file of CSS_FILES) processFile(file);

console.log('');
console.log('Done. Run:  node scripts/token-audit.js');
console.log('');
