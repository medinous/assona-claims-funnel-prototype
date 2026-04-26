/**
 * Step 1 – Upload: idle card, loading preview, agent (PDF + steps).
 * Exports markup and wiring; uses goToStep(2) when flow completes.
 * Icons: Tabler (https://tabler.io/icons)
 * PDF: PDF.js for real rendering; zoom/expand match index_03.
 */

import { funnelState } from './state.js';
import {
  loadPdfFromFile,
  pdfZoomChange,
  pdfZoomApply,
  pdfNavPrev,
  pdfNavNext,
  getPdfExpandSvg,
} from './pdf-viewer.js';
import { t } from './i18n.js';

const PDF_FALLBACK_HTML = `
<div class="pdf-fb-header">
  <div><b class="pdf-fb-label">Bike Shop Berlin</b><br>www.bikeshopberlin.com<br>+49 30 99999999</div>
  <div class="pdf-fb-right">Sonnenallee 221, 12059 Berlin<br>Tax ID: 45DC2200787</div>
</div>
<div class="pdf-fb-parties">
  <span><b class="pdf-fb-label">Firma</b><br>AGL Activ Services GmbH<br>Georgstraße 42, 30159 Hannover</span>
  <span class="pdf-fb-right"><b class="pdf-fb-label">Datum</b><br>20.09.2025<br><b class="pdf-fb-label">Fahrzeug</b><br>E-Bike, 2.900€</span>
</div>
<div class="pdf-fb-invoice-title">Rechnung (#A3452-53)</div>
<div class="pdf-fb-desc">Nutzer in Kurve wegeschlittert und Fahrrad ist seitlich gegen Bordstein gerutscht.</div>
<div class="pdf-fb-meta">Schadennummer: 13876439<br>Assona Versicherungsnummer: 637883873-MAD-4766357</div>
<table class="pdf-fb-table">
  <tr class="pdf-fb-th-row"><th class="pdf-fb-th pdf-fb-th--left">ARTIKEL</th><th class="pdf-fb-th pdf-fb-th--left">BEZEICHNUNG</th><th class="pdf-fb-th">ANZ</th><th class="pdf-fb-th pdf-fb-th--right">EINZELPREIS</th><th class="pdf-fb-th pdf-fb-th--right">GESAMTPREIS</th></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">10045638</td><td class="pdf-fb-td">KETTE CN-M6100 126 GLIED HC 12-FACH</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">49,95€</td><td class="pdf-fb-td pdf-fb-td--right">49,95€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">10045650</td><td class="pdf-fb-td">Kassette SLX CS-M7100 13-fach</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">129,95€</td><td class="pdf-fb-td pdf-fb-td--right">129,95€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">10045725</td><td class="pdf-fb-td">Kettenblatt</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">48,99€</td><td class="pdf-fb-td pdf-fb-td--right">48,99€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">90033352</td><td class="pdf-fb-td">Montage (Kette, Kassette, Kettenblatt)</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">100,00€</td><td class="pdf-fb-td pdf-fb-td--right">100,00€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">10034576</td><td class="pdf-fb-td">Griffe</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">29,95€</td><td class="pdf-fb-td pdf-fb-td--right">29,95€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">90032873</td><td class="pdf-fb-td">Montage Griffe</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">20,00€</td><td class="pdf-fb-td pdf-fb-td--right">20,00€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">90032948</td><td class="pdf-fb-td">Montage Pedale</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">20,00€</td><td class="pdf-fb-td pdf-fb-td--right">20,00€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">10057622</td><td class="pdf-fb-td">Reifen Hinten</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">45,00€</td><td class="pdf-fb-td pdf-fb-td--right">45,00€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">90053175</td><td class="pdf-fb-td">Montage Reifen Hinten</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">50,00€</td><td class="pdf-fb-td pdf-fb-td--right">50,00€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">100399864</td><td class="pdf-fb-td">Bremsscheibe Vorn</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">52,99€</td><td class="pdf-fb-td pdf-fb-td--right">52,99€</td></tr>
  <tr class="pdf-fb-tr"><td class="pdf-fb-td">90053175</td><td class="pdf-fb-td">Montage Bremsscheibe Vorn</td><td class="pdf-fb-td pdf-fb-td--center">1</td><td class="pdf-fb-td pdf-fb-td--right">50,00€</td><td class="pdf-fb-td pdf-fb-td--right">50,00€</td></tr>
</table>
<div class="pdf-fb-totals">
  <div>Gesamt Netto: 677,28€</div><div>MwSt: 19%</div><div><b>Gesamt: 805,98€</b></div>
</div>
<div class="pdf-fb-footer">Bei diesem Einkauf sparen Sie 10,50€.<br>Wir danken für Ihren Auftrag.</div>
`;

export function getStep1Markup() {
  return `
<div class="upload-content" id="upload-idle" style="position:relative">
  <div class="upload-drop-area" id="drop-area"></div>
  <div class="upload-grad"></div>
  <div class="upload-card">
    <div class="upload-header">
      <div class="upload-title">${t('upload.title')}</div>
      <div class="upload-sub">${t('upload.subtitle')}</div>
    </div>
    <div class="upload-zone">
      <button type="button" class="btn-upload" id="btn-upload-step1">
        <i class="ti ti-upload" aria-hidden="true"></i>
        ${t('upload.selectFile')}
      </button>
      <span class="upload-or">${t('upload.or')}</span>
      <span class="upload-drag" id="upload-drag" role="button" tabindex="0">${t('upload.dragDrop')}</span>
    </div>
  </div>
</div>

<div class="upload-preview-loading" id="upload-preview-loading">
  <div class="loading-preview-card">
    <span class="loading-preview-text">${t('upload.loadingPreview')}</span>
    <div class="loading-spinner"></div>
  </div>
</div>

<div class="upload-agent" id="upload-agent">
  <div class="upload-agent-left" id="upload-agent-left">
    <div class="pdf-card" id="pdf-card-upload">
      <div class="pdf-toolbar">
        <div class="pdf-nav">
          <button type="button" class="pdf-nav-btn" id="pdf-nav-prev" aria-label="${t('upload.pdfNavPrev')}">‹</button>
          <button type="button" class="pdf-nav-btn" id="pdf-nav-next" aria-label="${t('upload.pdfNavNext')}">›</button>
          <span class="pdf-page-info">1 / 1</span>
        </div>
        <div class="pdf-toolbar-right">
          <div class="pdf-zoom">
            <button type="button" class="pdf-zoom-btn" id="pdf-zoom-out" title="${t('upload.pdfZoomOut')}">−</button>
            <span id="pdf-zoom-label">100%</span>
            <button type="button" class="pdf-zoom-btn" id="pdf-zoom-in" title="${t('upload.pdfZoomIn')}">+</button>
          </div>
          <div class="pdf-toolbar-divider"></div>
          <button type="button" class="pdf-expand-btn" id="pdf-expand-btn-upload" title="${t('upload.pdfExpand')}" aria-label="${t('upload.pdfExpand')}">
            <svg id="pdf-expand-icon-upload" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 4l4 0l0 4"/><path d="M14 10l6 -6"/><path d="M8 20l-4 0l0 -4"/><path d="M4 20l6 -6"/><path d="M16 20l4 0l0 -4"/><path d="M14 14l6 6"/><path d="M8 4l-4 0l0 4"/><path d="M4 4l6 6"/></svg>
          </button>
        </div>
      </div>
      <div class="pdf-body">
        <div class="pdf-canvas-wrap" id="pdf-canvas-wrap">
          <canvas id="pdf-canvas"></canvas>
        </div>
        <div class="pdf-fallback all-pdf-fallbacks" id="pdf-fallback-upload">${PDF_FALLBACK_HTML}</div>
      </div>
      <div class="pdf-filename">
        <i class="ti ti-file-invoice" aria-hidden="true"></i>
        <span class="pdf-filename-name all-pdf-filenames">Rechnung-003.pdf</span>
        <i class="ti ti-refresh pdf-filename-refresh" aria-hidden="true"></i>
      </div>
    </div>
  </div>
  <div class="upload-agent-right">
    <div class="upload-agent-right-inner">
    <div class="agent-step checking" id="vc-1">
      <div class="agent-step-icon"><span class="agent-chevron">›</span></div>
      <span>${t('upload.agentAnalyzing')}</span>
    </div>
    <div class="agent-step pending" id="vc-2">
      <div class="agent-step-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#d4d9d4" stroke-width="1.8"/></svg></div>
      <span>${t('upload.agentExtract')}</span>
    </div>
    <div class="agent-step pending" id="vc-3">
      <div class="agent-step-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#d4d9d4" stroke-width="1.8"/></svg></div>
      <span>${t('upload.agentFrame')}</span>
    </div>
    <div class="agent-step pending" id="vc-4">
      <div class="agent-step-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#d4d9d4" stroke-width="1.8"/></svg></div>
      <span>${t('upload.agentAddress')}</span>
    </div>
    </div>
  </div>
</div>
`;
}

let agentAnimating = false;

function setStepChecking(id, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'agent-step checking';
  el.innerHTML = `<div class="agent-step-icon"><span class="agent-chevron">›</span></div><span>${label}</span>`;
}

function setStepDone(id, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'agent-step done';
  el.innerHTML = `<div class="agent-step-icon"><i class="ti ti-check" style="color:var(--s600);font-size:18px" aria-hidden="true"></i></div><span>${label}</span>`;
}

function setStepPending(id, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'agent-step pending';
  el.innerHTML = `<div class="agent-step-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#d4d9d4" stroke-width="1.8"/></svg></div><span>${label}</span>`;
}

export function wireUploadStep(goToStep) {
  const input = document.getElementById('pdf-file-input');
  const idle = document.getElementById('upload-idle');
  const loading = document.getElementById('upload-preview-loading');
  const agent = document.getElementById('upload-agent');
  const overlay = document.getElementById('pdf-error-overlay');
  const btnUpload = document.getElementById('btn-upload-step1');
  const dragEl = document.getElementById('upload-drag');
  const dropArea = document.getElementById('drop-area');

  if (!input || !idle || !loading || !agent) return;

  function triggerFileInput() {
    input.click();
  }

  function showPdfError() {
    const idleEl = document.getElementById('upload-idle');
    const loadingEl = document.getElementById('upload-preview-loading');
    const agentEl = document.getElementById('upload-agent');
    if (idleEl) idleEl.style.display = '';
    if (loadingEl) loadingEl.classList.remove('active');
    if (agentEl) agentEl.classList.remove('active');
    if (overlay) overlay.classList.add('open');
  }

  function closePdfError() {
    if (overlay) overlay.classList.remove('open');
  }

  function skipToManual() {
    closePdfError();
    goToStep(2);
  }

  function handleFileSelected(fileInput) {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      showPdfError();
      fileInput.value = '';
      return;
    }

    const fname = file.name;
    funnelState.upload.pdfName = fname;
    document.querySelectorAll('.all-pdf-filenames').forEach((el) => { el.textContent = fname; });
    document.querySelectorAll('.all-alert-filenames').forEach((el) => { el.textContent = fname; });
    fileInput.value = '';

    // Always use current DOM elements (in case step was re-rendered)
    const idleEl = document.getElementById('upload-idle');
    const loadingEl = document.getElementById('upload-preview-loading');
    const agentEl = document.getElementById('upload-agent');
    if (!idleEl || !loadingEl || !agentEl) return;

    idleEl.style.display = 'none';
    loadingEl.classList.add('active');
    agentEl.classList.remove('active');

    setTimeout(() => {
      const loadingNow = document.getElementById('upload-preview-loading');
      const agentNow = document.getElementById('upload-agent');
      if (loadingNow) loadingNow.classList.remove('active');
      if (agentNow) agentNow.classList.add('active');
      loadPdfFromFile(file, { fallbackSelector: '#pdf-fallback-upload' }).catch((err) => {
        console.warn('PDF load failed, showing fallback:', err);
      });
      pdfZoomApply();
      startAgentAnim(goToStep);
    }, 1400);
  }

  if (btnUpload) btnUpload.addEventListener('click', triggerFileInput);
  if (dragEl) {
    dragEl.addEventListener('click', triggerFileInput);
    dragEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerFileInput(); } });
  }

  input.onchange = function () {
    handleFileSelected(this);
  };

  if (dropArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((ev) => {
      dropArea.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (ev === 'dragenter' || ev === 'dragover') dropArea.classList.add('drag');
        else dropArea.classList.remove('drag');
        if (ev === 'drop') {
          const file = e.dataTransfer && e.dataTransfer.files[0];
          if (file) {
            const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
            if (!isPdf) { showPdfError(); return; }
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
            handleFileSelected(input);
          }
        }
      });
    });
  }

  const closeBtn = overlay && overlay.querySelector('.pdf-error-close');
  if (closeBtn) closeBtn.addEventListener('click', closePdfError);
  const btnSecondary = overlay && overlay.querySelector('.pdf-error-btn-secondary');
  if (btnSecondary) btnSecondary.addEventListener('click', () => { closePdfError(); triggerFileInput(); });
  const btnPrimary = overlay && overlay.querySelector('.pdf-error-btn-primary');
  if (btnPrimary) btnPrimary.addEventListener('click', skipToManual);

  wirePdfExpandUpload();
  wirePdfZoomAndNav();
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

let pdfExpandedUpload = false;

function togglePdfExpandUpload() {
  pdfExpandedUpload = !pdfExpandedUpload;
  const card = document.getElementById('pdf-card-upload');
  const left = document.getElementById('upload-agent-left');
  const btn = document.getElementById('pdf-expand-btn-upload');
  const icon = document.getElementById('pdf-expand-icon-upload');
  if (!card || !left || !btn) return;

  card.classList.toggle('expanded', pdfExpandedUpload);
  left.classList.toggle('pdf-expanded', pdfExpandedUpload);
  btn.classList.toggle('active', pdfExpandedUpload);
  btn.title = pdfExpandedUpload ? t('upload.pdfShrink') : t('upload.pdfExpand');

  if (icon) {
    icon.outerHTML = getPdfExpandSvg(pdfExpandedUpload, 'pdf-expand-icon-upload');
  }
}

function wirePdfExpandUpload() {
  const btn = document.getElementById('pdf-expand-btn-upload');
  if (!btn) return;
  btn.replaceWith(btn.cloneNode(true));
  document.getElementById('pdf-expand-btn-upload').addEventListener('click', togglePdfExpandUpload);
}

function startAgentAnim(goToStep) {
  if (agentAnimating) return;
  agentAnimating = true;

  const steps = [
    { id: 'vc-1', activeLabel: t('upload.agentAnalyzing'), doneLabel: t('upload.agentAnalyzed') },
    { id: 'vc-2', activeLabel: t('upload.agentExtracting'), doneLabel: t('upload.agentExtracted') },
    { id: 'vc-3', activeLabel: t('upload.agentFrameChecking'), doneLabel: t('upload.agentFrameDone') },
    { id: 'vc-4', activeLabel: t('upload.agentAddressChecking'), doneLabel: t('upload.agentAddressDone') },
  ];

  setStepPending('vc-1', t('upload.agentAnalyzing'));
  setStepPending('vc-2', t('upload.agentExtract'));
  setStepPending('vc-3', t('upload.agentFrame'));
  setStepPending('vc-4', t('upload.agentAddress'));

  const delays = [0, 1300, 2500, 3600];
  steps.forEach((s, i) => {
    setTimeout(() => {
      if (i > 0) setStepDone(steps[i - 1].id, steps[i - 1].doneLabel);
      setStepChecking(s.id, s.activeLabel);
    }, delays[i]);
  });

  setTimeout(() => {
    setStepDone('vc-4', t('upload.agentAddressDone'));
    setTimeout(() => {
      agentAnimating = false;
      goToStep(2);
    }, 800);
  }, 4800);
}
