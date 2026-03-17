/**
 * Step 4 – Review & Submit
 * Left: PDF viewer. Right: review summary card (invoice data, items accordion, total), footer.
 * Modals: Submit confirmation (comments, upload, checkbox), Success.
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
import { showHome } from './auth.js';
import { t } from './i18n.js';

const REVIEW_ITEMS = [
  { name: 'Campagnolo Record 12-fach 11-12-13-14-15-16-17-18-19-21-23 Zähne', price: '52,50 EUR', cause: 'Abnutzung, Verschleiss', part: 'Antrieb', qty: '1', net: '44,12 EUR', vat: '19,00 %', gross: '52,50 EUR' },
  { name: 'Kette CN-M9100 126 Glieder HG 12-fach M. Quick-Link', price: '49,95 EUR', cause: 'Abnutzung, Verschleiss', part: 'Antrieb', qty: '1', net: '41,97 EUR', vat: '19,00 %', gross: '49,95 EUR' },
  { name: 'Kassette SLX CS-M7100 10-fach', price: '129,95 EUR', cause: 'Sturz / Unfall', part: 'Antrieb', qty: '1', net: '109,20 EUR', vat: '19,00 %', gross: '129,95 EUR' },
  { name: 'Montage (Kette, Kassette, Kettenschaltung)', price: '190,00 EUR', cause: 'Sturz / Unfall', part: 'Antrieb', qty: '1', net: '159,66 EUR', vat: '19,00 %', gross: '190,00 EUR' },
  { name: 'Griffe', price: '28,95 EUR', cause: 'Abnutzung, Verschleiss', part: 'Lenker', qty: '1', net: '24,33 EUR', vat: '19,00 %', gross: '28,95 EUR' },
  { name: 'Montage Griffe', price: '20,00 EUR', cause: 'Abnutzung, Verschleiss', part: 'Lenker', qty: '1', net: '16,81 EUR', vat: '19,00 %', gross: '20,00 EUR' },
  { name: 'Pedale', price: '29,95 EUR', cause: 'Sturz / Unfall', part: 'Antrieb', qty: '1', net: '25,17 EUR', vat: '19,00 %', gross: '29,95 EUR' },
  { name: 'Montage Pedale', price: '20,00 EUR', cause: 'Sturz / Unfall', part: 'Antrieb', qty: '1', net: '16,81 EUR', vat: '19,00 %', gross: '20,00 EUR' },
  { name: 'Reifen Hinten', price: '45,00 EUR', cause: 'Sturz / Unfall', part: 'Laufrad', qty: '1', net: '37,82 EUR', vat: '19,00 %', gross: '45,00 EUR' },
  { name: 'Montage Reifen Hinten', price: '50,00 EUR', cause: 'Sturz / Unfall', part: 'Laufrad', qty: '1', net: '42,02 EUR', vat: '19,00 %', gross: '50,00 EUR' },
  { name: 'Bremsscheibe Vorn', price: '52,99 EUR', cause: 'Abnutzung, Verschleiss', part: 'Bremse', qty: '1', net: '44,53 EUR', vat: '19,00 %', gross: '52,99 EUR' },
  { name: 'Montage Bremsscheibe Vorn', price: '50,00 EUR', cause: 'Abnutzung, Verschleiss', part: 'Bremse', qty: '1', net: '42,02 EUR', vat: '19,00 %', gross: '50,00 EUR' },
];

const CLAIM_ID = 'CLM-12345';
let pdfExpandedReview = false;
let submitCheckboxChecked = false;
let mediaError = false;
let mediaCount = 0;

function parseDE(str) {
  const cleaned = String(str || '').replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
function formatDE(num) {
  return Number(num || 0).toFixed(2).replace('.', ',');
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function getStep4Markup() {
  const filename = funnelState.upload?.pdfName || 'Rechnung-003.pdf';
  const itemsHtml = REVIEW_ITEMS.map(
    (item) => `
    <div class="review-accordion-item" data-review-item>
      <div class="review-accordion-header">
        <span class="review-accordion-label">${escHtml(item.name)}</span>
        <div class="review-accordion-right">
          <span class="review-accordion-price">${escHtml(item.price)}</span>
          <span class="review-accordion-chevron"><i class="ti ti-chevron-right" aria-hidden="true"></i></span>
        </div>
      </div>
      <div class="review-accordion-body">
        <div class="review-accordion-detail-row"><span class="review-accordion-detail-label">${t('review.causeLabel')}</span><span class="review-accordion-detail-value">${escHtml(item.cause)}</span></div>
        <div class="review-accordion-detail-row"><span class="review-accordion-detail-label">${t('review.bauteilLabel')}</span><span class="review-accordion-detail-value">${escHtml(item.part)}</span></div>
        <div class="review-accordion-detail-row"><span class="review-accordion-detail-label">${t('review.quantity')}</span><span class="review-accordion-detail-value">${escHtml(item.qty)}</span></div>
        <div class="review-accordion-detail-row"><span class="review-accordion-detail-label">${t('review.netAmount')}</span><span class="review-accordion-detail-value">${escHtml(item.net)}</span></div>
        <div class="review-accordion-detail-row"><span class="review-accordion-detail-label">${t('review.vatRate')}</span><span class="review-accordion-detail-value">${escHtml(item.vat)}</span></div>
        <div class="review-accordion-detail-row"><span class="review-accordion-detail-label">${t('review.grossAmount')}</span><span class="review-accordion-detail-value">${escHtml(item.gross)}</span></div>
      </div>
    </div>`
  ).join('');

  return `
<div class="review-content">
  <div class="review-left" id="review-left">
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
          <button type="button" class="pdf-expand-btn" id="pdf-expand-btn-review" title="${t('review.closeAria')}" aria-label="${t('review.closeAria')}">
            <span id="pdf-expand-icon-review" aria-hidden="true"></span>
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
  <div class="review-right" id="review-right">
    <div class="review-right-inner">
        <button type="button" class="pdf-trigger-bar" id="pdf-open-overlay-review">
          <span>${t('review.pdfTrigger')}</span>
          <i class="ti ti-eye-check pdf-trigger-bar-icon" aria-hidden="true"></i>
        </button>
        <div class="review-card">
        <div class="review-card-header">
          <div class="review-claim-id">${escHtml(CLAIM_ID)}</div>
          <div class="review-title">${t('review.title')}</div>
          <div class="review-subtitle">${t('review.subtitle')}</div>
        </div>
        <div class="review-card-body">
          <div class="summary-section">
            <div class="section-row-head">
              <span class="section-row-title">${t('review.invoiceData')}</span>
              <button type="button" class="section-edit-btn" title="${t('review.editInvoiceData')}" data-edit="invoice"><i class="ti ti-pencil" aria-hidden="true"></i></button>
            </div>
            <div class="data-rows">
              <div class="data-row"><span class="data-label">${t('review.frameNumber')}</span><span class="data-value">00RDLS98221</span></div>
              <div class="data-row"><span class="data-label">${t('review.invoiceDate')}</span><span class="data-value">20/09/2025</span></div>
              <div class="data-row"><span class="data-label">${t('review.damageDate')}</span><span class="data-value">18/09/2025</span></div>
              <div class="data-row description"><span class="data-label">${t('review.description')}</span><span class="data-value">Lenker gebrochen nach Sturz durch verklemmte Kette</span></div>
            </div>
          </div>
          <div class="summary-section">
            <div class="section-row-head">
              <span class="section-row-title">${REVIEW_ITEMS.length} ${t('review.itemsCount')}</span>
              <button type="button" class="section-edit-btn" title="${t('review.editItems')}" data-edit="items"><i class="ti ti-pencil" aria-hidden="true"></i></button>
            </div>
            <div class="review-accordion-list" id="review-accordion-list">${itemsHtml}</div>
          </div>
          <div class="summary-section">
            <div class="section-row-head">
              <span class="section-row-title">${t('review.totalAmount')}</span>
              <button type="button" class="section-edit-btn" title="${t('review.editTotal')}" data-edit="total"><i class="ti ti-pencil" aria-hidden="true"></i></button>
            </div>
            <div class="data-rows">
              <div class="total-row"><span class="total-label">${t('review.netAmount')}</span><span class="total-value" id="review-total-net">677,28 EUR</span></div>
              <div class="total-row"><span class="total-label">${t('review.vatRate')}</span><span class="total-value" id="review-total-tax">19,00 %</span></div>
              <div class="total-row gross"><span class="total-label">${t('review.grossAmount')}</span><span class="total-value" id="review-total-gross">805,69 EUR</span></div>
            </div>
          </div>
        </div>
        </div>
        <div class="review-footer-inline">
          <button type="button" class="btn-back" id="review-btn-back">${t('review.back')}</button>
          <button type="button" class="btn-submit-main" id="btn-open-submit-modal">${t('review.submitToAssona')}</button>
        </div>
      </div>
  </div>
</div>

<div class="confirm-overlay" id="overlay-back-review">
  <div class="confirm-modal" role="dialog" aria-labelledby="confirm-back-review-title">
    <div class="confirm-modal-header">
      <div class="confirm-modal-title" id="confirm-back-review-title">${t('review.modalLeaveTitle')}</div>
    </div>
    <div class="confirm-modal-body">
      <p>${t('review.modalLeaveBody')}</p>
    </div>
    <div class="confirm-modal-footer">
      <button type="button" class="confirm-btn-secondary" id="btn-back-cancel-review">${t('review.modalStay')}</button>
      <button type="button" class="confirm-btn-primary" id="btn-back-confirm-review">${t('review.modalBack')}</button>
    </div>
  </div>
</div>

<!-- Submit confirmation overlay -->
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
      <div class="review-checkbox-row" id="checkbox-row">
        <div class="review-checkbox-box" id="checkbox-box" aria-hidden="true"></div>
        <span class="review-checkbox-label">${t('review.confirmCheckbox')}</span>
      </div>
      <p class="review-media-error" id="review-media-error"></p>
    </div>
    <div class="review-modal-footer">
      <button type="button" class="btn-not-yet" id="btn-not-yet">${t('review.notYet')}</button>
      <button type="button" class="btn-submit-final" id="btn-submit-final" disabled>
        <span id="submit-btn-label">${t('review.send')}</span>
        <i class="ti ti-send" id="submit-send-icon" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</div>

<!-- Success overlay -->
<div class="review-overlay" id="overlay-success">
  <div class="review-modal-success" role="dialog" aria-labelledby="success-title">
    <div class="review-success-confetti"></div>
    <div class="review-success-body">
      <div class="review-success-icon-wrap"><i class="ti ti-circle-check" style="font-size:32px;color:var(--s600)" aria-hidden="true"></i></div>
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

function wireReviewAccordion() {
  document.querySelectorAll('.review-accordion-item[data-review-item]').forEach((el) => {
    el.addEventListener('click', () => {
      const wasOpen = el.classList.contains('open');
      document.querySelectorAll('.review-accordion-item.open').forEach((o) => {
        if (o !== el) o.classList.remove('open');
      });
      el.classList.toggle('open', !wasOpen);
    });
  });
}

function openSubmitModal() {
  document.getElementById('overlay-submit')?.classList.add('visible');
}
function closeSubmitModal() {
  document.getElementById('overlay-submit')?.classList.remove('visible');
}
function closeSuccessModal() {
  document.getElementById('overlay-success')?.classList.remove('visible');
}

function updateSubmitButton() {
  const btnFinal = document.getElementById('btn-submit-final');
  if (!btnFinal) return;
  const canSubmit = submitCheckboxChecked && !mediaError;
  btnFinal.classList.toggle('active', canSubmit);
  btnFinal.disabled = !canSubmit;
}

function toggleSubmitCheckbox() {
  submitCheckboxChecked = !submitCheckboxChecked;
  const box = document.getElementById('checkbox-box');
  if (box) box.classList.toggle('checked', submitCheckboxChecked);
  if (box) box.innerHTML = submitCheckboxChecked ? '<i class="ti ti-check" style="font-size:12px;color:var(--n1000)" aria-hidden="true"></i>' : '';
  updateSubmitButton();
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
  if (mediaCount > 0) {
    sub.textContent = t('review.mediaUploadedCount', { n: mediaCount });
  } else {
    sub.textContent = t('review.mediaUploadSub');
  }
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
      if (overlay) {
        overlay.classList.add('visible');
      }
      if (typeof window.confetti === 'function') {
        window.confetti({
          particleCount: 160,
          spread: 90,
          startVelocity: 45,
          scalar: 0.9,
          origin: { y: 0.4 }
        });
      }
    }, 200);
    if (label) label.textContent = t('review.send');
    if (sendIcon) sendIcon.style.display = '';
    if (btn.contains(spinner)) btn.removeChild(spinner);
    btn.disabled = false;
    submitCheckboxChecked = false;
    const box = document.getElementById('checkbox-box');
    if (box) {
      box.classList.remove('checked');
      box.innerHTML = '';
    }
    mediaError = false;
    mediaCount = document.getElementById('review-media-list')?.querySelectorAll('.review-media-item').length || 0;
    updateMediaDescription();
    updateSubmitButton();
  }, 1600);
}

export function wireReviewStep(goToStep) {
  if (getPdfDoc()) showLoadedPdfInCurrentCard('pdf-fallback-review');
  const zoomIn = document.getElementById('pdf-zoom-in');
  const zoomOut = document.getElementById('pdf-zoom-out');
  const navPrev = document.getElementById('pdf-nav-prev');
  const navNext = document.getElementById('pdf-nav-next');
  if (zoomIn) zoomIn.addEventListener('click', () => pdfZoomChange(1));
  if (zoomOut) zoomOut.addEventListener('click', () => pdfZoomChange(-1));
  if (navPrev) navPrev.addEventListener('click', pdfNavPrev);
  if (navNext) navNext.addEventListener('click', pdfNavNext);
  pdfZoomApply();

  // Sync totals + tax display from Step 3 values if present
  try {
    const netInput = document.getElementById('total-net');
    const grossInput = document.getElementById('total-gross');
    const taxRateInput = document.getElementById('ctrl-tax-input');
    const netLabel = document.getElementById('review-total-net');
    const grossLabel = document.getElementById('review-total-gross');
    const taxLabel = document.getElementById('review-total-tax');
    if (netInput && grossInput && taxRateInput && netLabel && grossLabel && taxLabel) {
      const netVal = parseDE(netInput.value);
      const grossVal = parseDE(grossInput.value);
      const taxRate = parseDE(taxRateInput.value) / 100;
      const taxAmount = Math.max(0, grossVal - netVal);
      netLabel.textContent = `${formatDE(netVal)} EUR`;
      grossLabel.textContent = `${formatDE(grossVal)} EUR`;
      const percentStr = `${formatDE(taxRate * 100)} %`;
      const amountStr = `${formatDE(taxAmount)} EUR`;
      // Show amount first, then rate in parentheses (best-practice clarity)
      taxLabel.textContent = `${amountStr} (${percentStr})`;
    }
  } catch (e) {
    // Non-fatal: keep static demo values if something goes wrong
  }

  const expandBtn = document.getElementById('pdf-expand-btn-review');
  const card = document.getElementById('pdf-card-review');
  const left = document.getElementById('review-left');
  if (expandBtn && card && left) {
    // Initialize desktop icon as expand (maximize); keep X icon on mobile/tablet
    const iconHost = document.getElementById('pdf-expand-icon-review');
    if (iconHost) {
      if (!isMobileViewport()) {
        iconHost.outerHTML = getPdfExpandSvg(false, 'pdf-expand-icon-review');
      } else {
        iconHost.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';
      }
    }

    expandBtn.addEventListener('click', () => {
      // On tablet/mobile, treat expand as "close overlay"
      if (isMobileViewport()) {
        const icon = document.getElementById('pdf-expand-icon-review');
        if (icon) {
          icon.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';
        }
        left.classList.remove('active');
        return;
      }
      pdfExpandedReview = !pdfExpandedReview;
      left.classList.toggle('pdf-expanded', pdfExpandedReview);
      card.classList.toggle('expanded', pdfExpandedReview);
      expandBtn.setAttribute('aria-label', pdfExpandedReview ? t('val.collapsePdfAria') : t('val.expandPdfAria'));
      const icon = document.getElementById('pdf-expand-icon-review');
      if (icon) {
        icon.outerHTML = getPdfExpandSvg(pdfExpandedReview, 'pdf-expand-icon-review');
      }
    });
  }

  const pdfOpenOverlayBtn = document.getElementById('pdf-open-overlay-review');
  const pdfLeftPanel = document.getElementById('review-left');
  if (pdfOpenOverlayBtn && pdfLeftPanel) {
    pdfOpenOverlayBtn.addEventListener('click', () => {
      pdfLeftPanel.classList.add('active');
      if (getPdfDoc()) {
        showLoadedPdfInCurrentCard('pdf-fallback-review');
      }
    });
  }

  wireReviewAccordion();

  const btnBack = document.getElementById('review-btn-back');
  const backOverlay = document.getElementById('overlay-back-review');
  const backCancel = document.getElementById('btn-back-cancel-review');
  const backConfirm = document.getElementById('btn-back-confirm-review');
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
      goToStep(3);
    });
  }
  if (backOverlay) {
    backOverlay.addEventListener('click', (e) => {
      if (e.target === backOverlay) backOverlay.classList.remove('visible');
    });
  }
  const btnOpenModal = document.getElementById('btn-open-submit-modal');
  if (btnOpenModal) btnOpenModal.addEventListener('click', openSubmitModal);

  document.getElementById('close-submit-modal')?.addEventListener('click', closeSubmitModal);
  document.getElementById('btn-not-yet')?.addEventListener('click', closeSubmitModal);
  document.getElementById('checkbox-row')?.addEventListener('click', (e) => {
    if (e.target.closest('.review-checkbox-box') || e.target.closest('.review-checkbox-label')) toggleSubmitCheckbox();
  });
  document.getElementById('btn-submit-final')?.addEventListener('click', () => triggerSubmit());

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
          if (existing >= max) {
            setMediaError(t('review.mediaMaxError'));
          return;
        }

                  const remaining = max - existing;
                  const incoming = Array.from(files);
                  if (incoming.length > remaining) {
                    setMediaError(t('review.mediaMaxError'));
        } else {
          setMediaError('');
        }

        incoming.slice(0, remaining).forEach((file) => {
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
    }
  });
}
