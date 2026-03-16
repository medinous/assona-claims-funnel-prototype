import { funnelState, setStep } from './state.js';
import { getStep1Markup, wireUploadStep } from './upload.js';
import { getStep2Markup, wireDamageStep } from './damage.js';
import { getStep3Markup, wireValidationStep } from './validation.js';
import { getStep4Markup, wireReviewStep } from './review.js';
import { t } from './i18n.js';

export function getCurrentStep() {
  return funnelState.currentStep;
}

const MAX_STEP = 4;
const MIN_STEP = 1;

function clampStep(step) {
  return Math.min(MAX_STEP, Math.max(MIN_STEP, step));
}

function parseHash() {
  const hash = window.location.hash || '';
  const match = hash.match(/#step-(\d+)/);
  if (!match) return 1;
  const n = Number(match[1]);
  return Number.isFinite(n) ? clampStep(n) : 1;
}

function updateHash(step) {
  const target = `#step-${step}`;
  if (window.location.hash === target) return;
  window.location.hash = target;
}

function renderStepper(step) {
  const root = document.querySelector('.stepper');
  if (!root) return;
  const items = root.querySelectorAll('.step-item');
  items.forEach((item, index) => {
    const n = index + 1;
    const dot = item.querySelector('.step-dot');
    const label = item.querySelector('.step-label');
    const lines = item.querySelectorAll('.step-line');
    if (!dot || !label) return;

    dot.classList.remove('active', 'done');
    label.classList.remove('active', 'done');
    lines.forEach(l => l.classList.remove('done'));

    if (n < step) {
      dot.classList.add('done');
      label.classList.add('done');
      lines.forEach(l => l.classList.add('done'));
      dot.innerHTML = '<i class="ti ti-check" aria-hidden="true"></i>';
    } else {
      dot.textContent = n;
      if (n === step) {
        dot.classList.add('active');
        label.classList.add('active');
        const prevLine = item.querySelector('.step-line');
        if (prevLine) prevLine.classList.add('done');
      }
    }
  });
}

function renderProtoNav(step) {
  document
    .querySelectorAll('[data-step-link]')
    .forEach(btn => {
      const target = Number(btn.getAttribute('data-step-link'));
      const isCurrent = target === step;
      btn.classList.toggle('cur', isCurrent);
    });
}

function renderStepContent(step) {
  const root = document.getElementById('step-root');
  if (!root) return;

  if (step === 1) {
    root.innerHTML = getStep1Markup();
    wireUploadStep(goToStep);
    return;
  }

  if (step === 2) {
    root.innerHTML = getStep2Markup();
    wireDamageStep(goToStep);
    return;
  }

  if (step === 3) {
    root.innerHTML = getStep3Markup();
    wireValidationStep(goToStep);
    return;
  }

  if (step === 4) {
    root.innerHTML = getStep4Markup();
    wireReviewStep(goToStep);
    return;
  }

  const headings = {
    2: t('router.step2Heading'),
    3: t('router.step3Heading'),
    4: t('router.step4Heading'),
  };

  root.innerHTML = `
    <section style="flex:1;display:flex;align-items:center;justify-content:center;background:var(--n0);">
      <div style="text-align:center;max-width:420px;padding:24px;">
        <h1 style="font-family:var(--ff-heading);font-size:24px;font-weight:700;color:var(--n1000);margin-bottom:8px;">
          ${headings[step] ?? t('router.placeholderHeading')}
        </h1>
        <p style="font-size:14px;color:var(--n700);line-height:1.5;">
          ${t('router.placeholderText', { step })}
        </p>
      </div>
    </section>
  `;
}

export function goToStep(step, { fromUser = false } = {}) {
  const clamped = clampStep(step);
  setStep(clamped);
  renderStepper(clamped);
  renderProtoNav(clamped);
  renderStepContent(clamped);
  if (!fromUser) {
    updateHash(clamped);
  }
}

function handleHashChange() {
  const step = parseHash();
  goToStep(step, { fromUser: true });
}

function wireProtoNav() {
  document
    .querySelectorAll('[data-step-link]')
    .forEach(btn => {
      btn.addEventListener('click', event => {
        event.preventDefault();
        const target = Number(btn.getAttribute('data-step-link'));
        if (!Number.isFinite(target)) return;
        goToStep(target);
      });
    });
}

export function boot() {
  const initial = parseHash();
  setStep(initial);
  wireProtoNav();
  goToStep(initial);
  window.addEventListener('hashchange', handleHashChange);
}

