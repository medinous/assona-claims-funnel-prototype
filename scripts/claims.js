import { init as i18nInit } from './i18n.js';

// Tab key → which data-status values to show (null = all)
const TAB_FILTER = {
  all:       null,
  open:      ['pending', 'process'],
  drafts:    ['draft'],
  resolved:  ['paid'],
  cancelled: ['denied'],
};

function boot() {
  i18nInit();

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Sidebar toggle
  const appRoot = document.querySelector('.figma-app');
  const toggleBtn = document.querySelector('[data-action="toggle-sidebar"]');
  if (appRoot && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const collapsed = appRoot.classList.toggle('is-sidebar-collapsed');
      toggleBtn.setAttribute('aria-label', collapsed ? 'Open sidebar' : 'Close sidebar');
    });
  }

  // New claim
  document.querySelectorAll('[data-action="new-claim"]').forEach((btn) => {
    btn.addEventListener('click', () => { window.location.href = 'index.html#funnel'; });
  });

  // Filtering
  const rows = Array.from(document.querySelectorAll('#cl-tbody .ds-tr'));
  const infoEl = document.getElementById('cl-pagination-info');
  let activeStatuses = null;
  let searchQuery = '';

  function applyFilters() {
    let visible = 0;
    rows.forEach((row) => {
      const status = row.getAttribute('data-status') || '';
      const text   = row.textContent.toLowerCase();
      const matchTab    = !activeStatuses || activeStatuses.includes(status);
      const matchSearch = !searchQuery   || text.includes(searchQuery);
      row.style.display = matchTab && matchSearch ? '' : 'none';
      if (matchTab && matchSearch) visible++;
    });
    if (infoEl) infoEl.textContent = `Showing ${visible} of 21 claims`;
  }

  // Tab clicks
  document.querySelectorAll('.tab[data-filter]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab[data-filter]').forEach((t) =>
        t.classList.toggle('tab--active', t === tab),
      );
      const key = tab.getAttribute('data-filter');
      activeStatuses = TAB_FILTER[key] ?? null;
      applyFilters();
    });
  });

  // Search
  const searchInput = document.querySelector('.cl-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  applyFilters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
