/**
 * Login form + welcome (home) screen logic.
 * Validation states, eye toggle, submit, language toggle. Uses Tabler Icons (https://tabler.io/icons).
 */

import { setLoggedIn, setLoggedOut, showLogin, showHome, openFunnel } from './auth.js';
import { goToStep } from './router.js';
import { getLanguage, setLanguage, t } from './i18n.js';

const DEMO_EMAIL = 'admin@bikeshopberlin.de';
const DEMO_PASSWORD = 'any'; // any non-empty password works for prototype

function updateLangToggleState() {
  const toggle = document.getElementById('login-lang-toggle');
  if (!toggle) return;
  const isDe = getLanguage() === 'de';
  toggle.setAttribute('aria-pressed', isDe ? 'true' : 'false');
}

function wireLangToggles() {
  updateLangToggleState();
  const langToggle = document.getElementById('login-lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const next = getLanguage() === 'de' ? 'en' : 'de';
      setLanguage(next);
      updateLangToggleState();
    });
  }
}

export function wireLoginForm() {
  const emailEl = document.getElementById('l-email');
  const passEl = document.getElementById('l-pass');
  const btnEl = document.getElementById('l-btn');
  const eyeEl = document.getElementById('l-eye');
  const errEl = document.getElementById('l-err');
  if (!emailEl || !passEl || !btnEl) return;

  wireLangToggles();

  emailEl.addEventListener('input', loginInput);
  passEl.addEventListener('input', loginInput);
  btnEl.addEventListener('click', doLogin);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('view-login')?.classList.contains('active')) doLogin();
  });

  if (eyeEl) {
    eyeEl.addEventListener('click', togglePass);
  }

  function loginInput() {
    const emailVal = emailEl.value.trim();
    const passVal = passEl.value;
    if (eyeEl) eyeEl.style.display = passVal.length > 0 ? 'flex' : 'none';

    emailEl.classList.remove('err');
    passEl.classList.remove('err');
    if (errEl) errEl.classList.remove('vis');

    if (emailVal.length > 0 && passVal.length > 0) {
      btnEl.classList.add('on');
    } else {
      btnEl.classList.remove('on');
    }
  }

  function togglePass() {
    const on = passEl.type === 'password';
    passEl.type = on ? 'text' : 'password';
    const eyeOff = document.getElementById('l-eye-off');
    const eyeOn = document.getElementById('l-eye-on');
    if (eyeOff) eyeOff.style.display = on ? 'none' : 'block';
    if (eyeOn) eyeOn.style.display = on ? 'block' : 'none';
  }

  function doLogin() {
    if (!btnEl.classList.contains('on')) return;
    const e = emailEl.value.trim();
    const p = passEl.value.trim();
    if (e === DEMO_EMAIL && p.length > 0) {
      setLoggedIn(e);
      showHome();
      updateWelcomeEmail(e);
    } else {
      emailEl.classList.add('err');
      passEl.classList.add('err');
      if (errEl) errEl.classList.add('vis');
      btnEl.classList.remove('on');
      toast(t('auth.login.toastDemoHint', { email: DEMO_EMAIL }));
    }
  }
}

function updateWelcomeEmail(email) {
  const signed = document.querySelector('.welcome-signed a');
  if (signed) signed.textContent = email;
}

export function wireWelcomeButtons() {
  const btnReport = document.getElementById('btn-welcome-report');
  const btnTheft = document.getElementById('btn-welcome-theft');
  const btnLogout = document.getElementById('btn-welcome-logout');
  if (btnReport) {
    btnReport.addEventListener('click', () => {
      openFunnel();
      goToStep(1);
    });
  }
  if (btnTheft) {
    btnTheft.addEventListener('click', () => toast(t('auth.welcome.toastTheftSoon')));
  }
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      setLoggedOut();
      showLogin();
      resetLoginForm();
    });
  }
}

function resetLoginForm() {
  const emailEl = document.getElementById('l-email');
  const passEl = document.getElementById('l-pass');
  const btnEl = document.getElementById('l-btn');
  const errEl = document.getElementById('l-err');
  const eyeEl = document.getElementById('l-eye');
  const eyeOff = document.getElementById('l-eye-off');
  const eyeOn = document.getElementById('l-eye-on');
  if (emailEl) emailEl.value = '';
  if (passEl) passEl.value = '';
  if (passEl) passEl.type = 'password';
  if (emailEl) emailEl.classList.remove('err');
  if (passEl) passEl.classList.remove('err');
  if (errEl) errEl.classList.remove('vis');
  if (btnEl) btnEl.classList.remove('on');
  if (eyeEl) eyeEl.style.display = 'none';
  if (eyeOff) eyeOff.style.display = '';
  if (eyeOn) eyeOn.style.display = 'none';
}

function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--n900);color:var(--n0);padding:12px 20px;border-radius:var(--r-sm);font-size:14px;z-index:9999;opacity:0;transition:opacity 0.2s;pointer-events:none;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  if (el.style.opacity !== '1') el.style.opacity = '1';
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.classList.remove('show'), 200);
  }, 3500);
}
