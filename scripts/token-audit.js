#!/usr/bin/env node
/**
 * Assona Token Audit Script
 *
 * Scans all CSS files for hardcoded visual values that should reference
 * a design token from styles/tokens.css or assona-design-tokens.css.
 *
 * Usage:
 *   node scripts/token-audit.js
 *   node scripts/token-audit.js --fix-suggestions   (prints suggested replacements)
 *
 * Exit codes:
 *   0 — no errors (warnings may still be printed)
 *   1 — one or more errors found
 *
 * Severity:
 *   ERROR   — hardcoded colors and standard spacing that must be tokenized
 *   WARNING — raw durations, uncommon spacing, opacity values
 */

'use strict';

const fs   = require('fs');
const path = require('path');

/* ── Config ─────────────────────────────────────────────────────── */

const ROOT = path.resolve(__dirname, '..');

/** CSS files to audit (relative to ROOT) */
const CSS_DIRS = ['styles'];

/** Files to skip (token definitions themselves) */
const SKIP_FILES = new Set([
  'styles/tokens.css',
  'styles/tokens-bridge.css',
  'resources/Tailwind config/assona-design-tokens.css',
]);

/* ── Token suggestion map ────────────────────────────────────────
   Maps raw value patterns to their recommended token.
   Keys are lowercased for matching. */
const COLOR_MAP = {
  '#ffffff':                  'var(--color-neutral-0)',
  '#fff':                     'var(--color-neutral-0)',
  '#0d0f0d':                  'var(--color-neutral-1000)',
  '#282b28':                  'var(--color-neutral-900)',
  '#3f443f':                  'var(--color-neutral-800)',
  '#5c635c':                  'var(--color-neutral-700)',
  '#7a827a':                  'var(--color-neutral-600)',
  '#9ba29b':                  'var(--color-neutral-500)',
  '#b8bfb8':                  'var(--color-neutral-400)',
  '#d4d9d4':                  'var(--color-neutral-300)',
  '#e8ebe8':                  'var(--color-neutral-200)',
  '#f4f6f4':                  'var(--color-neutral-100)',
  '#fafbfa':                  'var(--color-neutral-50)',
  '#eaf68f':                  'var(--color-accent-300)',
  '#e4ec84':                  'var(--color-accent-400)',
  '#d8e554':                  'var(--color-accent-500)',
  '#f8fcdb':                  'var(--color-accent-100)',
  '#f1f9b8':                  'var(--color-accent-200)',
  '#fafbf7':                  'var(--color-sage-50)',
  '#f5f7ed':                  'var(--color-sage-100)',
  '#eaeed9':                  'var(--color-sage-200)',
  '#c73715':                  'var(--color-error-700)',
  '#e64e2e':                  'var(--color-error-600)',
  '#ee735d':                  'var(--color-error-500)',
  '#144f56':                  'var(--color-primary-600)',
  '#2896aa':                  'var(--color-primary-500)',
  '#4db5c4':                  'var(--color-primary-400)',
  '#dbeafe':                  'var(--status-info-bg)',
  '#1e40af':                  'var(--text-info)',
  '#fecaca':                  'var(--border-cancel)',
  '#dc2626':                  'var(--text-cancel)',
  '#686868':                  'var(--text-muted)',
  '#d6d9c0':                  'var(--color-sage-300)',
  '#fff7ed':                  'var(--color-warning-50)',
  '#d97706':                  'var(--color-warning-600)',
  '#ea580c':                  'var(--color-error-600)',
  /* Guard fallbacks */
  '#111':                     'var(--color-neutral-1000)',
  '#666':                     'var(--color-neutral-600)',
  '#d1d5db':                  'var(--color-neutral-300)',
  '#f9fafb':                  'var(--color-neutral-50)',
  '#e53e3e':                  'var(--color-error-600)',
};

const RGBA_MAP = {
  'rgba(5, 8, 16, 0.1)':      'var(--stroke-ui)',
  'rgba(5, 8, 16, 0.2)':      'var(--stroke-ui-medium)',
  'rgba(5, 8, 16, 0.08)':     'var(--stroke-ui-subtle)',
  'rgba(5, 8, 16, 0.06)':     'var(--stroke-ui-micro)',
  'rgba(5, 8, 16, 0.03)':     'var(--stroke-ui-ghost)',
  'rgba(13, 15, 13, 0.5)':    'var(--overlay-page)',
  'rgba(13, 15, 13, 0.28)':   'var(--overlay-confirm)',
  'rgba(13, 15, 13, 0.88)':   'var(--overlay-dark)',
  'rgba(63, 63, 70, 0.2)':    'var(--overlay-modal)',
  'rgba(10, 10, 10, 0.72)':   'var(--overlay-guard)',
  'rgba(0, 0, 0, 0.1)':       'var(--stroke-ui)',
  'rgba(0, 0, 0, 0.2)':       'var(--stroke-ui-medium)',
  'rgba(0, 0, 0, 0.08)':      'var(--stroke-ui-subtle)',
  'rgba(234, 246, 143, 0.65)': 'var(--grad-lime)',
  'rgba(234, 246, 143, 0.6)': 'var(--grad-lime)',
  'rgba(234, 246, 143, 0.35)': 'var(--grad-lime-soft)',
  'rgba(144, 214, 218, 0.55)': 'var(--grad-petrol)',
  'rgba(144, 214, 218, 0.5)': 'var(--grad-petrol)',
  'rgba(144, 214, 218, 0.25)': 'var(--grad-petrol-soft)',
  'rgba(255, 255, 255, 0.1)': 'var(--on-dark-border)',
  'rgba(255, 255, 255, 0.35)': 'var(--text-on-dark-muted)',
  'rgba(255, 255, 255, 0.5)': 'var(--text-on-dark)',
  'rgba(255, 255, 255, 0.6)': 'var(--text-on-dark-secondary)',
  'rgba(77, 181, 196, 0.04)': 'var(--surface-drag)',
};

/** Standard spacing values (px) that MUST use tokens. */
const STANDARD_SPACING_PX = new Set([4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96]);
const SPACING_TOKEN_MAP = {
  4:  '--space-1',  8:  '--space-2',  12: '--space-3',
  16: '--space-4',  20: '--space-5',  24: '--space-6',
  28: '--space-7',  32: '--space-8',  40: '--space-10',
  48: '--space-12', 56: '--space-14', 64: '--space-16',
  80: '--space-20', 96: '--space-24',
};

const RADIUS_TOKEN_MAP = {
  2:  '--radius-2xs', 3: '--radius-2xs',
  4:  '--radius-xs',  6: '--radius-sm',  8: '--radius-md',
  10: '--radius-card', 14: '--radius-lg', 16: '--radius-dialog',
  20: '--radius-xl',  24: '--radius-2xl',
  50: '--radius-circle', 100: '--radius-full',
  999: '--radius-full', 9999: '--radius-full',
};

/* ── Helpers ─────────────────────────────────────────────────────── */

function findCSSFiles(dir) {
  const results = [];
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (entry.name.endsWith('.css')) results.push(full);
    }
  }
  walk(path.join(ROOT, dir));
  return results;
}

function relPath(full) {
  return path.relative(ROOT, full).replace(/\\/g, '/');
}

function normalizeColor(v) {
  return v.replace(/\s+/g, ' ').toLowerCase().trim();
}

/* ── Balanced-paren stripper (removes var() fallback content) ────── */

/**
 * Strip all function-call arguments from a CSS value string.
 * e.g. "var(--token, #hex)" → "var()" — prevents false positives
 * where a hex in a var() fallback is flagged as a hardcoded colour.
 */
function stripFnArgs(str) {
  let out = '';
  let depth = 0;
  let collecting = false;
  let fnBuf = '';

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(') {
      if (depth === 0) {
        /* Include the function name that was already appended */
        out += '(';
        collecting = true;
      }
      depth++;
    } else if (ch === ')') {
      depth--;
      if (depth === 0) {
        out += ')';
        collecting = false;
      }
    } else if (depth === 0) {
      out += ch;
    }
    /* content inside parens is intentionally dropped */
  }
  return out;
}

/* ── Violation detection ─────────────────────────────────────────── */

function auditFile(filePath) {
  const rel  = relPath(filePath);
  if (SKIP_FILES.has(rel)) return [];

  const lines   = fs.readFileSync(filePath, 'utf8').split('\n');
  const issues  = [];

  const PROP_COLOR    = /^\s*(color|background(?:-color)?|border(?:-color|-top|-right|-bottom|-left|-block|-inline)?|outline(?:-color)?|fill|stroke|box-shadow|text-shadow|caret-color)\s*:/i;
  const PROP_RADIUS   = /^\s*border-radius\s*:/i;
  const PROP_SPACING  = /^\s*(padding|margin|gap|row-gap|column-gap|top|right|bottom|left|inset)\s*:/i;
  const PROP_FONT_SZ  = /^\s*font-size\s*:/i;
  const PROP_FONT_WT  = /^\s*font-weight\s*:/i;
  const PROP_Z        = /^\s*z-index\s*:/i;
  const PROP_TRANS    = /^\s*transition\s*:/i;

  const HEX_RE   = /#([0-9a-fA-F]{3,8})\b/g;
  const RGBA_RE  = /rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*[\d.]+)?\s*\)/g;
  const PX_RE    = /([\d.]+)px/g;
  const VAR_RE   = /var\(/;

  /* Track @font-face blocks — font-weight inside them is not a violation */
  let inFontFace = false;
  let braceDepth = 0;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    /* Maintain @font-face context */
    if (/@font-face\b/.test(line)) { inFontFace = true; braceDepth = 0; }
    if (inFontFace) {
      braceDepth += (line.match(/{/g) || []).length;
      braceDepth -= (line.match(/}/g) || []).length;
      if (braceDepth <= 0 && /}/.test(line)) inFontFace = false;
    }

    /* Skip comment lines */
    if (/^\s*\/\*/.test(line) || /^\s*\*/.test(line)) return;

    /*
     * Produce a "clean" copy of the line with all function-call arguments
     * removed AND inline CSS comments stripped. This eliminates two
     * categories of false positives:
     *   • var() fallbacks: var(--color-sage-50, #fafbf7) → var()
     *   • annotation comments: font-size: var(--text-lg); /* 18px * /
     * so that raw values hidden inside those constructs are invisible to
     * the scanners below.
     */
    const cleanLine = stripFnArgs(line).replace(/\/\*[\s\S]*?\*\//g, '');

    /* Re-check: skip if clean version has no raw values to report */
    const cleanHasHex  = HEX_RE.test(cleanLine);
    const cleanHasRgba = RGBA_RE.test(cleanLine);
    HEX_RE.lastIndex = 0; RGBA_RE.lastIndex = 0;

    /* ── Colors ── */
    if (PROP_COLOR.test(cleanLine) || /box-shadow/.test(cleanLine)) {
      HEX_RE.lastIndex = 0;
      let m;
      while ((m = HEX_RE.exec(cleanLine)) !== null) {
        const raw  = m[0].toLowerCase();
        const sugg = COLOR_MAP[raw];
        issues.push({
          file: rel, line: lineNum, severity: 'ERROR',
          type: 'color',
          value: raw,
          suggestion: sugg || 'add to COLOR_MAP',
          text: line.trim(),
        });
      }

      RGBA_RE.lastIndex = 0;
      while ((m = RGBA_RE.exec(cleanLine)) !== null) {
        /* RGBA_RE matches balanced rgba(...) on cleanLine — but cleanLine
           has args stripped, so we won't see any. This branch remains for
           rgba() values written directly (not inside var()). */
        const raw  = normalizeColor(m[0]);
        const sugg = RGBA_MAP[raw];
        if (sugg) {
          issues.push({
            file: rel, line: lineNum, severity: 'ERROR',
            type: 'color-rgba',
            value: raw,
            suggestion: sugg,
            text: line.trim(),
          });
        } else {
          issues.push({
            file: rel, line: lineNum, severity: 'WARNING',
            type: 'color-rgba-unknown',
            value: raw,
            suggestion: 'create a named token in styles/tokens.css',
            text: line.trim(),
          });
        }
      }
    }

    /* ── Border radius — scan cleanLine (var-args stripped) ── */
    if (PROP_RADIUS.test(cleanLine) && /\d+px/.test(cleanLine)) {
      PX_RE.lastIndex = 0;
      let m;
      while ((m = PX_RE.exec(cleanLine)) !== null) {
        const px   = parseFloat(m[1]);
        const sugg = RADIUS_TOKEN_MAP[px];
        issues.push({
          file: rel, line: lineNum, severity: 'ERROR',
          type: 'radius',
          value: `${px}px`,
          suggestion: sugg ? `var(${sugg})` : 'add to RADIUS_TOKEN_MAP',
          text: line.trim(),
        });
      }
    }

    /* ── Font size — scan cleanLine ── */
    if (PROP_FONT_SZ.test(cleanLine) && /\d+px/.test(cleanLine)) {
      PX_RE.lastIndex = 0;
      let m;
      while ((m = PX_RE.exec(cleanLine)) !== null) {
        const px   = parseFloat(m[1]);
        const map  = {
          7:  '--text-tiny',  8: '--text-tiny',
          10: '--text-micro', 11: '--text-2xs', 12: '--text-xs',
          13: '--text-crumb', 14: '--text-sm',  15: '--text-sm',
          16: '--text-md',    18: '--text-lg',  22: '--text-xl-compact',
          24: '--text-xl',    26: '--text-display-sm',
          32: '--text-2xl',   40: '--text-3xl',
        };
        issues.push({
          file: rel, line: lineNum, severity: 'ERROR',
          type: 'font-size',
          value: `${px}px`,
          suggestion: map[px] ? `var(${map[px]})` : 'add off-scale size to tokens.css',
          text: line.trim(),
        });
      }
    }

    /* ── Font weight (skip inside @font-face) ── */
    if (!inFontFace && PROP_FONT_WT.test(cleanLine) && /\d+/.test(cleanLine)) {
      const wtMatch = cleanLine.match(/font-weight\s*:\s*(\d+)/);
      if (wtMatch) {
        const wt  = parseInt(wtMatch[1]);
        const map = { 200: '--fw-light', 400: '--fw-regular', 500: '--fw-medium',
                      600: '--fw-semibold', 700: '--fw-bold', 800: '--fw-extrabold' };
        issues.push({
          file: rel, line: lineNum, severity: 'ERROR',
          type: 'font-weight',
          value: `${wt}`,
          suggestion: map[wt] ? `var(${map[wt]})` : 'add weight to tokens.css',
          text: line.trim(),
        });
      }
    }

    /* ── Spacing (standard values only — scan cleanLine) ── */
    if (PROP_SPACING.test(cleanLine) && /\d+px/.test(cleanLine)) {
      PX_RE.lastIndex = 0;
      let m;
      while ((m = PX_RE.exec(cleanLine)) !== null) {
        const px = parseFloat(m[1]);
        if (px === 0) continue;
        if (STANDARD_SPACING_PX.has(px)) {
          const tok = SPACING_TOKEN_MAP[px];
          issues.push({
            file: rel, line: lineNum, severity: 'ERROR',
            type: 'spacing',
            value: `${px}px`,
            suggestion: tok ? `var(${tok})` : 'check token scale',
            text: line.trim(),
          });
        } else {
          issues.push({
            file: rel, line: lineNum, severity: 'WARNING',
            type: 'spacing-offscale',
            value: `${px}px`,
            suggestion: 'off-scale value — consider adding a token or rounding',
            text: line.trim(),
          });
        }
      }
    }

    /* ── Z-index ── */
    if (PROP_Z.test(cleanLine) && /\d+/.test(cleanLine)) {
      const zm = cleanLine.match(/z-index\s*:\s*(\d+)/);
      if (zm) {
        const zval = parseInt(zm[1]);
        const zmap = {
          0: '--z-ground', 1: '--z-base', 2: '--z-raised',
          20: '--z-topbar', 40: '--z-sidepanel-overlay', 50: '--z-sidepanel',
          100: '--z-review-overlay', 120: '--z-confirm', 999: '--z-proto-nav',
          9999: '--z-dropdown', 99999: '--z-guard',
        };
        issues.push({
          file: rel, line: lineNum, severity: 'ERROR',
          type: 'z-index',
          value: `${zval}`,
          suggestion: zmap[zval] ? `var(${zmap[zval]})` : 'add to z-index scale in tokens.css',
          text: line.trim(),
        });
      }
    }

    /* ── Transitions (warnings only — use cleanLine to skip var() args) ── */
    if (PROP_TRANS.test(cleanLine) && /\d+(\.\d+)?s/.test(cleanLine)) {
      const tm = cleanLine.match(/([\d.]+s)/g) || [];
      tm.forEach(t => {
        issues.push({
          file: rel, line: lineNum, severity: 'WARNING',
          type: 'transition-duration',
          value: t,
          suggestion: 'use var(--duration-fast/normal/slow) and var(--ease-*)',
          text: line.trim(),
        });
      });
    }
  });

  return issues;
}

/* ── Main ────────────────────────────────────────────────────────── */

function main() {
  const allFiles = CSS_DIRS.flatMap(findCSSFiles);
  const allIssues = allFiles.flatMap(auditFile);

  const errors   = allIssues.filter(i => i.severity === 'ERROR');
  const warnings = allIssues.filter(i => i.severity === 'WARNING');

  /* Group by file for readable output */
  const byFile = {};
  for (const issue of allIssues) {
    (byFile[issue.file] = byFile[issue.file] || []).push(issue);
  }

  /* Print results */
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     Assona Design System — Token Audit       ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  if (allIssues.length === 0) {
    console.log('✅  Zero violations found. Token system is clean.');
    process.exit(0);
  }

  /* Summary table by file */
  const fileCounts = Object.entries(byFile)
    .map(([file, issues]) => ({
      file,
      errors:   issues.filter(i => i.severity === 'ERROR').length,
      warnings: issues.filter(i => i.severity === 'WARNING').length,
    }))
    .sort((a, b) => (b.errors + b.warnings) - (a.errors + a.warnings));

  console.log('── Files ranked by violations ────────────────────');
  fileCounts.forEach(({ file, errors: e, warnings: w }) => {
    const bar = '█'.repeat(Math.min(Math.ceil((e + w) / 3), 20));
    console.log(`  ${bar.padEnd(22)}  ${String(e).padStart(3)} err  ${String(w).padStart(3)} warn  ${file}`);
  });
  console.log('');

  /* Detailed violations */
  for (const [file, issues] of Object.entries(byFile)) {
    const fileErrors = issues.filter(i => i.severity === 'ERROR').length;
    const fileWarns  = issues.filter(i => i.severity === 'WARNING').length;
    console.log(`── ${file}  (${fileErrors} errors, ${fileWarns} warnings) ──`);

    for (const issue of issues.sort((a, b) => a.line - b.line)) {
      const prefix = issue.severity === 'ERROR' ? '  ❌ ERROR  ' : '  ⚠️  WARN  ';
      console.log(`${prefix} line ${String(issue.line).padStart(4)}  [${issue.type.padEnd(18)}]  ${issue.value}`);
      console.log(`              ↳ use: ${issue.suggestion}`);
      console.log(`              code: ${issue.text}`);
    }
    console.log('');
  }

  /* Final summary */
  console.log('── Summary ───────────────────────────────────────');
  console.log(`  Total files scanned : ${allFiles.length - SKIP_FILES.size}`);
  console.log(`  Errors              : ${errors.length}   (must fix before commit)`);
  console.log(`  Warnings            : ${warnings.length}   (should fix, won't block CI)`);
  console.log('');

  if (errors.length > 0) {
    console.log('❌  Token audit FAILED — fix errors before committing.');
    process.exit(1);
  } else {
    console.log('⚠️   Token audit passed with warnings. Review above items.');
    process.exit(0);
  }
}

main();
