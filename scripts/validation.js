/**
 * Step 3 – Validate
 * Layout: left panel (invoice details + totals), right table (line items with
 * inline cause/component/type/qty controls), full-width alert bar, footer.
 */

import { funnelState } from './state.js';
import { t } from './i18n.js';

/* ─── Data ─── */
const ITEMS = [
  { name: 'KETTE CN-M6100 126 GLIED', gross: '59,44', net: '49,95', status: 'ok', cause: 'Fall/Sturz/Unfall ohne Beteiligung', bauteil: 'Kette', type: null, qty: 1, causes: ['Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'KETTE CN-M8100 126 GLIEDER HG 12-FACH M. QUICK-LINK', gross: '72,40', net: '60,84', status: 'warn', cause: '', bauteil: 'Bremse', type: null, qty: 1, causes: ['Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: ['bauteil'] },
  { name: 'Kassette SLX CS-M7100', gross: '154,64', net: '129,95', status: 'ok', cause: 'Fall/Sturz/Unfall ohne Beteiligung', bauteil: 'Kassette', type: null, qty: 1, causes: ['Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'Kettenblatt', gross: '58,30', net: '48,99', status: 'ok', cause: 'Abnutzung, Verschleiss', bauteil: 'Kettenblatt', type: null, qty: 1, causes: ['Abnutzung, Verschleiss', 'Fall/Sturz/Unfall ohne Beteiligung', 'Bedienfehler/Ungeschicklichkeit'], validate: [] },
  { name: 'Montage Kette+Kassette', gross: '119,00', net: '100,00', status: 'ok', cause: 'Fall/Sturz/Unfall ohne Beteiligung', bauteil: 'Kette', type: null, qty: 1, causes: ['Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'Griffe', gross: '35,64', net: '29,95', status: 'warn', cause: '', bauteil: '', type: 'VR', qty: 2, causes: ['Bedienfehler/Ungeschicklichkeit', 'Fall/Sturz/Unfall ohne Beteiligung', 'Vandalismus/Vorsatz/Sabotage'], validate: ['qty'] },
  { name: 'Montage Griffe', gross: '23,80', net: '20,00', status: 'ok', cause: 'Bedienfehler/Ungeschicklichkeit', bauteil: 'Lenker', type: null, qty: 1, causes: ['Bedienfehler/Ungeschicklichkeit', 'Fall/Sturz/Unfall ohne Beteiligung'], validate: [] },
  { name: 'Reifen Hinten', gross: '53,55', net: '45,00', status: 'ok', cause: 'Reifenpanne durch Fremdkörper', bauteil: 'Reifen', type: 'HR', qty: 1, causes: ['Reifenpanne durch Fremdkörper', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'Montage Reifen', gross: '59,50', net: '50,00', status: 'warn', cause: '', bauteil: '', type: null, qty: 1, causes: ['Reifenpanne durch Fremdkörper', 'Fall/Sturz/Unfall ohne Beteiligung', 'Abnutzung, Verschleiss'], validate: [] },
  { name: 'Bremsscheibe Vorn', gross: '63,06', net: '52,99', status: 'ok', cause: 'Fall/Sturz/Unfall mit Beteiligung', bauteil: 'Bremse', type: 'VR', qty: 1, causes: ['Fall/Sturz/Unfall mit Beteiligung', 'Fall/Sturz/Unfall ohne Beteiligung'], validate: [] },
  { name: 'Montage Bremsscheibe', gross: '59,50', net: '50,00', status: 'warn', cause: '', bauteil: '', type: null, qty: 1, causes: ['Fall/Sturz/Unfall mit Beteiligung', 'Abnutzung, Verschleiss'], validate: ['bauteil'] },
  { name: 'Pedale', gross: '35,64', net: '29,95', status: 'ok', cause: 'Fall/Sturz/Unfall ohne Beteiligung', bauteil: 'Pedal', type: null, qty: 1, causes: ['Fall/Sturz/Unfall ohne Beteiligung', 'Bedienfehler/Ungeschicklichkeit'], validate: [] },
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
  cause: item.cause,
  bauteil: item.bauteil,
  types: item.type ? [item.type] : [],
  qty: item.qty,
  gross: item.gross,
  net: item.net,
  validatedFields: new Set(),
}));

let displayMode = 'gross';
let activeBauteilIdx = null;
let activeCauseIdx = null;
let dropdownMode = null; // 'bauteil' | 'cause'

/* ─── Helpers ─── */
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

function formatDateToDisplay(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = String(isoDate).split('-');
  return [d, m, y].filter(Boolean).join('.');
}

function syncDateDisplay(inputId, displayId) {
  const input = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (!input || !display) return;
  display.textContent = formatDateToDisplay(input.value);
}

function needsValidate(idx, field) {
  return ITEMS[idx].validate.includes(field) && !itemState[idx].validatedFields.has(field);
}

const CLAIM_ID = '189115';

/* ─── Step 3 markup ─── */
export function getStep3Markup() {
  const docType = funnelState.upload?.documentType || 'invoice';
  const pageTitle = docType === 'estimate'
    ? 'Kostenvoranschlagsfelder validieren'
    : 'Rechnungsfelder validieren';

  return `
<div class="validate-content">

  <div class="val-page-title-row">
    <h2 class="val-page-title">${pageTitle}</h2>
    <div class="val-alert-bar warn" id="val-alert" role="alert">
      <div class="val-alert-inner">
        <i class="ti ti-alert-triangle val-alert-icon" aria-hidden="true" id="val-alert-icon"></i>
        <span id="alert-title">${t('val.alertTitleMissingAndValidate', { missing: '2', count: '6' })}</span>
      </div>
    </div>
  </div>

  <div class="val-main">

    <div class="val-table-panel">
      <div class="val-table-title-row">
        <span class="val-table-title"><span id="items-count">${ITEMS.length}</span> ${t('val.sectionItems')}</span>
        <div class="val-table-controls">
          <span class="controller-label">${t('val.showAmountsAs')}</span>
          <div class="switcher-group">
            <button type="button" class="switcher-btn" id="sw-net">${t('val.net')}</button>
            <button type="button" class="switcher-btn active" id="sw-gross">${t('val.gross')}</button>
          </div>
          <span class="controller-label">${t('val.taxRateLabel')}</span>
          <div class="tax-input-wrap">
            <input type="text" inputmode="decimal" class="tax-input" id="ctrl-tax-input" value="19,00" placeholder="0,00" />
            <span class="tax-suffix">%</span>
          </div>
        </div>
        <button type="button" class="btn-add-item">
          <i class="ti ti-plus" aria-hidden="true"></i>
          <span>${t('val.addPositionTitle')}</span>
        </button>
      </div>
      <div class="val-table-wrap">
        <table class="val-table" role="grid">
          <thead>
            <tr class="val-thead-row">
              <th class="val-th val-th--name">Item Name</th>
              <th class="val-th val-th--cause">Damage Cause</th>
              <th class="val-th val-th--component">Component</th>
              <th class="val-th val-th--type">Type</th>
              <th class="val-th val-th--qty">Quantity</th>
              <th class="val-th val-th--net">Net Amount</th>
              <th class="val-th val-th--gross">Gross Amount</th>
              <th class="val-th val-th--status" aria-label="Status"></th>
            </tr>
          </thead>
          <tbody id="val-table-body"></tbody>
        </table>
      </div>
    </div>

    <div class="val-invoice-panel">
      <div class="val-invoice-panel-inner">
        <div class="val-panel-title-row">
          <h2 class="val-panel-title">${t('val.sectionInvoiceDetails')}</h2>
        </div>
        <div class="val-panel-form">

          <div class="val-form-row">
            <label class="val-form-label">${t('val.frameId')}</label>
            <div class="val-form-field"><div class="field-input-sm disabled">00RDLS98221</div></div>
          </div>

          <div class="val-form-row val-form-row--date">
            <label class="val-form-label">${t('val.invoiceDate')}<span class="form-label-hint" id="hint-invoice-date">${t('val.hintSelect')}</span></label>
            <div class="val-form-field">
              <div class="field-with-icon date-field-wrap">
                <button type="button" class="date-picker-btn" data-for="invoice-date-input" aria-label="${t('val.datePickerAria')}"><i class="ti ti-calendar" aria-hidden="true"></i></button>
                <div class="date-field-input-area">
                  <span class="date-display" id="invoice-date-display">20.09.2025</span>
                  <input type="date" id="invoice-date-input" value="2025-09-20" class="date-input-native" aria-label="${t('val.invoiceDate')}" />
                </div>
              </div>
            </div>
          </div>

          <div class="val-form-row val-form-row--date">
            <label class="val-form-label">${t('val.damageDate')}<span class="form-label-hint" id="hint-damage-date">${t('val.hintSelect')}</span></label>
            <div class="val-form-field">
              <div class="field-with-icon date-field-wrap">
                <button type="button" class="date-picker-btn" data-for="damage-date-input" aria-label="${t('val.datePickerAria')}"><i class="ti ti-calendar" aria-hidden="true"></i></button>
                <div class="date-field-input-area">
                  <span class="date-display" id="damage-date-display">20.09.2025</span>
                  <input type="date" id="damage-date-input" value="2025-09-20" class="date-input-native" aria-label="${t('val.damageDate')}" />
                </div>
              </div>
            </div>
          </div>

          <div class="val-form-row val-form-row--textarea">
            <label class="val-form-label">${t('val.damageDesc')}<span class="form-label-hint" id="hint-damage-desc">${t('val.hintEnter')}</span></label>
            <div class="val-form-field">
              <textarea class="field-textarea" id="damage-desc-input" placeholder="${t('val.placeholderDamageDesc')}">Lenker gebrochen nach Sturz durch verklemmte Kette</textarea>
            </div>
          </div>

          <div class="val-form-row">
            <label class="val-form-label">${t('val.totalNetLabel')}</label>
            <div class="val-form-field">
              <div class="amount-field-input-wrap disabled">
                <span id="total-net-display" class="amount-value-disabled">677,28</span>
                <span class="amount-suffix">EUR</span>
              </div>
            </div>
          </div>

          <div class="val-form-row">
            <label class="val-form-label">${t('val.taxRateLabel')}</label>
            <div class="val-form-field">
              <div class="amount-field-input-wrap disabled">
                <span id="total-tax-display" class="amount-value-disabled">19,00</span>
                <span class="amount-suffix">%</span>
              </div>
            </div>
          </div>

          <div class="val-form-row">
            <label class="val-form-label">${t('val.totalGrossLabel')}</label>
            <div class="val-form-field">
              <div class="amount-field-input-wrap disabled">
                <span id="total-gross-display" class="amount-value-disabled">805,69</span>
                <span class="amount-suffix">EUR</span>
              </div>
            </div>
          </div>

        </div>
        <button type="button" class="btn-view-pdf" id="btn-view-pdf-val">
          <i class="ti ti-eye" aria-hidden="true"></i>
          <span>${t('val.viewPdf')}</span>
        </button>
      </div>
    </div>
  </div>

  <div class="val-footer">
    <button type="button" class="btn-back" id="btn-back-val">
      <i class="ti ti-arrow-left" aria-hidden="true"></i>
      ${t('val.back')}
    </button>
    <div class="val-footer-right">
      <span class="footer-hint" id="footer-hint">${t('val.footerHintFill')}</span>
      <button type="button" class="btn-continue-lg" id="btn-continue-val">
        ${t('val.continue')} <i class="ti ti-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
  </div>

  <div class="confirm-overlay" id="overlay-back-validate">
    <div class="confirm-modal" role="dialog" aria-labelledby="confirm-back-val-title">
      <div class="confirm-modal-header">
        <div class="confirm-modal-title" id="confirm-back-val-title">${t('val.modalLeaveTitle')}</div>
      </div>
      <div class="confirm-modal-body"><p>${t('val.modalLeaveBody')}</p></div>
      <div class="confirm-modal-footer">
        <button type="button" class="confirm-btn-secondary" id="btn-back-cancel-val">${t('val.modalStay')}</button>
        <button type="button" class="confirm-btn-primary" id="btn-back-confirm-val">${t('val.modalBack')}</button>
      </div>
    </div>
  </div>
</div>`;
}

/* ─── Bauteil dropdown (Component column) ─── */
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
  const state = itemState[idx];
  const item = ITEMS[idx];

  if (item.validate.includes('bauteil') && !state.validatedFields.has('bauteil')) {
    state.validatedFields.add('bauteil');
    hideValidateTip();
    updateValidation();
  }

  const dd = document.getElementById('bauteil-dropdown');
  const trigger = document.getElementById(`bauteil-trigger-${idx}`);
  if (!dd || !trigger) return;

  if (activeBauteilIdx === idx && dropdownMode === 'bauteil' && dd.classList.contains('visible')) {
    closeDropdown();
    return;
  }

  closeDropdown();
  activeBauteilIdx = idx;
  dropdownMode = 'bauteil';

  dd.innerHTML = `
    <div class="dd-search-wrap">
      <i class="ti ti-search dd-search-icon" aria-hidden="true"></i>
      <input class="dd-search" type="text" placeholder="${t('val.searchPlaceholder')}" autocomplete="off" id="bauteil-search-input" />
    </div>
    <div class="dd-list" role="listbox" aria-label="${t('validation.bauteilAria')}"></div>`;

  const searchEl = dd.querySelector('.dd-search');
  if (searchEl) {
    searchEl.addEventListener('input', () => renderBauteilList(searchEl.value, itemState[idx].bauteil));
    searchEl.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDropdown(); });
  }
  renderBauteilList('', state.bauteil);

  positionDropdown(dd, trigger);
  dd.classList.add('visible');
  trigger.classList.add('open');
  requestAnimationFrame(() => searchEl && searchEl.focus());
}

function flashTrigger(id) {
  const trigger = document.getElementById(id);
  if (!trigger) return;
  trigger.classList.add('just-selected');
  setTimeout(() => trigger.classList.remove('just-selected'), 1500);
}

function selectBauteil(idx, val) {
  itemState[idx].bauteil = val;
  closeDropdown();
  buildTable();
  flashTrigger(`bauteil-trigger-${idx}`);
}

/* ─── Cause dropdown (Damage Cause column) ─── */
function openCauseDropdown(event, idx) {
  event.stopPropagation();
  const state = itemState[idx];
  const item = ITEMS[idx];

  if (item.validate.includes('cause') && !state.validatedFields.has('cause')) {
    state.validatedFields.add('cause');
    hideValidateTip();
    updateValidation();
  }

  const dd = document.getElementById('bauteil-dropdown');
  const trigger = document.getElementById(`cause-trigger-${idx}`);
  if (!dd || !trigger) return;

  if (activeCauseIdx === idx && dropdownMode === 'cause' && dd.classList.contains('visible')) {
    closeDropdown();
    return;
  }

  closeDropdown();
  activeCauseIdx = idx;
  dropdownMode = 'cause';

  const options = item.causes.map(c => {
    const sel = state.cause === c ? ' selected' : '';
    return `<div class="dd-item-wrap"><div class="dd-item${sel}" data-cause-value="${escHtml(c)}" role="option"><span class="dd-check"><i class="ti ti-check" aria-hidden="true"></i></span>${escHtml(c)}</div></div>`;
  }).join('');

  dd.innerHTML = `<div class="dd-list" role="listbox" style="padding: 4px 0;">${options}</div>`;

  positionDropdown(dd, trigger);
  dd.classList.add('visible');
  trigger.classList.add('open');
}

function selectCause(idx, val) {
  itemState[idx].cause = val;
  closeDropdown();
  buildTable();
  flashTrigger(`cause-trigger-${idx}`);
}

function positionDropdown(dd, trigger) {
  const rect = trigger.getBoundingClientRect();
  dd.style.width = Math.max(rect.width, 200) + 'px';
  dd.style.left = rect.left + 'px';
  const spaceBelow = window.innerHeight - rect.bottom;
  if (spaceBelow >= 200 || spaceBelow >= 180) {
    dd.style.top = (rect.bottom + 4) + 'px';
    dd.style.bottom = 'auto';
  } else {
    dd.style.top = 'auto';
    dd.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
  }
}

function closeDropdown() {
  const dd = document.getElementById('bauteil-dropdown');
  if (dd) dd.classList.remove('visible');
  if (activeBauteilIdx !== null) {
    const t = document.getElementById(`bauteil-trigger-${activeBauteilIdx}`);
    if (t) t.classList.remove('open');
  }
  if (activeCauseIdx !== null) {
    const t = document.getElementById(`cause-trigger-${activeCauseIdx}`);
    if (t) t.classList.remove('open');
  }
  activeBauteilIdx = null;
  activeCauseIdx = null;
  dropdownMode = null;
}

/* ─── Validate tooltip ─── */
function showValidateTip(e) {
  const tip = document.getElementById('validate-tooltip');
  if (!tip) return;
  tip.textContent = t('validation.tooltipCheck');
  const rect = e.currentTarget.getBoundingClientRect();
  tip.style.left = (rect.left + rect.width / 2) + 'px';
  tip.style.top = (rect.top - 44) + 'px';
  tip.style.transform = 'translateX(-50%)';
  tip.classList.add('visible');
}
function hideValidateTip() {
  const tip = document.getElementById('validate-tooltip');
  if (tip) tip.classList.remove('visible');
}

function wireValidateTooltips() {
  document.querySelectorAll('[data-validate-idx][data-validate-field]').forEach(el => {
    el.addEventListener('mouseenter', showValidateTip);
    el.addEventListener('mouseleave', () => hideValidateTip());
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-validate-idx'), 10);
      const field = el.getAttribute('data-validate-field');
      if (!isNaN(idx) && field) {
        itemState[idx].validatedFields.add(field);
        hideValidateTip();
        updateValidation();
        buildTable();
      }
    });
  });
}

/* ─── Table ─── */
function buildTable() {
  const tbody = document.getElementById('val-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ITEMS.forEach((item, idx) => {
    const state = itemState[idx];
    const needsCause = !state.cause;
    const needsBauteil = !state.bauteil;
    const needsType = item.type !== null && !!state.bauteil && state.types.length === 0;
    const causeNeedsValidate = needsValidate(idx, 'cause');
    const bauteilNeedsValidate = needsValidate(idx, 'bauteil');
    const qtyNeedsValidate = needsValidate(idx, 'qty');
    const hasUnvalidated = item.validate.some(f => !state.validatedFields.has(f));
    const isWarn = needsCause || needsBauteil || needsType || hasUnvalidated;

    // Cause trigger
    const causeDisplay = state.cause
      ? (state.cause.length > 14 ? state.cause.slice(0, 13) + '…' : state.cause)
      : t('val.selectOne');
    const causeBtnClass = [
      'val-dropdown-trigger',
      needsCause ? 'val-dropdown--empty' : '',
      causeNeedsValidate ? 'val-dropdown--validate' : '',
    ].filter(Boolean).join(' ');

    // Bauteil trigger
    const bauteilDisplay = state.bauteil || t('val.selectOne');
    const bauteilBtnClass = [
      'val-dropdown-trigger',
      needsBauteil ? 'val-dropdown--empty' : '',
      bauteilNeedsValidate ? 'val-dropdown--validate' : '',
    ].filter(Boolean).join(' ');

    // Type cell
    let typeHtml = '';
    if (item.type === null) {
      typeHtml = `<span class="val-type-none">None</span>`;
    } else {
      const btns = ['VR', 'HR'].map(tp => {
        const sel = state.types.includes(tp) ? ' selected' : '';
        return `<button type="button" class="val-type-btn${sel}" data-idx="${idx}" data-type="${tp}">${tp}</button>`;
      }).join('');
      typeHtml = `<div class="val-type-wrap">${btns}</div>`;
    }

    const statusHtml = isWarn
      ? `<i class="ti ti-alert-triangle val-status-warn" aria-hidden="true"></i>`
      : `<i class="ti ti-check val-status-ok" aria-hidden="true"></i>`;

    const tr = document.createElement('tr');
    tr.className = `val-tr${isWarn ? ' val-tr--warn' : ''}`;
    tr.dataset.idx = String(idx);
    tr.innerHTML = `
      <td class="val-td val-td--name">${escHtml(item.name)}</td>
      <td class="val-td val-td--cause">
        <button type="button" class="${causeBtnClass}" id="cause-trigger-${idx}" data-idx="${idx}" data-dropdown="cause"
          ${causeNeedsValidate ? `data-validate-idx="${idx}" data-validate-field="cause"` : ''}>
          <span class="val-dropdown-label${needsCause ? ' val-dropdown-placeholder' : ''}">${escHtml(causeDisplay)}</span>
          <i class="ti ti-chevron-down val-dropdown-chevron" aria-hidden="true"></i>
        </button>
      </td>
      <td class="val-td val-td--component">
        <button type="button" class="${bauteilBtnClass}" id="bauteil-trigger-${idx}" data-idx="${idx}" data-dropdown="bauteil"
          ${bauteilNeedsValidate ? `data-validate-idx="${idx}" data-validate-field="bauteil"` : ''}>
          <span class="val-dropdown-label${needsBauteil ? ' val-dropdown-placeholder' : ''}">${escHtml(bauteilDisplay)}</span>
          <i class="ti ti-chevron-down val-dropdown-chevron" aria-hidden="true"></i>
        </button>
      </td>
      <td class="val-td val-td--type${needsType ? ' val-td--needs-validate' : ''}">
        ${typeHtml}
      </td>
      <td class="val-td val-td--qty${qtyNeedsValidate ? ' val-td--needs-validate' : ''}"
        ${qtyNeedsValidate ? `data-validate-idx="${idx}" data-validate-field="qty"` : ''}>
        <div class="val-qty-wrap${qtyNeedsValidate ? ' val-qty-wrap--warn' : ''}">
          <input type="text" inputmode="numeric" class="val-qty-input" id="qty-input-${idx}" value="${state.qty}" data-idx="${idx}" />
          <div class="val-qty-chevrons">
            <button type="button" class="val-qty-btn" data-idx="${idx}" data-delta="1" tabindex="-1" aria-label="Increase">▲</button>
            <button type="button" class="val-qty-btn" data-idx="${idx}" data-delta="-1" tabindex="-1" aria-label="Decrease">▼</button>
          </div>
        </div>
      </td>
      ${displayMode === 'net'
        ? `<td class="val-td val-td--net"><div class="val-amount-wrap"><input type="text" inputmode="decimal" class="val-amount-input" id="net-input-${idx}" value="${escHtml(state.net)}" data-idx="${idx}" /><span class="val-amount-suffix">EUR</span></div></td>`
        : `<td class="val-td val-td--net"><span class="val-amount-text" id="net-display-${idx}">${escHtml(state.net)} EUR</span></td>`
      }
      ${displayMode === 'gross'
        ? `<td class="val-td val-td--gross"><div class="val-amount-wrap"><input type="text" inputmode="decimal" class="val-amount-input" id="gross-input-${idx}" value="${escHtml(state.gross)}" data-idx="${idx}" /><span class="val-amount-suffix">EUR</span></div></td>`
        : `<td class="val-td val-td--gross"><span class="val-amount-text" id="gross-display-${idx}">${escHtml(state.gross)} EUR</span></td>`
      }
      <td class="val-td val-td--status">${statusHtml}</td>
    `;
    tbody.appendChild(tr);
  });

  ITEMS.forEach((_, idx) => {
    const qtyEl = document.getElementById(`qty-input-${idx}`);
    if (qtyEl) {
      qtyEl.addEventListener('input', () => { qtyEl.value = qtyEl.value.replace(/[^0-9]/g, ''); });
      qtyEl.addEventListener('blur', () => { setQty(idx, qtyEl.value); updateValidation(); buildTable(); });
    }
  });

  // Wire editable amount column
  ITEMS.forEach((_, idx) => {
    if (displayMode === 'gross') {
      const el = document.getElementById(`gross-input-${idx}`);
      if (el) {
        el.addEventListener('input', () => {
          filterAmountInput(el);
          const gross = parseDE(el.value);
          if (gross > 0) {
            itemState[idx].gross = formatDE(gross);
            itemState[idx].net = formatDE(gross / (1 + getTaxRate()));
            const netDisplay = document.getElementById(`net-display-${idx}`);
            if (netDisplay) netDisplay.textContent = itemState[idx].net + ' EUR';
            updateTotals();
          }
        });
        el.addEventListener('blur', () => {
          formatAmountOnBlur(el);
          itemState[idx].gross = el.value || '0,00';
          itemState[idx].net = formatDE(parseDE(itemState[idx].gross) / (1 + getTaxRate()));
          const netDisplay = document.getElementById(`net-display-${idx}`);
          if (netDisplay) netDisplay.textContent = itemState[idx].net + ' EUR';
          updateTotals();
        });
      }
    } else {
      const el = document.getElementById(`net-input-${idx}`);
      if (el) {
        el.addEventListener('input', () => {
          filterAmountInput(el);
          const net = parseDE(el.value);
          if (net > 0) {
            itemState[idx].net = formatDE(net);
            itemState[idx].gross = formatDE(net * (1 + getTaxRate()));
            const grossDisplay = document.getElementById(`gross-display-${idx}`);
            if (grossDisplay) grossDisplay.textContent = itemState[idx].gross + ' EUR';
            updateTotals();
          }
        });
        el.addEventListener('blur', () => {
          formatAmountOnBlur(el);
          itemState[idx].net = el.value || '0,00';
          recalcRow(idx);
          updateTotals();
        });
      }
    }
  });

  wireValidateTooltips();
  updateValidation();
}

/* ─── Item state mutations ─── */
function toggleType(idx, type) {
  const types = itemState[idx].types;
  const i = types.indexOf(type);
  if (i === -1) types.push(type);
  else types.splice(i, 1);
  buildTable();
  updateValidation();
}

function setQty(idx, val) {
  itemState[idx].qty = Math.max(1, parseInt(val, 10) || 1);
}

function changeQty(idx, delta) {
  itemState[idx].qty = Math.max(1, (itemState[idx].qty || 1) + delta);
  buildTable();
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

/* ─── Row-level amount recalc ─── */
function recalcRow(idx) {
  const taxRate = getTaxRate();
  const state = itemState[idx];
  // Net is always the source of truth; gross is derived from net * (1 + taxRate)
  state.gross = formatDE(parseDE(state.net) * (1 + taxRate));
  if (displayMode === 'gross') {
    const el = document.getElementById(`gross-input-${idx}`);
    if (el) el.value = state.gross;
  } else {
    const el = document.getElementById(`gross-display-${idx}`);
    if (el) el.textContent = state.gross + ' EUR';
  }
}

function recalcAllRows() {
  ITEMS.forEach((_, idx) => recalcRow(idx));
}

/* ─── Display mode ─── */
function switchDisplay(mode) {
  displayMode = mode;
  const swNet = document.getElementById('sw-net');
  const swGross = document.getElementById('sw-gross');
  if (swNet) swNet.classList.toggle('active', mode === 'net');
  if (swGross) swGross.classList.toggle('active', mode === 'gross');
  buildTable();
  updateTotals();
}

/* ─── Totals ─── */
function updateTotals() {
  const totalNet   = itemState.reduce((sum, s) => sum + parseDE(s.net), 0);
  const totalGross = itemState.reduce((sum, s) => sum + parseDE(s.gross), 0);
  const taxRate    = getTaxRate();

  // Steuersatz shows the rate %, not the EUR amount
  const taxDisplayEl = document.getElementById('total-tax-display');
  if (taxDisplayEl) taxDisplayEl.textContent = formatDE(taxRate * 100);

  if (funnelState && funnelState.review && funnelState.review.totals) {
    funnelState.review.totals.net = `${formatDE(totalNet)} EUR`;
    funnelState.review.totals.gross = `${formatDE(totalGross)} EUR`;
    funnelState.review.totals.taxAmount = `${formatDE(totalGross - totalNet)} EUR`;
    funnelState.review.totals.taxRate = `${formatDE(taxRate * 100)} %`;
  }

  const netDisplayEl = document.getElementById('total-net-display');
  const grossDisplayEl = document.getElementById('total-gross-display');
  if (netDisplayEl) netDisplayEl.textContent = formatDE(totalNet);
  if (grossDisplayEl) grossDisplayEl.textContent = formatDE(totalGross);
}


/* ─── Validation state & alert bar ─── */
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
  const alertIconEl = document.getElementById('val-alert-icon');
  const alertTitle = document.getElementById('alert-title');
  const allDone = missingCount === 0 && toValidateCount === 0;
  const canContinue = missingCount === 0;

  if (banner) banner.className = 'val-alert-bar ' + (allDone ? 'success' : 'warn');
  if (alertIconEl) {
    alertIconEl.className = allDone
      ? 'ti ti-circle-check val-alert-icon'
      : 'ti ti-alert-triangle val-alert-icon';
  }
  if (alertTitle) {
    if (allDone) alertTitle.textContent = t('val.alertTitleAllDone');
    else if (missingCount && toValidateCount) alertTitle.textContent = t('val.alertTitleMissingAndValidate', { missing: String(missingCount), count: String(toValidateCount) });
    else if (missingCount) alertTitle.textContent = t('val.alertTitleMissing', { missing: String(missingCount) });
    else if (toValidateCount) alertTitle.textContent = t('val.alertTitleValidate', { count: String(toValidateCount) });
    else alertTitle.textContent = t('val.alertTitleRequired');
  }

  const footerHint = document.getElementById('footer-hint');
  const btnContinue = document.getElementById('btn-continue-val');
  if (footerHint) {
    footerHint.textContent = canContinue ? t('val.footerHintOk') : t('val.footerHintFill');
    footerHint.classList.toggle('ok', canContinue);
  }
  if (btnContinue) btnContinue.classList.toggle('on', canContinue);
}

/* ─── Wire step 3 ─── */
export function wireValidationStep(goToStep) {
  buildTable();
  syncDateDisplay('invoice-date-input', 'invoice-date-display');
  syncDateDisplay('damage-date-input', 'damage-date-display');
  updateTotals();
  updateValidation();

  // Date pickers
  [document.getElementById('invoice-date-input'), document.getElementById('damage-date-input')].forEach(input => {
    if (!input) return;
    input.addEventListener('change', () => {
      const displayId = input.id === 'invoice-date-input' ? 'invoice-date-display' : 'damage-date-display';
      syncDateDisplay(input.id, displayId);
      updateValidation();
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

  const damageDesc = document.getElementById('damage-desc-input');
  if (damageDesc) damageDesc.addEventListener('input', updateValidation);

  // Netto / Brutto switcher
  const swNet = document.getElementById('sw-net');
  const swGross = document.getElementById('sw-gross');
  if (swNet) swNet.addEventListener('click', () => switchDisplay('net'));
  if (swGross) swGross.addEventListener('click', () => switchDisplay('gross'));

  // Tax rate input
  const ctrlTax = document.getElementById('ctrl-tax-input');
  if (ctrlTax) {
    ctrlTax.addEventListener('input', function () {
      let v = this.value.replace(/[^0-9,.]/g, '');
      const sep = v.search(/[,.]/);
      if (sep !== -1) { const a = v.slice(0, sep).replace(/[,.]/g, ''); const b = v.slice(sep + 1).replace(/[,.]/g, '').slice(0, 2); v = a + ',' + b; }
      this.value = v;
      recalcAllRows();
      updateTotals();
    });
    ctrlTax.addEventListener('blur', function () { formatAmountOnBlur(this); recalcAllRows(); updateTotals(); });
  }


  // Table event delegation
  const tbody = document.getElementById('val-table-body');
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const dropdownTrigger = e.target.closest('[data-dropdown]');
      const typeBtn = e.target.closest('.val-type-btn');
      const qtyBtn = e.target.closest('.val-qty-btn');

      if (dropdownTrigger) {
        const idx = parseInt(dropdownTrigger.dataset.idx, 10);
        if (isNaN(idx)) return;
        if (dropdownTrigger.dataset.dropdown === 'cause') openCauseDropdown(e, idx);
        else if (dropdownTrigger.dataset.dropdown === 'bauteil') openBauteilDropdown(e, idx);
        return;
      }
      if (typeBtn) {
        const idx = parseInt(typeBtn.dataset.idx, 10);
        const type = typeBtn.dataset.type;
        if (!isNaN(idx) && type) toggleType(idx, type);
        return;
      }
      if (qtyBtn) {
        const idx = parseInt(qtyBtn.dataset.idx, 10);
        const delta = parseInt(qtyBtn.dataset.delta, 10);
        if (!isNaN(idx) && !isNaN(delta)) changeQty(idx, delta);
        return;
      }
    });
  }

  // Global dropdown close + item selection
  document.addEventListener('click', (e) => {
    const dd = document.getElementById('bauteil-dropdown');
    if (!dd) return;
    const bauteilItem = e.target.closest('#bauteil-dropdown .dd-item[data-bauteil-value]');
    const causeItem = e.target.closest('#bauteil-dropdown .dd-item[data-cause-value]');
    if (bauteilItem && activeBauteilIdx !== null) {
      const val = bauteilItem.getAttribute('data-bauteil-value');
      if (val) selectBauteil(activeBauteilIdx, val);
      return;
    }
    if (causeItem && activeCauseIdx !== null) {
      const val = causeItem.getAttribute('data-cause-value');
      if (val) selectCause(activeCauseIdx, val);
      return;
    }
    if (!dd.contains(e.target) && !e.target.closest('[data-dropdown]')) closeDropdown();
  });

  // Back / Continue
  const btnBack = document.getElementById('btn-back-val');
  const btnContinue = document.getElementById('btn-continue-val');
  const backOverlay = document.getElementById('overlay-back-validate');
  const backCancel = document.getElementById('btn-back-cancel-val');
  const backConfirm = document.getElementById('btn-back-confirm-val');

  if (btnBack && backOverlay) btnBack.addEventListener('click', () => backOverlay.classList.add('visible'));
  if (backCancel && backOverlay) backCancel.addEventListener('click', () => backOverlay.classList.remove('visible'));
  if (backConfirm && backOverlay) {
    backConfirm.addEventListener('click', () => { backOverlay.classList.remove('visible'); goToStep(2); });
  }
  if (backOverlay) backOverlay.addEventListener('click', (e) => { if (e.target === backOverlay) backOverlay.classList.remove('visible'); });
  if (btnContinue) btnContinue.addEventListener('click', () => { if (btnContinue.classList.contains('on')) goToStep(4); });
}
