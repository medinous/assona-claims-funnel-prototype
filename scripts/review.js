/**
 * Step 4 – Review & Submit
 * Left: read-only table. Right: invoice details panel. Footer: confirm checkbox + Fertig button.
 * Modals: Submit confirmation (notes, upload), Success.
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
import { showHome } from './auth.js';
import { t } from './i18n.js';

const REVIEW_ITEMS = [
  { name: 'Campagnolo Record 12-fach 11-12-13-14-15-16-17-18-19-21-23 Zähne', cause: 'Abnutzung, Verschleiss', part: 'Antrieb', type: null, qty: '1', net: '44,12 EUR', gross: '52,50 EUR' },
  { name: 'Kette CN-M9100 126 Glieder HG 12-fach M. Quick-Link', cause: 'Abnutzung, Verschleiss', part: 'Antrieb', type: null, qty: '1', net: '41,97 EUR', gross: '49,95 EUR' },
  { name: 'Kassette SLX CS-M7100 10-fach', cause: 'Sturz / Unfall', part: 'Antrieb', type: null, qty: '1', net: '109,20 EUR', gross: '129,95 EUR' },
  { name: 'Montage (Kette, Kassette, Kettenschaltung)', cause: 'Sturz / Unfall', part: 'Antrieb', type: null, qty: '1', net: '159,66 EUR', gross: '190,00 EUR' },
  { name: 'Griffe', cause: 'Abnutzung, Verschleiss', part: 'Lenker', type: null, qty: '1', net: '24,33 EUR', gross: '28,95 EUR' },
  { name: 'Montage Griffe', cause: 'Abnutzung, Verschleiss', part: 'Lenker', type: null, qty: '1', net: '16,81 EUR', gross: '20,00 EUR' },
  { name: 'Pedale', cause: 'Sturz / Unfall', part: 'Antrieb', type: null, qty: '1', net: '25,17 EUR', gross: '29,95 EUR' },
  { name: 'Montage Pedale', cause: 'Sturz / Unfall', part: 'Antrieb', type: null, qty: '1', net: '16,81 EUR', gross: '20,00 EUR' },
  { name: 'Reifen Hinten', cause: 'Sturz / Unfall', part: 'Laufrad', type: 'HR', qty: '1', net: '37,82 EUR', gross: '45,00 EUR' },
  { name: 'Montage Reifen Hinten', cause: 'Sturz / Unfall', part: 'Laufrad', type: 'HR', qty: '1', net: '42,02 EUR', gross: '50,00 EUR' },
  { name: 'Bremsscheibe Vorn', cause: 'Abnutzung, Verschleiss', part: 'Bremse', type: 'VR', qty: '1', net: '44,53 EUR', gross: '52,99 EUR' },
  { name: 'Montage Bremsscheibe Vorn', cause: 'Abnutzung, Verschleiss', part: 'Bremse', type: 'VR', qty: '1', net: '42,02 EUR', gross: '50,00 EUR' },
];

const CLAIM_ID = 'CLM-12345';
let submitCheckboxChecked = false;
let mediaError = false;
let mediaCount = 0;

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function getStep4Markup() {
  const filename = funnelState.upload?.pdfName || 'Rechnung-003.pdf';
  const totals = funnelState.review?.totals || {
    net: '677,28 EUR',
    taxRate: '19,00 %',
    gross: '805,69 EUR',
    taxAmount: '128,41 EUR',
  };

  const rowsHtml = REVIEW_ITEMS.map(item => `
    <tr class="review-tr">
      <td class="review-td review-td--name">${escHtml(item.name)}</td>
      <td class="review-td review-td--cause">${escHtml(item.cause)}</td>
      <td class="review-td review-td--component">${escHtml(item.part)}</td>
      <td class="review-td review-td--type">${item.type ? escHtml(item.type) : '<span class="review-type-none">—</span>'}</td>
      <td class="review-td review-td--qty">${escHtml(String(item.qty))}</td>
      <td class="review-td review-td--net">${escHtml(item.net)}</td>
      <td class="review-td review-td--gross">${escHtml(item.gross)}</td>
    </tr>
  `).join('');

  return `
<div class="review-content">

  <div class="review-main">

    <div class="review-table-panel">
      <div class="review-table-title-row">
        <span class="review-table-title">${REVIEW_ITEMS.length} ${t('review.itemsCount')}</span>
      </div>
      <div class="review-table-wrap">
        <table class="review-table" role="grid">
          <thead>
            <tr class="review-thead-row">
              <th class="review-th review-th--name">Item Name</th>
              <th class="review-th review-th--cause">Damage Cause</th>
              <th class="review-th review-th--component">Component</th>
              <th class="review-th review-th--type">Type</th>
              <th class="review-th review-th--qty">Quantity</th>
              <th class="review-th review-th--net">Net Amount</th>
              <th class="review-th review-th--gross">Gross Amount</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </div>

    <div class="review-details-panel">
      <div class="review-details-inner">
        <div class="review-details-title-row">
          <h2 class="review-details-title">${t('review.invoiceData')}</h2>
        </div>
        <div class="review-details-form">
          <div class="review-detail-row">
            <span class="review-detail-label">${t('review.frameNumber')}</span>
            <span class="review-detail-value">00RDLS98221</span>
          </div>
          <div class="review-detail-row">
            <span class="review-detail-label">${t('review.invoiceDate')}</span>
            <span class="review-detail-value">20.09.2025</span>
          </div>
          <div class="review-detail-row">
            <span class="review-detail-label">${t('review.damageDate')}</span>
            <span class="review-detail-value">18.09.2025</span>
          </div>
          <div class="review-detail-row review-detail-row--desc">
            <span class="review-detail-label">${t('review.description')}</span>
            <span class="review-detail-value">Lenker gebrochen nach Sturz durch verklemmte Kette</span>
          </div>
          <div class="review-detail-row">
            <span class="review-detail-label">${t('review.netAmount')}</span>
            <span class="review-detail-value">${escHtml(totals.net)}</span>
          </div>
          <div class="review-detail-row">
            <span class="review-detail-label">${t('review.vatRate')}</span>
            <span class="review-detail-value">${escHtml(totals.taxRate)}</span>
          </div>
          <div class="review-detail-row review-detail-row--total">
            <span class="review-detail-label">${t('review.grossAmount')}</span>
            <span class="review-detail-value">${escHtml(totals.gross)}</span>
          </div>
        </div>
        <button type="button" class="btn-view-pdf" id="btn-view-pdf-review">
          <i class="ti ti-eye" aria-hidden="true"></i>
          <span>${t('val.viewPdf')}</span>
        </button>
      </div>
    </div>

  </div>

  <div class="review-footer">
    <button type="button" class="btn-back" id="review-btn-back">
      <i class="ti ti-arrow-left" aria-hidden="true"></i>
      ${t('review.back')}
    </button>
    <div class="review-footer-right">
      <div class="review-confirm-row" id="review-confirm-row">
        <div class="review-confirm-box" id="review-confirm-box" aria-hidden="true"></div>
        <span class="review-confirm-label">${t('review.confirmCheckbox')}</span>
      </div>
      <button type="button" class="btn-fertig" id="btn-open-submit-modal">
        ${t('review.send')} <i class="ti ti-check" aria-hidden="true"></i>
      </button>
    </div>
  </div>

  <div class="confirm-overlay" id="overlay-back-review">
    <div class="confirm-modal" role="dialog" aria-labelledby="confirm-back-review-title">
      <div class="confirm-modal-header">
        <div class="confirm-modal-title" id="confirm-back-review-title">${t('review.modalLeaveTitle')}</div>
      </div>
      <div class="confirm-modal-body"><p>${t('review.modalLeaveBody')}</p></div>
      <div class="confirm-modal-footer">
        <button type="button" class="confirm-btn-secondary" id="btn-back-cancel-review">${t('review.modalStay')}</button>
        <button type="button" class="confirm-btn-primary" id="btn-back-confirm-review">${t('review.modalBack')}</button>
      </div>
    </div>
  </div>

</div>

<div class="review-pdf-overlay" id="review-pdf-overlay">
  <div class="review-pdf-overlay-inner">
    <div class="pdf-card" id="pdf-card-review">
      <div class="pdf-toolbar">
        <div class="pdf-nav">
          <button type="button" class="pdf-nav-btn" id="pdf-nav-prev" aria-label="${t('review.pdfNavPrevAria')}">‹</button>
          <button type="button" class="pdf-nav-btn" id="pdf-nav-next" aria-label="${t('review.pdfNavNextAria')}">›</button>
          <span class="pdf-page-info" id="pdf-page-info">1 / 1</span>
        </div>
        <div class="pdf-toolbar-right">
          <div class="pdf-zoom">
            <button type="button" class="pdf-zoom-btn" id="pdf-zoom-out" title="${t('review.zoomOutTitle')}">−</button>
            <span id="pdf-zoom-label">100%</span>
            <button type="button" class="pdf-zoom-btn" id="pdf-zoom-in" title="${t('review.zoomInTitle')}">+</button>
          </div>
          <div class="pdf-toolbar-divider"></div>
          <button type="button" class="pdf-expand-btn" id="pdf-close-btn-review" title="${t('review.closeAria')}" aria-label="${t('review.closeAria')}">
            <i class="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="pdf-body">
        <div class="pdf-canvas-wrap" id="pdf-canvas-wrap">
          <canvas id="pdf-canvas"></canvas>
        </div>
        <div class="pdf-fallback" id="pdf-fallback-review">${t('review.noPdfLoaded')}</div>
      </div>
      <div class="pdf-filename">
        <i class="ti ti-file-invoice" aria-hidden="true"></i>
        <span class="pdf-filename-name">${escHtml(filename)}</span>
      </div>
    </div>
  </div>
</div>

<div class="review-overlay" id="overlay-submit">
  <div class="review-modal-popover" id="modal-submit" role="dialog" aria-labelledby="modal-submit-title">
    <div class="review-modal-header">
      <div class="review-modal-title" id="modal-submit-title">${t('review.submitModalTitle')}</div>
      <button type="button" class="review-modal-close-btn" id="close-submit-modal" aria-label="${t('review.closeAria')}"><i class="ti ti-x" aria-hidden="true"></i></button>
    </div>
    <div class="review-modal-body">
      <div>
        <div class="field-label">${t('review.additionalNotes')}</div>
        <textarea class="field-textarea" id="modal-comments" placeholder="${t('review.notesPlaceholder')}"></textarea>
      </div>
      <div class="review-upload-row">
        <div class="review-upload-row-text">
          <div class="review-upload-row-title">${t('review.mediaUpload')}</div>
          <div class="review-upload-row-sub" id="review-upload-sub">${t('review.mediaUploadSub')}</div>
        </div>
        <button type="button" class="btn-upload-media" id="btn-upload-media"><i class="ti ti-upload" aria-hidden="true"></i> ${t('review.uploadBtn')}</button>
      </div>
      <div class="review-media-list" id="review-media-list" aria-label="${t('review.mediaListAria')}"></div>
      <p class="review-media-error" id="review-media-error"></p>
    </div>
    <div class="review-modal-footer">
      <button type="button" class="btn-not-yet" id="btn-not-yet">${t('review.notYet')}</button>
      <button type="button" class="btn-submit-final active" id="btn-submit-final">
        <span id="submit-btn-label">${t('review.send')}</span>
        <i class="ti ti-send" id="submit-send-icon" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</div>

<div class="review-overlay" id="overlay-success">
  <div class="review-modal-success" role="dialog" aria-labelledby="success-title">
    <div class="review-success-confetti"></div>
    <div class="review-success-body">
      <div class="review-success-icon-wrap"><i class="ti ti-circle-check review-success-icon" aria-hidden="true"></i></div>
      <div class="review-success-title" id="success-title">${t('review.successTitle')}</div>
      <div class="review-success-subtitle">${t('review.successSubtitle')}</div>
      <div class="review-success-id-chip"><i class="ti ti-id" aria-hidden="true"></i> ${t('review.claimNumberLabel')} <strong>${escHtml(CLAIM_ID)}</strong></div>
      <div class="review-success-actions">
        <button type="button" class="btn-success-primary" id="btn-go-home">${t('review.goHome')}</button>
      </div>
    </div>
  </div>
</div>`;
}

function openSubmitModal() {
  submitCheckboxChecked = true;
  updateSubmitButton();
  document.getElementById('overlay-submit')?.classList.add('visible');
}
function closeSubmitModal() {
  document.getElementById('overlay-submit')?.classList.remove('visible');
}
function closeSuccessModal() {
  document.getElementById('overlay-success')?.classList.remove('visible');
}

function updateSubmitButton() {
  const btn = document.getElementById('btn-submit-final');
  if (!btn) return;
  const canSubmit = submitCheckboxChecked && !mediaError;
  btn.classList.toggle('active', canSubmit);
  btn.disabled = !canSubmit;
}

function setMediaError(message) {
  const el = document.getElementById('review-media-error');
  mediaError = !!message;
  if (el) {
    el.textContent = message || '';
    el.style.display = message ? 'block' : 'none';
  }
  updateSubmitButton();
}

function updateMediaDescription() {
  const sub = document.getElementById('review-upload-sub');
  if (!sub) return;
  sub.textContent = mediaCount > 0
    ? t('review.mediaUploadedCount', { n: mediaCount })
    : t('review.mediaUploadSub');
}

function triggerSubmit() {
  const btn = document.getElementById('btn-submit-final');
  if (!btn || !btn.classList.contains('active')) return;
  const label = document.getElementById('submit-btn-label');
  const sendIcon = document.getElementById('submit-send-icon');
  btn.disabled = true;
  if (label) label.textContent = t('review.sending');
  if (sendIcon) sendIcon.style.display = 'none';
  const spinner = document.createElement('div');
  spinner.className = 'review-spinner';
  spinner.setAttribute('aria-hidden', 'true');
  btn.appendChild(spinner);

  setTimeout(() => {
    closeSubmitModal();
    setTimeout(() => {
      const overlay = document.getElementById('overlay-success');
      if (overlay) overlay.classList.add('visible');
      if (typeof window.confetti === 'function') {
        window.confetti({ particleCount: 160, spread: 90, startVelocity: 45, scalar: 0.9, origin: { y: 0.4 } });
      }
    }, 200);
    if (label) label.textContent = t('review.send');
    if (sendIcon) sendIcon.style.display = '';
    if (btn.contains(spinner)) btn.removeChild(spinner);
    btn.disabled = false;
    submitCheckboxChecked = false;
    mediaError = false;
    mediaCount = 0;
    updateMediaDescription();
    updateSubmitButton();
  }, 1600);
}

export function wireReviewStep(goToStep) {
  // PDF zoom/nav
  if (getPdfDoc()) showLoadedPdfInCurrentCard('pdf-fallback-review');
  const zoomIn  = document.getElementById('pdf-zoom-in');
  const zoomOut = document.getElementById('pdf-zoom-out');
  const navPrev = document.getElementById('pdf-nav-prev');
  const navNext = document.getElementById('pdf-nav-next');
  if (zoomIn)  zoomIn.addEventListener('click', () => pdfZoomChange(1));
  if (zoomOut) zoomOut.addEventListener('click', () => pdfZoomChange(-1));
  if (navPrev) navPrev.addEventListener('click', pdfNavPrev);
  if (navNext) navNext.addEventListener('click', pdfNavNext);
  pdfZoomApply();

  // PDF overlay open / close
  const btnViewPdf  = document.getElementById('btn-view-pdf-review');
  const pdfOverlay  = document.getElementById('review-pdf-overlay');
  const btnClosePdf = document.getElementById('pdf-close-btn-review');
  if (btnViewPdf && pdfOverlay) {
    btnViewPdf.addEventListener('click', () => {
      pdfOverlay.classList.add('visible');
      if (getPdfDoc()) showLoadedPdfInCurrentCard('pdf-fallback-review');
    });
  }
  if (btnClosePdf && pdfOverlay) {
    btnClosePdf.addEventListener('click', () => pdfOverlay.classList.remove('visible'));
  }

  // Footer confirmation checkbox
  let confirmChecked = false;
  const confirmRow = document.getElementById('review-confirm-row');
  const confirmBox = document.getElementById('review-confirm-box');
  const btnFertig  = document.getElementById('btn-open-submit-modal');

  function updateFertig() {
    if (btnFertig) btnFertig.classList.toggle('active', confirmChecked);
  }

  if (confirmRow) {
    confirmRow.addEventListener('click', () => {
      confirmChecked = !confirmChecked;
      if (confirmBox) {
        confirmBox.classList.toggle('checked', confirmChecked);
        confirmBox.innerHTML = confirmChecked
          ? '<i class="ti ti-check" style="font-size:12px;color:var(--n1000)" aria-hidden="true"></i>'
          : '';
      }
      updateFertig();
    });
  }

  if (btnFertig) {
    btnFertig.addEventListener('click', () => {
      if (confirmChecked) openSubmitModal();
    });
  }

  // Back
  const btnBack     = document.getElementById('review-btn-back');
  const backOverlay = document.getElementById('overlay-back-review');
  const backCancel  = document.getElementById('btn-back-cancel-review');
  const backConfirm = document.getElementById('btn-back-confirm-review');
  if (btnBack && backOverlay)   btnBack.addEventListener('click', () => backOverlay.classList.add('visible'));
  if (backCancel && backOverlay) backCancel.addEventListener('click', () => backOverlay.classList.remove('visible'));
  if (backConfirm && backOverlay) {
    backConfirm.addEventListener('click', () => { backOverlay.classList.remove('visible'); goToStep(3); });
  }
  if (backOverlay) backOverlay.addEventListener('click', (e) => { if (e.target === backOverlay) backOverlay.classList.remove('visible'); });

  // Submit modal
  document.getElementById('close-submit-modal')?.addEventListener('click', closeSubmitModal);
  document.getElementById('btn-not-yet')?.addEventListener('click', closeSubmitModal);
  document.getElementById('btn-submit-final')?.addEventListener('click', triggerSubmit);

  // Media upload
  const btnUpload = document.getElementById('btn-upload-media');
  if (btnUpload) {
    btnUpload.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*,video/*';
      input.onchange = () => {
        const files = input.files;
        const list = document.getElementById('review-media-list');
        if (!files || !files.length || !list) return;
        const existing = list.querySelectorAll('.review-media-item').length;
        const max = 9;
        if (existing >= max) { setMediaError(t('review.mediaMaxError')); return; }
        const remaining = max - existing;
        const incoming = Array.from(files);
        if (incoming.length > remaining) setMediaError(t('review.mediaMaxError'));
        else setMediaError('');
        incoming.slice(0, remaining).forEach(file => {
          if (file.type && file.type.startsWith('image/')) {
            const reader = new FileReader();
            const item = document.createElement('div');
            item.className = 'review-media-item loading';
            const spinner = document.createElement('div');
            spinner.className = 'review-media-spinner';
            item.appendChild(spinner);
            list.appendChild(item);
            reader.onload = (e) => {
              item.classList.remove('loading');
              item.innerHTML = '';
              const img = document.createElement('img');
              img.className = 'review-media-thumb';
              img.src = String(e.target?.result || '');
              img.alt = file.name || 'Uploaded image';
              item.appendChild(img);
            };
            reader.readAsDataURL(file);
            mediaCount += 1;
          }
        });
        updateMediaDescription();
      };
      input.click();
    });
  }

  document.getElementById('overlay-submit')?.addEventListener('click', (e) => {
    if (e.target.id === 'overlay-submit') closeSubmitModal();
  });
  document.getElementById('overlay-success')?.addEventListener('click', (e) => {
    if (e.target.id === 'overlay-success') closeSuccessModal();
  });

  document.getElementById('btn-go-home')?.addEventListener('click', () => {
    closeSuccessModal();
    showHome();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSubmitModal();
      closeSuccessModal();
      if (pdfOverlay) pdfOverlay.classList.remove('visible');
    }
  });

  updateFertig();
}
