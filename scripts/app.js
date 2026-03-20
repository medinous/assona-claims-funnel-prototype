/**
 * App entry: login → home → funnel. Wires auth, login, router, nav-close, i18n.
 */

import { showView, closeFunnel } from './auth.js';
import { wireLoginForm, wireWelcomeButtons } from './login.js';
import { goToStep, boot as routerBoot, getCurrentStep } from './router.js';
import { init as i18nInit, applyToDOM } from './i18n.js';

function boot() {
  i18nInit();
  // Decide initial view based on hash / search, so deep links like
  // index.html#home or index.html#funnel work from other pages.
  const hash = window.location.hash || '';
  const params = new URLSearchParams(window.location.search || '');
  const viewParam = params.get('view');
  let initialView = 'login';
  if (hash === '#home' || viewParam === 'home') {
    initialView = 'home';
  } else if (hash === '#funnel' || viewParam === 'funnel') {
    initialView = 'funnel';
  }

  showView(initialView);
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
