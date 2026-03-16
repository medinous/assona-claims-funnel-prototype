/**
 * Step 2 – Confirm Damage
 * Left: PDF card (reuses loaded PDF from step 1). Right: alert, damage type tags, causes, CTA.
 * Matches index_02_damage.html behaviour.
 */

import { funnelState } from './state.js';
import {
  pdfZoomChange,
  pdfZoomApply,
  pdfNavPrev,
  pdfNavNext,
  showLoadedPdfInCurrentCard,
  getPdfDoc,
} from './pdf-viewer.js';
import { t } from './i18n.js';

const CAUSES = {
  partial: [
    'Feuchtigkeit',
    'Abnutzung, Verschleiss',
    'Bedienfehler/Ungeschicklichkeit',
    'Elektronikschäden',
    'Fall/Sturz/Unfall mit Beteiligung',
    'Fall/Sturz/Unfall ohne Beteiligung',
    'Material-, Konstruktions-, Herstell- und Produktionsfehler an Sonstigen Teilen',
    'Vandalismus/Vorsatz/Sabotage',
    'Garantie/Gewährleistung',
    'Teilediebstahl',
    'nicht bestimmungsgemäßer Gebrauch, (z.B. Reinigung, Reparatur)',
    'Sonstige/unbekannt',
    'Reifenpanne durch Fremdkörper',
  ],
  uvv: [
    'Prüfpflicht nicht erfüllt',
    'Sicherheitsmangel festgestellt',
    'Verschleiss über Toleranz',
    'Elektrische Anlage defekt',
    'Bremsen nicht normkonform',
    'Fehlende Schutzausrüstung',
    'Dokumentationsmangel',
    'Sonstige UVV-Ursache',
  ],
};

const selectedTypes = new Set(['partial']);
let pdfExpandedDamage = false;

export function getStep2Markup() {
  const filename = funnelState.upload?.pdfName || 'Rechnung-003.pdf';
  return `
<div class="damage-content">
  <div class="damage-left" id="damage-left">
    <div class="pdf-card" id="pdf-card-damage">
      <div class="pdf-toolbar">
        <div class="pdf-nav">
          <button type="button" class="pdf-nav-btn" id="pdf-nav-prev" aria-label="${t('damage.navPrevAria')}">‹</button>
          <button type="button" class="pdf-nav-btn" id="pdf-nav-next" aria-label="${t('damage.navNextAria')}">›</button>
          <span class="pdf-page-info">1 / 1</span>
        </div>
        <div class="pdf-toolbar-right">
          <div class="pdf-zoom">
            <button type="button" class="pdf-zoom-btn" id="pdf-zoom-out" title="${t('damage.zoomOutTitle')}">−</button>
            <span id="pdf-zoom-label">100%</span>
            <button type="button" class="pdf-zoom-btn" id="pdf-zoom-in" title="${t('damage.zoomInTitle')}">+</button>
          </div>
          <div class="pdf-toolbar-divider"></div>
          <button type="button" class="pdf-expand-btn" id="pdf-expand-btn-damage" title="${t('damage.closeAria')}" aria-label="${t('damage.closeAria')}">
            <i class="ti ti-x" id="pdf-expand-icon-damage" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="pdf-body">
        <div class="pdf-canvas-wrap" id="pdf-canvas-wrap">
          <canvas id="pdf-canvas"></canvas>
        </div>
        <div class="pdf-fallback" id="pdf-fallback-damage" style="padding:12px;font-size:13px;color:var(--n500);">
          ${t('damage.pdfFallback')}
        </div>
      </div>
      <div class="pdf-filename">
        <i class="ti ti-file-invoice" aria-hidden="true"></i>
        <span class="pdf-filename-name">${filename}</span>
      </div>
    </div>
  </div>
  <div class="damage-right">
    <div class="damage-right-inner">
      <button type="button" class="pdf-trigger-bar" id="pdf-open-overlay-damage">
        <span>${t('damage.pdfTrigger')}</span>
        <i class="ti ti-eye-check pdf-trigger-bar-icon" aria-hidden="true"></i>
      </button>
      <div class="alert-banner" id="alert-banner">
        <div class="alert-top">
          <div class="alert-title-row">
            <div class="alert-icon"><i class="ti ti-circle-check" aria-hidden="true"></i></div>
            <div class="alert-title">${t('damage.alertTitle')} <span class="alert-filename" id="alert-filename">${filename}</span></div>
          </div>
          <button type="button" class="alert-close" id="alert-close" aria-label="${t('damage.closeAria')}">×</button>
        </div>
        <div class="alert-sub">${t('damage.alertSub')}</div>
        <div class="alert-action">
          <button type="button" class="btn-reupload" id="btn-reupload">
            <i class="ti ti-upload" aria-hidden="true"></i>
            ${t('damage.reupload')}
          </button>
        </div>
      </div>
      <div class="damage-section" id="dmg-type-section">
        <div class="damage-section-title">${t('damage.confirmType')}</div>
        <div class="tags-wrap">
          <div class="tag selected" id="dt-partial" data-type="partial">${t('damage.partial')} <span class="tag-x">×</span></div>
          <div class="tag" id="dt-uvv" data-type="uvv">${t('damage.uvv')} <span class="tag-x">×</span></div>
          <div class="tag disabled" id="dt-insp" data-type="inspection" title="${t('damage.inspectionTooltip')}">${t('damage.inspection')}</div>
        </div>
      </div>
      <div class="damage-section" id="causes-section">
        <div class="damage-section-title">${t('damage.confirmCauses')}</div>
        <div class="tags-wrap" id="causes-wrap"></div>
      </div>
      <div class="cta-row">
        <button type="button" class="btn-continue" id="btn-continue">
          ${t('damage.continue')}
          <i class="ti ti-arrow-right" aria-hidden="true"></i>
        </button>
        <span class="continue-hint" id="continue-hint">${t('damage.continueHintSelectCause')}</span>
      </div>
    </div>
  </div>
</div>
`;
}

function render() {
  const tagPartial = document.getElementById('dt-partial');
  const tagUvv = document.getElementById('dt-uvv');
  const tagInsp = document.getElementById('dt-insp');
  const causesSection = document.getElementById('causes-section');
  const inspSelected = selectedTypes.has('inspection');

  [tagPartial, tagUvv, tagInsp].forEach((t) => {
    if (t) t.classList.remove('selected', 'disabled');
  });

  if (inspSelected) {
    if (tagInsp) tagInsp.classList.add('selected');
    if (tagPartial) tagPartial.classList.add('disabled');
    if (tagUvv) tagUvv.classList.add('disabled');
  } else {
    if (tagPartial && selectedTypes.has('partial')) tagPartial.classList.add('selected');
    if (tagUvv && selectedTypes.has('uvv')) tagUvv.classList.add('selected');
    if (selectedTypes.size > 0 && tagInsp) tagInsp.classList.add('disabled');
  }

  if (inspSelected || selectedTypes.size === 0) {
    if (causesSection) causesSection.classList.add('hidden');
  } else {
    if (causesSection) causesSection.classList.remove('hidden');
    buildCauses();
  }
  updateContinueBtn();
}

function buildCauses() {
  const wrap = document.getElementById('causes-wrap');
  if (!wrap) return;
  const seen = new Set();
  const merged = [];
  ['partial', 'uvv'].forEach((type) => {
    if (selectedTypes.has(type)) {
      (CAUSES[type] || []).forEach((c) => {
        if (!seen.has(c)) {
          seen.add(c);
          merged.push(c);
        }
      });
    }
  });
  const currentlySelected = new Set(
    [...wrap.querySelectorAll('.tag.selected')].map((t) => t.childNodes[0].textContent.trim())
  );
  wrap.innerHTML = merged
    .map(
      (label) =>
        `<div class="tag${currentlySelected.has(label) ? ' selected' : ''}" data-cause>${label} <span class="tag-x">×</span></div>`
    )
    .join('');
  wrap.querySelectorAll('.tag[data-cause]').forEach((el) => {
    el.addEventListener('click', () => toggleCause(el));
  });
}

function toggleDmgType(type) {
  const tag = document.getElementById(`dt-${type === 'inspection' ? 'insp' : type}`);
  if (tag && tag.classList.contains('disabled')) return;

  if (type === 'inspection') {
    if (selectedTypes.has('inspection')) {
      selectedTypes.delete('inspection');
    } else {
      selectedTypes.clear();
      selectedTypes.add('inspection');
    }
  } else {
    if (selectedTypes.has(type)) selectedTypes.delete(type);
    else selectedTypes.add(type);
  }
  funnelState.damage.types = new Set(selectedTypes);
  render();
}

function toggleCause(el) {
  el.classList.toggle('selected');
  updateContinueBtn();
}

function updateContinueBtn() {
  const inspSelected = selectedTypes.has('inspection');
  const causesWrap = document.getElementById('causes-wrap');
  const causesSelected = causesWrap ? causesWrap.querySelectorAll('.tag.selected').length : 0;
  const ready = inspSelected || causesSelected > 0;

  const btn = document.getElementById('btn-continue');
  const hint = document.getElementById('continue-hint');
  if (btn) btn.classList.toggle('on', ready);
  if (hint) {
    if (inspSelected) {
      hint.textContent = t('damage.continueHintReady');
      hint.classList.add('ok');
    } else if (causesSelected > 0) {
      hint.textContent = t('damage.causesSelected', { n: causesSelected });
      hint.classList.add('ok');
    } else {
      hint.textContent =
        selectedTypes.size > 0 ? t('damage.continueHintSelectCause') : t('damage.continueHintSelectType');
      hint.classList.remove('ok');
    }
  }
}

function wirePdfExpandDamage() {
  const btn = document.getElementById('pdf-expand-btn-damage');
  const card = document.getElementById('pdf-card-damage');
  const left = document.getElementById('damage-left');
  if (!btn || !card || !left) return;
  btn.replaceWith(btn.cloneNode(true));
  document.getElementById('pdf-expand-btn-damage').addEventListener('click', () => {
    // On tablet/mobile, treat expand as "close overlay"
    if (window.matchMedia('(max-width: 1023px)').matches) {
      left.classList.remove('active');
      return;
    }
    pdfExpandedDamage = !pdfExpandedDamage;
    card.classList.toggle('expanded', pdfExpandedDamage);
    left.classList.toggle('pdf-expanded', pdfExpandedDamage);
    const b = document.getElementById('pdf-expand-btn-damage');
    if (b) b.classList.toggle('active', pdfExpandedDamage);
  });
}

function wirePdfZoomAndNav() {
  const zoomIn = document.getElementById('pdf-zoom-in');
  const zoomOut = document.getElementById('pdf-zoom-out');
  const navPrev = document.getElementById('pdf-nav-prev');
  const navNext = document.getElementById('pdf-nav-next');
  if (zoomIn) zoomIn.addEventListener('click', () => pdfZoomChange(1));
  if (zoomOut) zoomOut.addEventListener('click', () => pdfZoomChange(-1));
  if (navPrev) navPrev.addEventListener('click', pdfNavPrev);
  if (navNext) navNext.addEventListener('click', pdfNavNext);
  pdfZoomApply();
}

export function wireDamageStep(goToStep) {
  const alertBanner = document.getElementById('alert-banner');
  const alertClose = document.getElementById('alert-close');
  const btnReupload = document.getElementById('btn-reupload');
  const btnContinue = document.getElementById('btn-continue');

  if (alertClose)
    alertClose.addEventListener('click', () => {
      if (alertBanner) alertBanner.style.display = 'none';
    });
  if (btnReupload) btnReupload.addEventListener('click', () => goToStep(1));
  if (btnContinue)
    btnContinue.addEventListener('click', () => {
      if (!btnContinue.classList.contains('on')) return;
      goToStep(3);
    });

  document.querySelectorAll('#dt-partial, #dt-uvv, #dt-insp').forEach((el) => {
    if (!el) return;
    const type = el.getAttribute('data-type');
    if (type) el.addEventListener('click', () => toggleDmgType(type));
  });

  const inspTag = document.getElementById('dt-insp');
  const globalTooltip = document.getElementById('validate-tooltip');
  if (inspTag && globalTooltip) {
    inspTag.addEventListener('mouseenter', (e) => {
      const inspectionTipText = t('damage.inspectionTooltip');
      const rect = e.currentTarget.getBoundingClientRect();
      globalTooltip.textContent = inspectionTipText;
      globalTooltip.style.left = (rect.left + rect.width / 2) + 'px';
      globalTooltip.style.top = (rect.top - 44) + 'px';
      globalTooltip.style.transform = 'translateX(-50%)';
      globalTooltip.classList.add('visible');
    });
    inspTag.addEventListener('mouseleave', () => globalTooltip.classList.remove('visible'));
  }

  if (getPdfDoc()) showLoadedPdfInCurrentCard('pdf-fallback-damage');
  wirePdfZoomAndNav();
  wirePdfExpandDamage();
  const pdfOpenOverlayBtn = document.getElementById('pdf-open-overlay-damage');
  const pdfLeftPanel = document.getElementById('damage-left');
  if (pdfOpenOverlayBtn && pdfLeftPanel) {
    pdfOpenOverlayBtn.addEventListener('click', () => {
      pdfLeftPanel.classList.add('active');
      if (getPdfDoc()) {
        showLoadedPdfInCurrentCard('pdf-fallback-damage');
      }
    });
  }
  render();
}
