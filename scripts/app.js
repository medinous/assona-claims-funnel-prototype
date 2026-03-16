/**
 * App entry: login → home → funnel. Wires auth, login, router, nav-close, i18n.
 */

import { showView, closeFunnel } from './auth.js';
import { wireLoginForm, wireWelcomeButtons } from './login.js';
import { goToStep, boot as routerBoot, getCurrentStep } from './router.js';
import { init as i18nInit, applyToDOM } from './i18n.js';

function boot() {
  i18nInit();
  showView('login');
  wireLoginForm();
  wireWelcomeButtons();
  routerBoot();

  const navClose = document.querySelector('#view-funnel .nav-close');
  if (navClose) {
    navClose.addEventListener('click', () => closeFunnel());
  }

  document.querySelectorAll('[data-view-link]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const view = btn.getAttribute('data-view-link');
      if (view) showView(view);
      if (view === 'funnel') goToStep(1);
    });
  });

  window.addEventListener('languagechange', () => {
    applyToDOM();
    const step = getCurrentStep && getCurrentStep();
    if (step != null) goToStep(step);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
