/**
 * PDF.js viewer for upload step (mirrors index_03_validation.html behaviour).
 * Requires pdfjsLib from CDN. Exports: loadPdfFromFile, pdfZoomChange, pdfZoomApply, pdfNavPrev, pdfNavNext.
 */

if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const PDF_ZOOM_STEPS = [0.5, 0.6, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];
let pdfZoomIdx = PDF_ZOOM_STEPS.indexOf(1.0);
let pdfDoc = null;
let pdfPageNum = 1;
let _renderTask = null;

function getEl(id) {
  return document.getElementById(id);
}

export function pdfZoomApply() {
  const level = PDF_ZOOM_STEPS[pdfZoomIdx];
  const label = getEl('pdf-zoom-label');
  const btnOut = getEl('pdf-zoom-out');
  const btnIn = getEl('pdf-zoom-in');
  if (label) label.textContent = Math.round(level * 100) + '%';
  const atMin = pdfZoomIdx <= 0;
  const atMax = pdfZoomIdx >= PDF_ZOOM_STEPS.length - 1;
  if (btnOut) {
    btnOut.style.opacity = atMin ? '0.3' : '';
    btnOut.style.pointerEvents = atMin ? 'none' : '';
  }
  if (btnIn) {
    btnIn.style.opacity = atMax ? '0.3' : '';
    btnIn.style.pointerEvents = atMax ? 'none' : '';
  }
  if (pdfDoc) renderPage(pdfPageNum);
}

export function pdfZoomChange(dir) {
  pdfZoomIdx = Math.max(0, Math.min(PDF_ZOOM_STEPS.length - 1, pdfZoomIdx + dir));
  pdfZoomApply();
}

function renderPage(num) {
  if (!pdfDoc) return;
  if (_renderTask) {
    _renderTask.cancel();
    _renderTask = null;
  }
  pdfDoc.getPage(num).then((page) => {
    const scale = PDF_ZOOM_STEPS[pdfZoomIdx];
    const devicePx = window.devicePixelRatio || 1;
    const viewport = page.getViewport({ scale: scale * devicePx });
    const canvas = getEl('pdf-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = viewport.width / devicePx + 'px';
    canvas.style.height = viewport.height / devicePx + 'px';
    _renderTask = page.render({ canvasContext: ctx, viewport });
    _renderTask.promise
      .then(() => { _renderTask = null; })
      .catch((err) => {
        if (err && err.name !== 'RenderingCancelledException') console.warn('PDF render error:', err);
        _renderTask = null;
      });
    const pageInfo = document.querySelector('.pdf-page-info');
    if (pageInfo) pageInfo.textContent = `${num} / ${pdfDoc.numPages}`;
    const navBtns = document.querySelectorAll('.pdf-nav-btn');
    if (navBtns[0]) navBtns[0].style.opacity = num <= 1 ? '0.3' : '';
    if (navBtns[1]) navBtns[1].style.opacity = num >= pdfDoc.numPages ? '0.3' : '';
  }).catch((err) => console.warn('PDF getPage error:', err));
}

export function pdfNavPrev() {
  if (pdfDoc && pdfPageNum > 1) {
    pdfPageNum--;
    renderPage(pdfPageNum);
  }
}

export function pdfNavNext() {
  if (pdfDoc && pdfPageNum < pdfDoc.numPages) {
    pdfPageNum++;
    renderPage(pdfPageNum);
  }
}

function pdfFitToWidth(attempt) {
  attempt = attempt || 1;
  if (!pdfDoc) return;
  const wrap = getEl('pdf-canvas-wrap');
  if (!wrap) return;
  const containerW = wrap.clientWidth - 24;
  if (containerW <= 0) {
    if (attempt < 5) setTimeout(() => pdfFitToWidth(attempt + 1), 80);
    else {
      pdfZoomIdx = PDF_ZOOM_STEPS.indexOf(0.75);
      pdfZoomApply();
    }
    return;
  }
  pdfDoc.getPage(pdfPageNum).then((page) => {
    const naturalW = page.getViewport({ scale: 1 }).width;
    const scale = containerW / naturalW;
    let best = 0;
    for (let i = 0; i < PDF_ZOOM_STEPS.length; i++) {
      if (PDF_ZOOM_STEPS[i] <= scale) best = i;
    }
    pdfZoomIdx = best;
    pdfZoomApply();
  });
}

/**
 * Load a PDF File object (e.g. from input.files[0]). Shows canvas and hides fallback.
 * @param {File} file
 * @param {object} opts - { fallbackSelector: string } optional selector for fallback to hide
 */
export function loadPdfFromFile(file, opts = {}) {
  if (!file || typeof pdfjsLib === 'undefined') return Promise.reject(new Error('No file or PDF.js'));
  const fallbackSelector = opts.fallbackSelector || '#pdf-fallback-upload';
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const typedArray = new Uint8Array(e.target.result);
      pdfjsLib.getDocument({ data: typedArray }).promise
        .then((doc) => {
          pdfDoc = doc;
          pdfPageNum = 1;
          const wrap = getEl('pdf-canvas-wrap');
          const fallback = document.querySelector(fallbackSelector);
          if (wrap) wrap.classList.add('loaded');
          if (fallback) fallback.style.display = 'none';
          document.querySelectorAll('.all-pdf-filenames').forEach((el) => { el.textContent = file.name; });
          setTimeout(pdfFitToWidth, 150);
          resolve(doc);
        })
        .catch(reject);
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsArrayBuffer(file);
  });
}

export function getPdfDoc() {
  return pdfDoc;
}

/**
 * When navigating to Step 2 (or any screen with a PDF card), show the already-loaded
 * PDF in the current DOM card (same ids: pdf-canvas-wrap, pdf-canvas). Hides fallback.
 * @param {string} [fallbackId] - Optional id of fallback element to hide (e.g. 'pdf-fallback-damage')
 */
export function showLoadedPdfInCurrentCard(fallbackId) {
  if (!pdfDoc) return;
  const wrap = getEl('pdf-canvas-wrap');
  const fallback = fallbackId ? document.getElementById(fallbackId) : document.getElementById('pdf-fallback-upload');
  if (wrap) wrap.classList.add('loaded');
  if (fallback) fallback.style.display = 'none';
  pdfZoomApply();
}
