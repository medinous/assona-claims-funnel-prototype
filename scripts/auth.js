/**
 * App view state: login | home | funnel.
 * Coordinates which top-level screen is visible.
 * Icons: Tabler Icons (https://tabler.io/icons)
 */

export const appState = {
  isLoggedIn: false,
  userEmail: '',
  currentView: 'login', // 'login' | 'home' | 'funnel'
};

const VIEW_IDS = ['view-login', 'view-home', 'view-funnel'];

export function setLoggedIn(email) {
  appState.isLoggedIn = true;
  appState.userEmail = email || '';
}

export function setLoggedOut() {
  appState.isLoggedIn = false;
  appState.userEmail = '';
}

export function showView(viewName) {
  const next = viewName === 'login' ? 'view-login' : viewName === 'home' ? 'view-home' : 'view-funnel';
  appState.currentView = viewName;

  // Body background: white for login + welcome, token background for funnel
  if (viewName === 'login' || viewName === 'home') {
    document.body.style.backgroundColor = '#ffffff';
  } else {
    document.body.style.backgroundColor = 'var(--color-sage-50, #fafbf7)';
  }

  VIEW_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === next) {
      el.classList.add('active');
      el.classList.remove('exit');
    } else {
      el.classList.remove('active');
      el.classList.add('exit');
    }
  });

  // Update proto nav
  document.querySelectorAll('[data-view-link]').forEach((btn) => {
    const target = btn.getAttribute('data-view-link');
    btn.classList.toggle('cur', target === viewName);
  });

}

export function showLogin() {
  showView('login');
}

export function showHome() {
  showView('home');
}

export function openFunnel() {
  showView('funnel');
}

export function closeFunnel() {
  showView('home');
}
