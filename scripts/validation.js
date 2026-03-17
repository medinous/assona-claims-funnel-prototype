/**
 * Step 3 – Validate
 * Replicates index_03_validation.html: PDF left, right panel with alert, invoice details,
 * accordion items (cause, Bauteil, Type VR/HR when applicable), totals, footer.
 */

import { funnelState } from './state.js';
import {
  pdfZoomChange,
  pdfZoomApply,
  pdfNavPrev,
  pdfNavNext,
  showLoadedPdfInCurrentCard,
  getPdfDoc,
  getPdfExpandSvg,
  isMobileViewport,
} from './pdf-viewer.js';
import { t } from './i18n.js';

/* ─── Data ─── */
const ITEMS = [
  { name: 'KETTE CN-M6100 126 GLIED', gross: '59,44', net: '49,95', status: 'ok', cause: 'Fall/Sturz/Unfall ohne Beteiligung', bauteil: 'Kette', type: null, qty: 1, causes: ['Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'KETTE CN-M8100 126 GLIEDER HG 12-FACH M. QUICK-LINK', gross: '72,40', net: '60,84', status: 'warn', cause: '', bauteil: 'Bremse', type: null, qty: 1, causes: ['Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: ['bauteil'] },
  { name: 'Kassette SLX CS-M7100', gross: '154,64', net: '129,95', status: 'ok', cause: 'Fall/Sturz/Unfall ohne Beteiligung', bauteil: 'Kassette', type: null, qty: 1, causes: ['Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'Kettenblatt', gross: '58,30', net: '48,99', status: 'ok', cause: 'Abnutzung, Verschleiss', bauteil: 'Kettenblatt', type: null, qty: 1, causes: ['Abnutzung, Verschleiss', 'Fall/Sturz/Unfall ohne Beteiligung', 'Bedienfehler/Ungeschicklichkeit'], validate: [] },
  { name: 'Montage Kette+Kassette', gross: '119,00', net: '100,00', status: 'ok', cause: 'Fall/Sturz/Unfall ohne Beteiligung', bauteil: 'Kette', type: null, qty: 1, causes: ['Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'Griffe', gross: '35,64', net: '29,95', status: 'warn', cause: '', bauteil: '', type: 'VR', qty: 2, causes: ['Bedienfehler/Ungeschicklichkeit', 'Fall/Sturz/Unfall ohne Beteiligung', 'Vandalismus/Vorsatz/Sabotage'], validate: ['qty', 'gross'] },
  { name: 'Montage Griffe', gross: '23,80', net: '20,00', status: 'ok', cause: 'Bedienfehler/Ungeschicklichkeit', bauteil: 'Lenker', type: null, qty: 1, causes: ['Bedienfehler/Ungeschicklichkeit', 'Fall/Sturz/Unfall ohne Beteiligung'], validate: [] },
  { name: 'Reifen Hinten', gross: '53,55', net: '45,00', status: 'ok', cause: 'Reifenpanne durch Fremdkörper', bauteil: 'Reifen', type: 'HR', qty: 1, causes: ['Reifenpanne durch Fremdkörper', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'Montage Reifen', gross: '59,50', net: '50,00', status: 'warn', cause: '', bauteil: '', type: null, qty: 1, causes: ['Reifenpanne durch Fremdkörper', 'Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'Bremsscheibe Vorn', gross: '63,06', net: '52,99', status: 'ok', cause: 'Fall/Sturz/Unfall mit Beteiligung', bauteil: 'Bremse', type: 'VR', qty: 1, causes: ['Fall/Sturz/Unfall mit Beteiligung', 'Fall/Sturz/Unfall ohne Beteiligung'], validate: [] },
];

const BAUTEIL_GROUPS = [
  { section: 'Antrieb', items: ['Kette', 'Kassette', 'Kettenblatt', 'Schaltung', 'Tretlager', 'Kurbelgarnitur', 'Umwerfer', 'Schaltwerk', 'Schalthebel', 'Schaltauge'] },
  { section: 'Bremsen', items: ['Bremse', 'Bremshebel', 'Bremsscheibe', 'Bremsbelag', 'Bremszug', 'Bremsleitung'] },
  { section: 'Laufräder', items: ['Reifen', 'Schlauch', 'Felge', 'Speiche', 'Nabe', 'Freilauf'] },
  { section: 'Cockpit & Komfort', items: ['Lenker', 'Griff', 'Sattel', 'Pedal', 'Vorbau', 'Sattelstütze', 'Lenkerband'] },
  { section: 'Rahmen & Gabel', items: ['Rahmen', 'Gabel', 'Steuerrohr', 'Federgabel'] },
  { section: 'Elektrik & Motor', items: ['Nabendynamo', 'Motor', 'Akku', 'Display', 'Ladegerät', 'Sensor', 'Kabel'] },
  { section: 'Beleuchtung', items: ['Frontlicht', 'Rücklicht', 'Reflektor', 'Dynamo'] },
  { section: 'Zubehör', items: ['Schloss', 'Gepäckträger', 'Schutzblech', 'Ständer', 'Klingel', 'Flaschenhalter'] },
];

let itemState = ITEMS.map(item => ({
  open: false,
  cause: item.cause,
  bauteil: item.bauteil,
  types: item.type ? [item.type] : [],
  qty: item.qty,
  gross: item.gross,
  net: item.net,
  status: item.status,
  validatedFields: new Set(),
}));

let displayMode = 'gross';
let allExpanded = false;
let activeBauteilIdx = null;
let _pendingFocus = null;
let pdfExpandedValidate = false;

function parseDE(str) {
  return parseFloat((str || '0').replace(',', '.')) || 0;
}
function formatDE(num) {
  return num.toFixed(2).replace('.', ',');
}
function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getTaxRate() {
  const el = document.getElementById('ctrl-tax-input');
  return parseDE(el ? el.value : '19,00') / 100;
}

/** Format YYYY-MM-DD to DD/MM/YYYY for display (Figma/EU) */
function formatDateToDisplay(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = String(isoDate).split('-');
  return [d, m, y].filter(Boolean).join('/');
}

/** Sync visible date display with native input value */
function syncDateDisplay(inputId, displayId) {
  const input = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (!input || !display) return;
  display.textContent = formatDateToDisplay(input.value);
}

export function getStep3Markup() {
  const filename = funnelState.upload?.pdfName || 'Rechnung-003.pdf';
  return `
<div class="validate-content">
  <div class="validate-left" id="validate-left">
    <div class="pdf-card" id="pdf-card-validate">
      <div class="pdf-toolbar">
        <div class="pdf-nav">
          <button type="button" class="pdf-nav-btn" id="pdf-nav-prev" aria-label="${t('val.navPrevAria')}">‹</button>
          <button type="button" class="pdf-nav-btn" id="pdf-nav-next" aria-label="${t('val.navNextAria')}">›</button>
          <span class="pdf-page-info" id="pdf-page-info">1 / 1</span>
        </div>
        <div class="pdf-toolbar-right">
          <div class="pdf-zoom">
            <button type="button" class="pdf-zoom-btn" id="pdf-zoom-out" title="${t('val.zoomOutTitle')}">−</button>
            <span id="pdf-zoom-label">100%</span>
            <button type="button" class="pdf-zoom-btn" id="pdf-zoom-in" title="${t('val.zoomInTitle')}">+</button>
          </div>
          <div class="pdf-toolbar-divider"></div>
          <button type="button" class="pdf-expand-btn" id="pdf-expand-btn-val" title="${t('nav.closeAria')}" aria-label="${t('nav.closeAria')}">
            <span id="pdf-expand-icon-val" aria-hidden="true"></span>
          </button>
        </div>
      </div>
      <div class="pdf-body">
        <div class="pdf-canvas-wrap" id="pdf-canvas-wrap">
          <canvas id="pdf-canvas"></canvas>
        </div>
        <div class="pdf-fallback" id="pdf-fallback-validate">${t('val.noPdfLoaded')}</div>
      </div>
      <div class="pdf-filename">
        <i class="ti ti-file-invoice" aria-hidden="true"></i>
        <span class="pdf-filename-name">${escHtml(filename)}</span>
      </div>
    </div>
  </div>
  <div class="validate-right" id="validate-right">
    <div class="validate-right-inner">
      <button type="button" class="pdf-trigger-bar" id="pdf-open-overlay-validate">
        <span>${t('damage.pdfTrigger')}</span>
        <i class="ti ti-eye-check pdf-trigger-bar-icon" aria-hidden="true"></i>
      </button>
      <div class="alert-banner warn" id="val-alert">
        <div class="alert-top">
          <div class="alert-title-row">
            <div class="alert-icon warn" id="alert-icon"><i class="ti ti-alert-triangle" aria-hidden="true"></i></div>
            <span class="alert-title" id="alert-title">${t('val.alertTitleMissingAndValidate', { missing: '2', count: '4' })}</span>
          </div>
        </div>
        <div class="alert-sub" id="alert-sub">${t('val.alertSubFill')}</div>
        <div class="alert-actions">
          <button type="button" class="btn-check-fields" id="btn-check-fields">${t('val.btnCheckFields')}</button>
          <button type="button" class="btn-expand-all" id="btn-expand-all">${t('val.btnExpandAll')}</button>
        </div>
      </div>
      <div class="section-block">
        <div class="section-header">
          <span class="section-title">${t('val.sectionInvoiceDetails')}</span>
          <button type="button" class="btn-icon" title="${t('val.addFieldTitle')}"><i class="ti ti-plus" aria-hidden="true"></i></button>
        </div>
        <div class="form-fields">
          <div class="form-row">
            <label class="form-label">${t('val.frameId')}</label>
            <div class="form-field"><div class="field-input-sm disabled">00RDLS98221</div></div>
          </div>
          <div class="form-row" style="align-items:flex-start;padding-top:6px;">
            <label class="form-label" style="padding-top:8px;">${t('val.invoiceDate')}<span class="form-label-hint" id="hint-invoice-date">${t('val.hintSelect')}</span></label>
            <div class="form-field">
              <div class="field-with-icon date-field-wrap">
                <button type="button" class="date-picker-btn" data-for="invoice-date-input" title="${t('val.datePickerAria')}" aria-label="${t('val.datePickerAria')}"><i class="ti ti-calendar" aria-hidden="true"></i></button>
                <div class="date-field-input-area">
                  <span class="date-display" id="invoice-date-display">20/09/2025</span>
                  <input type="date" id="invoice-date-input" value="2025-09-20" class="date-input-native" aria-label="${t('val.invoiceDate')}" />
                </div>
              </div>
            </div>
          </div>
          <div class="form-row" style="align-items:flex-start;padding-top:6px;">
            <label class="form-label" style="padding-top:8px;">${t('val.damageDate')}<span class="form-label-hint" id="hint-damage-date">${t('val.hintSelect')}</span></label>
            <div class="form-field">
              <div class="field-with-icon date-field-wrap">
                <button type="button" class="date-picker-btn" data-for="damage-date-input" title="${t('val.datePickerAria')}" aria-label="${t('val.datePickerAria')}"><i class="ti ti-calendar" aria-hidden="true"></i></button>
                <div class="date-field-input-area">
                  <span class="date-display" id="damage-date-display">18/09/2025</span>
                  <input type="date" id="damage-date-input" value="2025-09-18" class="date-input-native" aria-label="${t('val.damageDate')}" />
                </div>
              </div>
            </div>
          </div>
          <div class="form-row textarea-row">
            <label class="form-label" style="padding-top:8px;">${t('val.damageDesc')}<span class="form-label-hint" id="hint-damage-desc">${t('val.hintEnter')}</span></label>
            <div class="form-field">
              <textarea class="field-textarea" id="damage-desc-input" placeholder="${t('val.placeholderDamageDesc')}">Lenker gebrochen nach Sturz durch verklemmte Kette</textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="section-block">
        <div class="section-header">
          <span class="section-title">${t('val.sectionItems')}: <span id="items-count">${ITEMS.length}</span></span>
          <button type="button" class="btn-icon" title="${t('val.addPositionTitle')}"><i class="ti ti-plus" aria-hidden="true"></i></button>
        </div>
        <div class="items-controller">
          <div class="controller-left">
            <span class="controller-label">${t('val.showAmountsAs')}</span>
            <div class="switcher-group">
              <button type="button" class="switcher-btn" id="sw-net">${t('val.net')}</button>
              <button type="button" class="switcher-btn active" id="sw-gross">${t('val.gross')}</button>
            </div>
          </div>
          <div class="controller-right">
            <span class="controller-label">${t('val.taxRateLabel')}</span>
            <div class="tax-input-wrap">
              <input type="text" inputmode="decimal" class="tax-input" id="ctrl-tax-input" value="19,00" placeholder="0,00" />
              <span class="tax-suffix">%</span>
            </div>
          </div>
        </div>
        <div class="accordion-list" id="accordion-list"></div>
      </div>
      <div class="section-block">
        <div class="total-header">
          <span class="total-title">${t('val.totalTitle')}</span>
          <span class="total-amount" id="total-header-amount">805,69 EUR</span>
        </div>
        <div class="form-fields">
          <div class="form-row" style="align-items:flex-start;padding-top:6px;">
            <label class="form-label" style="padding-top:8px;">${t('val.totalNetLabel')}<span class="form-label-hint" id="hint-total-net">${t('val.hintEnter')}</span></label>
            <div class="form-field">
              <div class="amount-field-input-wrap" id="total-net-wrap">
                <input type="text" inputmode="decimal" id="total-net" class="amount-input" value="677,28" placeholder="0,00" />
                <span class="amount-suffix">EUR</span>
              </div>
              <p class="field-error-msg" id="total-net-error"><i class="ti ti-alert-circle" aria-hidden="true"></i><span id="total-net-error-text"></span></p>
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">${t('val.taxRateLabel')}</label>
            <div class="form-field"><div class="amount-field-input-wrap disabled" style="display:flex;align-items:center;justify-content:space-between"><span id="total-tax-display" class="amount-value-disabled">0,00</span><span class="amount-suffix">EUR</span></div></div>
          </div>
          <div class="form-row" style="align-items:flex-start;padding-top:6px;">
            <label class="form-label" style="padding-top:8px;">${t('val.totalGrossLabel')}<span class="form-label-hint" id="hint-total-gross">${t('val.hintEnter')}</span></label>
            <div class="form-field">
              <div class="amount-field-input-wrap" id="total-gross-wrap">
                <input type="text" inputmode="decimal" id="total-gross" class="amount-input" value="805,69" placeholder="0,00" />
                <span class="amount-suffix">EUR</span>
              </div>
              <p class="field-error-msg" id="total-gross-error"><i class="ti ti-alert-circle" aria-hidden="true"></i><span id="total-gross-error-text"></span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="validate-footer-inline">
        <button type="button" class="btn-back" id="btn-back-val">${t('val.back')}</button>
        <button type="button" class="btn-continue-lg" id="btn-continue-val">${t('val.continue')} <i class="ti ti-arrow-right" aria-hidden="true"></i></button>
        <span class="footer-hint" id="footer-hint">${t('val.footerHintFill')}</span>
      </div>
    </div>
  </div>
</div>

<div class="confirm-overlay" id="overlay-back-validate">
  <div class="confirm-modal" role="dialog" aria-labelledby="confirm-back-val-title">
    <div class="confirm-modal-header">
      <div class="confirm-modal-title" id="confirm-back-val-title">${t('val.modalLeaveTitle')}</div>
    </div>
    <div class="confirm-modal-body">
      <p>${t('val.modalLeaveBody')}</p>
    </div>
    <div class="confirm-modal-footer">
      <button type="button" class="confirm-btn-secondary" id="btn-back-cancel-val">${t('val.modalStay')}</button>
      <button type="button" class="confirm-btn-primary" id="btn-back-confirm-val">${t('val.modalBack')}</button>
    </div>
  </div>
</div>`;
}

/* ─── Bauteil dropdown ─── */
function renderBauteilList(query, currentVal) {
  const dd = document.getElementById('bauteil-dropdown');
  const list = dd ? dd.querySelector('.dd-list') : null;
  if (!list) return;
  const q = (query || '').trim().toLowerCase();
  let html = '';
  let totalVisible = 0;
  BAUTEIL_GROUPS.forEach((group, gi) => {
    const categoryMatches = q && group.section.toLowerCase().includes(q);
    const matchingItems = group.items.filter(item =>
      !q || categoryMatches || item.toLowerCase().includes(q)
    );
    if (matchingItems.length === 0) return;
    if (gi > 0 && totalVisible > 0) html += '<div class="dd-divider"></div>';
    const sectionLabel = q && categoryMatches
      ? group.section.replace(new RegExp(`(${escRe(q)})`, 'gi'), '<mark class="dd-highlight">$1</mark>')
      : group.section;
    html += `<div class="dd-section">${sectionLabel}</div>`;
    matchingItems.forEach(item => {
      const sel = currentVal === item ? ' selected' : '';
      const itemLabel = q && !categoryMatches
        ? item.replace(new RegExp(`(${escRe(q)})`, 'gi'), '<mark class="dd-highlight">$1</mark>')
        : item;
      html += `<div class="dd-item-wrap"><div class="dd-item${sel}" data-bauteil-value="${escHtml(item)}" role="option"><span class="dd-check"><i class="ti ti-check" aria-hidden="true"></i></span>${itemLabel}</div></div>`;
      totalVisible++;
    });
  });
  if (totalVisible === 0) html = `<div class="dd-empty">${t('val.noResultsFor', { query: '<strong>' + escHtml(query || '') + '</strong>' })}</div>`;
  list.innerHTML = html;
  const selEl = list.querySelector('.dd-item.selected');
  if (selEl) selEl.scrollIntoView({ block: 'nearest' });
}

function openBauteilDropdown(event, idx) {
  event.stopPropagation();
  const item = ITEMS[idx];
  const state = itemState[idx];
  if (item.validate.includes('bauteil') && !state.validatedFields.has('bauteil')) {
    state.validatedFields.add('bauteil');
    hideValidateTip();
    updateValidation();
  }
  const dd = document.getElementById('bauteil-dropdown');
  const trigger = document.getElementById(`bauteil-trigger-${idx}`);
  if (!dd || !trigger) return;
  if (activeBauteilIdx === idx && dd.classList.contains('visible')) {
    closeBauteilDropdown();
    return;
  }
  activeBauteilIdx = idx;
  const currentVal = state.bauteil;
  dd.innerHTML = `
    <div class="dd-search-wrap">
      <i class="ti ti-search dd-search-icon" aria-hidden="true"></i>
      <input class="dd-search" type="text" placeholder="${t('val.searchPlaceholder')}" autocomplete="off" id="bauteil-search-input" />
    </div>
    <div class="dd-list" role="listbox" aria-label="${t('validation.bauteilAria')}"></div>`;
  const searchEl = dd.querySelector('.dd-search');
  if (searchEl) {
    searchEl.addEventListener('input', () => renderBauteilList(searchEl.value, itemState[idx].bauteil));
    searchEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeBauteilDropdown();
    });
  }
  renderBauteilList('', currentVal);
  const rect = trigger.getBoundingClientRect();
  dd.style.width = Math.max(rect.width, 240) + 'px';
  dd.style.left = rect.left + 'px';
  const spaceBelow = window.innerHeight - rect.bottom;
  if (spaceBelow >= 320 || spaceBelow >= 180) {
    dd.style.top = (rect.bottom + 4) + 'px';
    dd.style.bottom = 'auto';
  } else {
    dd.style.top = 'auto';
    dd.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
  }
  dd.classList.add('visible');
  trigger.classList.add('open');
  requestAnimationFrame(() => searchEl && searchEl.focus());
}

function closeBauteilDropdown() {
  const dd = document.getElementById('bauteil-dropdown');
  if (dd) dd.classList.remove('visible');
  if (activeBauteilIdx !== null) {
    const trigger = document.getElementById(`bauteil-trigger-${activeBauteilIdx}`);
    if (trigger) trigger.classList.remove('open');
  }
  activeBauteilIdx = null;
}

function selectBauteil(idx, val) {
  itemState[idx].bauteil = val;
  itemState[idx].open = true;
  closeBauteilDropdown();
  buildAccordion();
}

/* ─── Tooltip ─── */
function showValidateTip(e) {
  const tip = document.getElementById('validate-tooltip');
  if (!tip) return;
  tip.textContent = t('validation.tooltipCheck');
  const rect = e.currentTarget.getBoundingClientRect();
  tip.style.left = (rect.left + rect.width / 2) + 'px';
  tip.style.top = (rect.top - 44) + 'px'; /* above component: tooltip height + arrow + gap */
  tip.style.transform = 'translateX(-50%)';
  tip.classList.add('visible');
}
function hideValidateTip() {
  const tip = document.getElementById('validate-tooltip');
  if (tip) tip.classList.remove('visible');
}

/* ─── Accordion build & interactions ─── */
function needsValidate(idx, field) {
  return ITEMS[idx].validate.includes(field) && !itemState[idx].validatedFields.has(field);
}

function buildAccordion() {
  const list = document.getElementById('accordion-list');
  if (!list) return;
  list.innerHTML = '';
  const checkSvg = '<i class="ti ti-check acc-status-icon" aria-hidden="true"></i>';
  const warnSvg = '<i class="ti ti-alert-triangle acc-status-icon" aria-hidden="true"></i>';

  ITEMS.forEach((item, idx) => {
    const state = itemState[idx];
    const price = displayMode === 'gross' ? state.gross : state.net;
    const needsCause = !state.cause;
    const needsBauteil = !state.bauteil;
    const needsType = item.type !== null && !!state.bauteil && state.types.length === 0;
    const hasUnvalidated = item.validate.some(f => !state.validatedFields.has(f));
    const isWarn = needsCause || needsBauteil || needsType || hasUnvalidated;
    const isOk = !isWarn;
    const statusIcon = isOk ? checkSvg : warnSvg;

    const causeTags = item.causes.map(c => {
      const sel = state.cause === c ? ' selected' : '';
      return `<span class="acc-tag${sel}" data-idx="${idx}" data-cause="${escHtml(c)}">${escHtml(c)}</span>`;
    }).join('');

    let typeRow = '';
    if (item.type !== null && state.bauteil) {
      const vrSel = state.types.includes('VR');
      const hrSel = state.types.includes('HR');
      const typeEmpty = state.types.length === 0;
      const typeLabel = typeEmpty
        ? '<span class="acc-form-label" style="flex-shrink:0;"><span style="display:block;font-size:14px;color:var(--n1000);line-height:20px;">' + t('val.typeLabel') + '</span><span class="acc-form-label-hint">' + t('val.selectOne') + '</span></span>'
        : '<span class="acc-form-label">' + t('val.typeLabel') + '</span>';
      typeRow = `
        <div class="acc-form-row">
          ${typeLabel}
          <div class="acc-form-field">
            <div class="type-toggle">
              <button type="button" class="type-btn${vrSel ? ' selected' : ''}" data-idx="${idx}" data-type="VR">VR${vrSel ? ' <span class="type-btn-x">×</span>' : ''}</button>
              <button type="button" class="type-btn${hrSel ? ' selected' : ''}" data-idx="${idx}" data-type="HR">HR${hrSel ? ' <span class="type-btn-x">×</span>' : ''}</button>
            </div>
          </div>
        </div>`;
    }

    const causeLabel = (needsCause || needsValidate(idx, 'cause'))
      ? '<span class="acc-form-label" style="flex-shrink:0;"><span style="display:block;font-size:14px;color:var(--n1000);line-height:20px;">' + t('val.causeLabel') + '</span>' + (needsCause ? '<span class="acc-form-label-hint">' + t('val.selectOne') + '</span>' : '') + '</span>'
      : '<span class="acc-form-label">' + t('val.causeLabel') + '</span>';
    const causeTagsWrap = `<div class="acc-tags-wrap${needsCause ? ' field-empty' : ''}" id="causes-${idx}">${causeTags}</div>`;
    const causeField = needsValidate(idx, 'cause')
      ? `<div class="field-validate-wrap acc-form-field" data-validate-idx="${idx}" data-validate-field="cause">${causeTagsWrap}</div>`
      : `<div class="acc-form-field">${causeTagsWrap}</div>`;

const bauteilLabel = needsBauteil
      ? '<span class="acc-form-label" style="flex-shrink:0;"><span style="display:block;font-size:14px;color:var(--n1000);line-height:20px;">' + t('val.bauteilLabel') + '</span><span class="acc-form-label-hint">' + t('val.hintSelect') + '</span></span>'
      : '<span class="acc-form-label">' + t('val.bauteilLabel') + '</span>';
    const bauteilTrigger = `
      <button type="button" class="bauteil-trigger${needsBauteil ? ' field-empty' : ''}" id="bauteil-trigger-${idx}" data-idx="${idx}" aria-haspopup="listbox">
        <span class="bauteil-trigger-label${state.bauteil ? '' : ' placeholder'}">${escHtml(state.bauteil || t('val.selectOne'))}</span>
        <span class="bauteil-trigger-chevron"><i class="ti ti-chevron-down" aria-hidden="true"></i></span>
      </button>`;
    const bauteilField = needsValidate(idx, 'bauteil')
      ? `<div class="field-validate-wrap acc-form-field" data-validate-idx="${idx}" data-validate-field="bauteil">${bauteilTrigger}</div>`
      : `<div class="acc-form-field">${bauteilTrigger}</div>`;

    const qtyInner = `<div class="number-input-wrap"><input type="text" inputmode="numeric" id="qty-input-${idx}" class="number-input" value="${state.qty}" data-idx="${idx}" /><div class="number-chevrons"><button type="button" class="number-chevron" data-idx="${idx}" data-delta="1">▲</button><button type="button" class="number-chevron" data-idx="${idx}" data-delta="-1">▼</button></div></div>`;
    const grossInner = `<div class="amount-field-input-wrap${displayMode === 'gross' ? '' : ' disabled'}"><input type="text" inputmode="decimal" id="gross-input-${idx}" class="amount-input" value="${state.gross}" placeholder="0,00" data-idx="${idx}" data-field="gross" ${displayMode === 'gross' ? '' : 'disabled'} /><span class="amount-suffix">EUR</span></div>`;
    const netInner = `<div class="amount-field-input-wrap${displayMode === 'net' ? '' : ' disabled'}"><input type="text" inputmode="decimal" id="net-input-${idx}" class="amount-input" value="${state.net}" placeholder="0,00" data-idx="${idx}" data-field="net" ${displayMode === 'net' ? '' : 'disabled'} /><span class="amount-suffix">EUR</span></div>`;
    const validateWrap = (field, inner) => needsValidate(idx, field)
      ? `<div class="field-validate-wrap acc-form-field" data-validate-idx="${idx}" data-validate-field="${field}">${inner}</div>`
      : `<div class="acc-form-field">${inner}</div>`;

    const div = document.createElement('div');
    div.className = 'accordion-item' + (state.open ? ' open' : '') + (isOk ? ' validated' : ' warn');
    div.dataset.idx = String(idx);
    div.innerHTML = `
      <div class="accordion-header" data-idx="${idx}">
        <div class="acc-status">${statusIcon}</div>
        <span class="acc-name">${escHtml(item.name)}</span>
        <span class="acc-price">${price} EUR</span>
        <div class="acc-chevron"><i class="ti ti-chevron-down" aria-hidden="true"></i></div>
      </div>
      <div class="accordion-body">
        <div class="accordion-body-inner">
          <div class="accordion-card">
            <div class="acc-card-body">
              <div class="acc-form-row" style="align-items:flex-start;padding-top:4px;">${causeLabel}${causeField}</div>
              <div class="acc-form-row">${bauteilLabel}${bauteilField}</div>
              ${typeRow}
              <div class="acc-form-row"><span class="acc-form-label">${t('val.qtyLabel')}</span>${validateWrap('qty', qtyInner)}</div>
              <div class="acc-form-row"><span class="acc-form-label">${t('val.totalNetLabel')}</span>${displayMode === 'net' ? validateWrap('gross', netInner) : `<div class="acc-form-field"><div class="amount-field-input-wrap disabled"><input type="text" class="amount-input" value="${state.net}" disabled /><span class="amount-suffix">EUR</span></div></div>`}</div>
              <div class="acc-form-row"><span class="acc-form-label">${t('val.totalGrossLabel')}</span>${displayMode === 'gross' ? validateWrap('gross', grossInner) : `<div class="acc-form-field"><div class="amount-field-input-wrap disabled"><input type="text" class="amount-input" value="${state.gross}" disabled /><span class="amount-suffix">EUR</span></div></div>`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    list.appendChild(div);
  });

  updateValidation();
  updateTotals();
  const expandBtn = document.getElementById('btn-expand-all');
  if (expandBtn) {
    const allOpen = itemState.every(s => s.open);
    allExpanded = allOpen;
    expandBtn.textContent = allOpen ? t('val.btnCollapseAll') : t('val.btnExpandAll');
  }
  attachAccordionInputs();
  wireValidateTooltips();
}

function wireValidateTooltips() {
  const tip = document.getElementById('validate-tooltip');
  document.querySelectorAll('.field-validate-wrap[data-validate-idx][data-validate-field]').forEach(wrap => {
    wrap.addEventListener('mouseenter', (e) => {
      if (tip) {
        tip.textContent = t('validation.tooltipCheck');
        const rect = e.currentTarget.getBoundingClientRect();
        tip.style.left = (rect.left + rect.width / 2) + 'px';
        tip.style.top = (rect.top - 44) + 'px'; /* above component: tooltip height + arrow + gap */
        tip.style.transform = 'translateX(-50%)';
        tip.classList.add('visible');
      }
    });
    wrap.addEventListener('mouseleave', () => { if (tip) tip.classList.remove('visible'); });
    wrap.addEventListener('click', () => {
      const idx = parseInt(wrap.getAttribute('data-validate-idx'), 10);
      const field = wrap.getAttribute('data-validate-field');
      if (!isNaN(idx) && field) markValidated(idx, field);
    });
  });
}

function attachAccordionInputs() {
  ITEMS.forEach((_, idx) => {
    const qtyEl = document.getElementById(`qty-input-${idx}`);
    const grossEl = document.getElementById(`gross-input-${idx}`);
    const netEl = document.getElementById(`net-input-${idx}`);
    if (qtyEl) {
      qtyEl.oninput = () => { qtyEl.value = qtyEl.value.replace(/[^0-9]/g, ''); };
      qtyEl.onblur = () => { setQty(idx, qtyEl.value); updateValidation(); buildAccordion(); };
    }
    if (grossEl && !grossEl.disabled) {
      grossEl.oninput = () => filterAmountInput(grossEl);
      grossEl.onblur = () => { formatAmountOnBlur(grossEl); setGross(idx, grossEl.value); buildAccordion(); };
    }
    if (netEl && !netEl.disabled) {
      netEl.oninput = () => filterAmountInput(netEl);
      netEl.onblur = () => { formatAmountOnBlur(netEl); setNet(idx, netEl.value); buildAccordion(); };
    }
  });
}

function toggleItem(idx) {
  itemState[idx].open = !itemState[idx].open;
  const el = document.querySelector(`.accordion-item[data-idx="${idx}"]`);
  if (el) {
    el.classList.toggle('open', itemState[idx].open);
    const expandBtn = document.getElementById('btn-expand-all');
    if (expandBtn) expandBtn.textContent = itemState.every(s => s.open) ? t('val.btnCollapseAll') : t('val.btnExpandAll');
  } else buildAccordion();
}

function toggleCause(idx, cause) {
  itemState[idx].cause = itemState[idx].cause === cause ? '' : cause;
  buildAccordion();
}

function toggleType(idx, type) {
  const types = itemState[idx].types;
  const i = types.indexOf(type);
  if (i === -1) types.push(type);
  else types.splice(i, 1);
  itemState[idx].open = true;
  buildAccordion();
}

function setQty(idx, val) {
  itemState[idx].qty = Math.max(1, parseInt(val, 10) || 1);
  itemState[idx].open = true;
}
function setGross(idx, raw) {
  const val = parseDE(raw);
  if (!isNaN(val) && val > 0) {
    itemState[idx].gross = formatDE(val);
    const taxRate = getTaxRate() * 100;
    itemState[idx].net = formatDE(val / (1 + taxRate / 100));
  }
  itemState[idx].open = true;
}
function setNet(idx, raw) {
  const val = parseDE(raw);
  if (!isNaN(val) && val > 0) {
    itemState[idx].net = formatDE(val);
    const taxRate = getTaxRate() * 100;
    itemState[idx].gross = formatDE(val * (1 + taxRate / 100));
  }
  itemState[idx].open = true;
}
function changeQty(idx, delta) {
  itemState[idx].qty = Math.max(1, (itemState[idx].qty || 1) + delta);
  itemState[idx].open = true;
  buildAccordion();
}

function filterAmountInput(el) {
  let v = el.value.replace(/[^0-9,.]/g, '');
  const sep = v.search(/[,.]/);
  if (sep !== -1) {
    const intPart = v.slice(0, sep).replace(/[,.]/g, '');
    const decPart = v.slice(sep + 1).replace(/[,.]/g, '').slice(0, 2);
    v = intPart + ',' + decPart;
  }
  if (el.value !== v) el.value = v;
}
function formatAmountOnBlur(el) {
  if (el.value.trim() === '') return;
  const num = parseDE(el.value);
  el.value = formatDE(isNaN(num) ? 0 : num);
}

function switchDisplay(mode) {
  displayMode = mode;
  const swNet = document.getElementById('sw-net');
  const swGross = document.getElementById('sw-gross');
  if (swNet) swNet.classList.toggle('active', mode === 'net');
  if (swGross) swGross.classList.toggle('active', mode === 'gross');
  buildAccordion();
}

/* ─── Totals ─── */
function updateTotals() {
  const totalNet = itemState.reduce((sum, s) => sum + parseDE(s.net), 0);
  const taxRate = getTaxRate();
  const totalGross = totalNet * (1 + taxRate);
  const displayVal = displayMode === 'net' ? totalNet : totalGross;
  const header = document.getElementById('total-header-amount');
  if (header) header.textContent = formatDE(displayVal) + ' EUR';
  const taxDisplayEl = document.getElementById('total-tax-display');
  if (taxDisplayEl) {
    const taxAmount = totalGross - totalNet;
    taxDisplayEl.textContent = formatDE(taxAmount);
  }
  // Persist totals into shared funnel state for Step 4 (Review)
  if (funnelState && funnelState.review && funnelState.review.totals) {
    const taxAmount = totalGross - totalNet;
    funnelState.review.totals.net = `${formatDE(totalNet)} EUR`;
    funnelState.review.totals.gross = `${formatDE(totalGross)} EUR`;
    funnelState.review.totals.taxAmount = `${formatDE(taxAmount)} EUR`;
    funnelState.review.totals.taxRate = `${formatDE(taxRate * 100)} %`;
  }
  const netEl = document.getElementById('total-net');
  const grossEl = document.getElementById('total-gross');
  if (netEl && netEl !== document.activeElement) netEl.value = formatDE(totalNet);
  if (grossEl && grossEl !== document.activeElement) grossEl.value = formatDE(totalGross);
  const netWrap = document.getElementById('total-net-wrap');
  const grossWrap = document.getElementById('total-gross-wrap');
  if (netWrap) netWrap.classList.toggle('disabled', displayMode === 'gross');
  if (grossWrap) grossWrap.classList.toggle('disabled', displayMode === 'net');
  if (netEl) netEl.disabled = displayMode === 'gross';
  if (grossEl) grossEl.disabled = displayMode === 'net';
  clearTotalMismatch();
}
function checkTotalMismatch() {
  const expectedNet = itemState.reduce((sum, s) => sum + parseDE(s.net), 0);
  const taxRate = getTaxRate();
  const expectedGross = expectedNet * (1 + taxRate);
  const tolerance = 0.02;
  const grossEl = document.getElementById('total-gross');
  const netEl = document.getElementById('total-net');
  const grossWrap = document.getElementById('total-gross-wrap');
  const netWrap = document.getElementById('total-net-wrap');
  const grossErr = document.getElementById('total-gross-error');
  const grossErrText = document.getElementById('total-gross-error-text');
  const netErr = document.getElementById('total-net-error');
  const netErrText = document.getElementById('total-net-error-text');
  if (displayMode === 'gross' && grossEl && grossWrap) {
    const entered = parseDE(grossEl.value);
    const mismatch = grossEl.value.trim() !== '' && Math.abs(entered - expectedGross) > tolerance;
    grossWrap.classList.toggle('error', mismatch);
    if (grossErr) { grossErr.classList.toggle('visible', mismatch); if (grossErrText && mismatch) grossErrText.textContent = t('val.totalMismatch', { expected: formatDE(expectedGross) }); }
    if (netWrap) netWrap.classList.remove('error'); if (netErr) netErr.classList.remove('visible');
  } else if (displayMode === 'net' && netEl && netWrap) {
    const entered = parseDE(netEl.value);
    const mismatch = netEl.value.trim() !== '' && Math.abs(entered - expectedNet) > tolerance;
    netWrap.classList.toggle('error', mismatch);
    if (netErr) { netErr.classList.toggle('visible', mismatch); if (netErrText && mismatch) netErrText.textContent = t('val.totalMismatch', { expected: formatDE(expectedNet) }); }
    if (grossWrap) grossWrap.classList.remove('error'); if (grossErr) grossErr.classList.remove('visible');
  }
}
function clearTotalMismatch() {
  ['total-gross-wrap', 'total-net-wrap'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('error'); });
  ['total-gross-error', 'total-net-error'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('visible'); });
}

/* ─── Validation state & alert ─── */
function updateValidation() {
  let missingCount = 0;
  const invoiceDateEl = document.getElementById('invoice-date-input');
  const damageDateEl = document.getElementById('damage-date-input');
  const damageDescEl = document.getElementById('damage-desc-input');
  const invoiceDateEmpty = !invoiceDateEl || !invoiceDateEl.value;
  const damageDateEmpty = !damageDateEl || !damageDateEl.value;
  const damageDescEmpty = !damageDescEl || !damageDescEl.value.trim();
  if (invoiceDateEmpty) missingCount++;
  if (damageDateEmpty) missingCount++;
  if (damageDescEmpty) missingCount++;
  ['hint-invoice-date', 'hint-damage-date', 'hint-damage-desc'].forEach((id, i) => {
    const el = document.getElementById(id);
    const empty = [invoiceDateEmpty, damageDateEmpty, damageDescEmpty][i];
    if (el) el.classList.toggle('visible', empty);
  });
  const totalNetVal = document.getElementById('total-net')?.value?.trim() || '';
  const totalGrossVal = document.getElementById('total-gross')?.value?.trim() || '';
  if (!totalNetVal) missingCount++;
  if (!totalGrossVal) missingCount++;
  document.getElementById('hint-total-net')?.classList.toggle('visible', !totalNetVal);
  document.getElementById('hint-total-gross')?.classList.toggle('visible', !totalGrossVal);
  itemState.forEach((s, i) => {
    if (!s.cause) missingCount++;
    if (!s.bauteil) missingCount++;
    if (ITEMS[i].type !== null && !!s.bauteil && s.types.length === 0) missingCount++;
  });
  let toValidateCount = 0;
  ITEMS.forEach((item, idx) => {
    const s = itemState[idx];
    item.validate.forEach(field => {
      if (!s.validatedFields.has(field)) {
        const hasValue = field === 'cause' ? !!s.cause : field === 'bauteil' ? !!s.bauteil : true;
        if (hasValue) toValidateCount++;
      }
    });
  });
  const banner = document.getElementById('val-alert');
  const alertIcon = document.getElementById('alert-icon');
  const alertTitle = document.getElementById('alert-title');
  const alertSub = document.getElementById('alert-sub');
  const btnCheck = document.getElementById('btn-check-fields');
  const allDone = missingCount === 0 && toValidateCount === 0;
  const canContinue = missingCount === 0;
  const footerHint = document.getElementById('footer-hint');
  const btnContinue = document.getElementById('btn-continue-val');
  if (banner) banner.className = 'alert-banner ' + (allDone ? 'success' : 'warn');
  if (alertIcon) {
    alertIcon.className = 'alert-icon ' + (allDone ? '' : 'warn');
    alertIcon.innerHTML = allDone ? '<i class="ti ti-circle-check" aria-hidden="true"></i>' : '<i class="ti ti-alert-triangle" aria-hidden="true"></i>';
  }
  if (alertTitle) {
    if (allDone) alertTitle.textContent = t('val.alertTitleAllDone');
    else if (missingCount && toValidateCount) alertTitle.textContent = t('val.alertTitleMissingAndValidate', { missing: String(missingCount), count: String(toValidateCount) });
    else if (missingCount) alertTitle.textContent = t('val.alertTitleMissing', { missing: String(missingCount) });
    else if (toValidateCount) alertTitle.textContent = t('val.alertTitleValidate', { count: String(toValidateCount) });
    else alertTitle.textContent = t('val.alertTitleRequired');
  }
  if (alertSub) {
    alertSub.textContent = allDone
      ? t('val.alertSubCanContinue')
      : (missingCount > 0 ? t('val.alertSubFill') : t('val.alertSubCheck'));
  }
  if (btnCheck) {
    btnCheck.disabled = allDone;
    btnCheck.classList.toggle('disabled', allDone);
    btnCheck.textContent = missingCount > 0 ? t('val.btnCheckMissing') : t('val.btnCheckFields');
  }
  if (footerHint) {
    footerHint.textContent = canContinue ? t('val.footerHintOk') : t('val.footerHintFill');
    footerHint.classList.toggle('ok', canContinue);
  }
  if (btnContinue) { btnContinue.classList.toggle('on', canContinue); }
}

function checkFields() {
  const invoiceDateEl = document.getElementById('invoice-date-input');
  const damageDateEl = document.getElementById('damage-date-input');
  const damageDescEl = document.getElementById('damage-desc-input');
  const invoiceDateEmpty = !invoiceDateEl || !invoiceDateEl.value;
  const damageDateEmpty = !damageDateEl || !damageDateEl.value;
  const damageDescEmpty = !damageDescEl || !damageDescEl.value.trim();
  const totalNetVal = document.getElementById('total-net')?.value?.trim() || '';
  const totalGrossVal = document.getElementById('total-gross')?.value?.trim() || '';

  let firstTarget = null;
  if (invoiceDateEmpty) firstTarget = { type: 'el', el: invoiceDateEl?.closest('.form-row') };
  if (!firstTarget && damageDateEmpty) firstTarget = { type: 'el', el: damageDateEl?.closest('.form-row') };
  if (!firstTarget && damageDescEmpty) firstTarget = { type: 'el', el: damageDescEl?.closest('.form-row') };
  if (!firstTarget) {
    for (let idx = 0; idx < itemState.length; idx++) {
      const state = itemState[idx];
      const item = ITEMS[idx];
      const hasMissing = !state.cause || !state.bauteil;
      const needsType = item.type !== null && !!state.bauteil && state.types.length === 0;
      const hasUnvalidated = item.validate.some(f => !state.validatedFields.has(f));
      if (hasMissing || needsType || hasUnvalidated) {
        state.open = true;
        firstTarget = { type: 'accordion', idx };
        break;
      }
    }
  }
  if (!firstTarget && (!totalNetVal || !totalGrossVal)) firstTarget = { type: 'el', el: document.getElementById('total-net-wrap')?.closest('.form-row') || document.getElementById('total-header-amount')?.closest('.section-block') };

  buildAccordion();
  if (firstTarget) {
    setTimeout(() => {
      let el = null;
      if (firstTarget.type === 'el' && firstTarget.el) el = firstTarget.el;
      else if (firstTarget.type === 'accordion') el = document.querySelector(`.accordion-item[data-idx="${firstTarget.idx}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }
}

function expandAll() {
  allExpanded = !allExpanded;
  itemState.forEach(s => s.open = allExpanded);
  document.querySelectorAll('.accordion-item').forEach(el => {
    const idx = parseInt(el.dataset.idx, 10);
    if (!isNaN(idx)) el.classList.toggle('open', itemState[idx].open);
  });
  const btn = document.getElementById('btn-expand-all');
  if (btn) btn.textContent = allExpanded ? t('val.btnCollapseAll') : t('val.btnExpandAll');
}

function markValidated(idx, field) {
  if (itemState[idx].validatedFields.has(field)) return;
  itemState[idx].validatedFields.add(field);
  hideValidateTip();
  updateValidation();
  itemState[idx].open = true;
  buildAccordion();
}

/* ─── Wire step 3 ─── */
function wirePdfExpandValidate() {
  const btn = document.getElementById('pdf-expand-btn-val');
  const card = document.getElementById('pdf-card-validate');
  const left = document.getElementById('validate-left');
  if (!btn || !card || !left) return;

  // Initialize desktop icon as expand (maximize); keep X icon on mobile/tablet
  if (!isMobileViewport()) {
    const iconHost = document.getElementById('pdf-expand-icon-val');
    if (iconHost) {
      iconHost.outerHTML = getPdfExpandSvg(false, 'pdf-expand-icon-val');
    }
  } else {
    const iconHost = document.getElementById('pdf-expand-icon-val');
    if (iconHost && iconHost.childElementCount === 0) {
      iconHost.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';
    }
  }

  btn.addEventListener('click', () => {
    // On tablet/mobile, treat expand as "close overlay"
    if (isMobileViewport()) {
      left.classList.remove('active');
      return;
    }
    pdfExpandedValidate = !pdfExpandedValidate;
    left.classList.toggle('pdf-expanded', pdfExpandedValidate);
    card.classList.toggle('expanded', pdfExpandedValidate);
    btn.setAttribute('aria-label', pdfExpandedValidate ? t('val.collapsePdfAria') : t('val.expandPdfAria'));
    const icon = document.getElementById('pdf-expand-icon-val');
    if (icon) {
      icon.outerHTML = getPdfExpandSvg(pdfExpandedValidate, 'pdf-expand-icon-val');
    }
  });
}

export function wireValidationStep(goToStep) {
  if (getPdfDoc()) showLoadedPdfInCurrentCard('pdf-fallback-validate');
  const zoomIn = document.getElementById('pdf-zoom-in');
  const zoomOut = document.getElementById('pdf-zoom-out');
  const navPrev = document.getElementById('pdf-nav-prev');
  const navNext = document.getElementById('pdf-nav-next');
  if (zoomIn) zoomIn.addEventListener('click', () => pdfZoomChange(1));
  if (zoomOut) zoomOut.addEventListener('click', () => pdfZoomChange(-1));
  if (navPrev) navPrev.addEventListener('click', pdfNavPrev);
  if (navNext) navNext.addEventListener('click', pdfNavNext);
  pdfZoomApply();
  wirePdfExpandValidate();

  const pdfOpenOverlayBtn = document.getElementById('pdf-open-overlay-validate');
  const pdfLeftPanel = document.getElementById('validate-left');
  if (pdfOpenOverlayBtn && pdfLeftPanel) {
    pdfOpenOverlayBtn.addEventListener('click', () => {
      pdfLeftPanel.classList.add('active');
      if (getPdfDoc()) {
        showLoadedPdfInCurrentCard('pdf-fallback-validate');
      }
    });
  }

  const btnCheck = document.getElementById('btn-check-fields');
  const btnExpandAll = document.getElementById('btn-expand-all');
  if (btnCheck) btnCheck.addEventListener('click', checkFields);
  if (btnExpandAll) btnExpandAll.addEventListener('click', expandAll);

  const invoiceDate = document.getElementById('invoice-date-input');
  const damageDate = document.getElementById('damage-date-input');
  const damageDesc = document.getElementById('damage-desc-input');
  [invoiceDate, damageDate, damageDesc].forEach(el => {
    if (el) el.addEventListener('change', updateValidation);
    if (el && el.tagName === 'TEXTAREA') el.addEventListener('input', updateValidation);
  });
  syncDateDisplay('invoice-date-input', 'invoice-date-display');
  syncDateDisplay('damage-date-input', 'damage-date-display');
  [invoiceDate, damageDate].forEach(input => {
    if (!input) return;
    input.addEventListener('change', () => {
      const displayId = input.id === 'invoice-date-input' ? 'invoice-date-display' : 'damage-date-display';
      syncDateDisplay(input.id, displayId);
    });
  });
  document.querySelectorAll('.date-picker-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const forId = btn.getAttribute('data-for');
      const input = document.getElementById(forId);
      if (input) { input.focus(); if (typeof input.showPicker === 'function') input.showPicker(); }
    });
  });

  const swNet = document.getElementById('sw-net');
  const swGross = document.getElementById('sw-gross');
  if (swNet) swNet.addEventListener('click', () => switchDisplay('net'));
  if (swGross) swGross.addEventListener('click', () => switchDisplay('gross'));

  const ctrlTax = document.getElementById('ctrl-tax-input');
  if (ctrlTax) {
    ctrlTax.addEventListener('input', function () {
      let v = this.value.replace(/[^0-9,.]/g, '');
      const sep = v.search(/[,.]/);
      if (sep !== -1) { const a = v.slice(0, sep).replace(/[,.]/g, ''); const b = v.slice(sep + 1).replace(/[,.]/g, '').slice(0, 2); v = a + ',' + b; }
      this.value = v;
      updateTotals();
    });
    ctrlTax.addEventListener('blur', function () { formatAmountOnBlur(this); updateTotals(); });
  }

  const accordionList = document.getElementById('accordion-list');
  if (accordionList) {
    accordionList.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      const accTag = e.target.closest('.acc-tag');
      const typeBtn = e.target.closest('.type-btn');
      const bauteilTrigger = e.target.closest('.bauteil-trigger');
      const numberChevron = e.target.closest('.number-chevron');
      if (header) { const idx = parseInt(header.dataset.idx, 10); if (!isNaN(idx)) toggleItem(idx); return; }
      if (accTag) { const idx = parseInt(accTag.dataset.idx, 10); const cause = accTag.dataset.cause; if (!isNaN(idx) && cause) toggleCause(idx, cause); return; }
      if (typeBtn) { const idx = parseInt(typeBtn.dataset.idx, 10); const type = typeBtn.dataset.type; if (!isNaN(idx) && type) toggleType(idx, type); return; }
      if (bauteilTrigger) { const idx = parseInt(bauteilTrigger.dataset.idx, 10); if (!isNaN(idx)) openBauteilDropdown(e, idx); return; }
      if (numberChevron) { const idx = parseInt(numberChevron.dataset.idx, 10); const delta = parseInt(numberChevron.dataset.delta, 10); if (!isNaN(idx) && !isNaN(delta)) changeQty(idx, delta); return; }
    });
  }

  document.addEventListener('click', (e) => {
    const dd = document.getElementById('bauteil-dropdown');
    if (!dd) return;
    const ddItem = e.target.closest('#bauteil-dropdown .dd-item');
    if (ddItem && activeBauteilIdx !== null) {
      const val = ddItem.getAttribute('data-bauteil-value');
      if (val) selectBauteil(activeBauteilIdx, val);
      return;
    }
    if (!dd.contains(e.target) && !e.target.closest('.bauteil-trigger')) closeBauteilDropdown();
  });

  const totalNet = document.getElementById('total-net');
  const totalGross = document.getElementById('total-gross');
  if (totalNet) {
    totalNet.addEventListener('input', () => filterAmountInput(totalNet));
    totalNet.addEventListener('blur', () => { formatAmountOnBlur(totalNet); updateTotals(); checkTotalMismatch(); updateValidation(); });
  }
  if (totalGross) {
    totalGross.addEventListener('input', () => filterAmountInput(totalGross));
    totalGross.addEventListener('blur', () => { formatAmountOnBlur(totalGross); updateTotals(); checkTotalMismatch(); updateValidation(); });
  }

  const btnBack = document.getElementById('btn-back-val');
  const btnContinue = document.getElementById('btn-continue-val');
  const backOverlay = document.getElementById('overlay-back-validate');
  const backCancel = document.getElementById('btn-back-cancel-val');
  const backConfirm = document.getElementById('btn-back-confirm-val');

  if (btnBack && backOverlay) {
    btnBack.addEventListener('click', () => {
      backOverlay.classList.add('visible');
    });
  }
  if (backCancel && backOverlay) {
    backCancel.addEventListener('click', () => {
      backOverlay.classList.remove('visible');
    });
  }
  if (backConfirm && backOverlay) {
    backConfirm.addEventListener('click', () => {
      backOverlay.classList.remove('visible');
      goToStep(2);
    });
  }
  if (backOverlay) {
    backOverlay.addEventListener('click', (e) => {
      if (e.target === backOverlay) backOverlay.classList.remove('visible');
    });
  }

  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      if (btnContinue.classList.contains('on')) goToStep(4);
    });
  }

  buildAccordion();
}
