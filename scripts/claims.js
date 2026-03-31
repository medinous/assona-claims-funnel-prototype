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

  // ── Side Panel ────────────────────────────────────────────────────────────
  const sidepanel = document.getElementById('claims-sidepanel');
  const spOverlay = document.getElementById('sp-overlay');

  // Map data-status → sp-badge class modifier
  const STATUS_BADGE_CLASS = {
    pending: 'sp-badge--pending',
    process: 'sp-badge--process',
    draft:   'sp-badge--draft',
    paid:    'sp-badge--paid',
    denied:  'sp-badge--denied',
  };

  function openSidepanel(row) {
    const status      = row.getAttribute('data-status') || '';
    const claimId     = row.querySelector('.ds-td--claim')?.textContent.trim() || '';
    const statusLabel = row.querySelector('.ds-badge')?.textContent.trim() || '';
    const desc        = row.querySelector('.ds-td--desc')?.textContent.trim() || '';

    // Populate header
    sidepanel.querySelector('#sp-title').textContent = claimId;
    const badge = sidepanel.querySelector('#sp-badge');
    badge.textContent = statusLabel;
    badge.className = 'sp-badge ' + (STATUS_BADGE_CLASS[status] || '');
    sidepanel.querySelector('#sp-subtitle').textContent = desc;
    sidepanel.querySelector('#sp-notif-ref').textContent = claimId;

    // Reset to Overview tab on every open
    sidepanel.querySelectorAll('.sp-tab').forEach((t) =>
      t.classList.toggle('sp-tab--active', t.getAttribute('data-sp-tab') === 'overview'),
    );
    sidepanel.querySelectorAll('.sp-panel').forEach((p) =>
      p.classList.toggle('is-active', p.getAttribute('data-sp-panel') === 'overview'),
    );

    // Open
    sidepanel.classList.add('is-open');
    spOverlay.classList.add('is-open');
    sidepanel.removeAttribute('aria-hidden');
    spOverlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    // Re-render Lucide icons inside the panel
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ nodes: [sidepanel] });
    }
  }

  function closeSidepanel() {
    sidepanel.classList.remove('is-open');
    spOverlay.classList.remove('is-open');
    sidepanel.setAttribute('aria-hidden', 'true');
    spOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (sidepanel && spOverlay) {
    // Row click → open panel (ignore clicks on the 3-dot menu button)
    rows.forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.ds-menu-btn')) return;
        openSidepanel(row);
      });
    });

    // Close triggers: X button, Cancel button
    document.querySelectorAll('[data-action="close-sidepanel"]').forEach((btn) => {
      btn.addEventListener('click', closeSidepanel);
    });

    // Close on overlay click
    spOverlay.addEventListener('click', closeSidepanel);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidepanel.classList.contains('is-open')) {
        closeSidepanel();
      }
    });

    // Tab switching — active state + show matching panel
    sidepanel.querySelectorAll('.sp-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-sp-tab');

        sidepanel.querySelectorAll('.sp-tab').forEach((t) =>
          t.classList.toggle('sp-tab--active', t === tab),
        );

        sidepanel.querySelectorAll('.sp-panel').forEach((panel) =>
          panel.classList.toggle('is-active', panel.getAttribute('data-sp-panel') === target),
        );

        // Re-render Lucide icons in the newly visible panel
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          const activePanel = sidepanel.querySelector(`.sp-panel[data-sp-panel="${target}"]`);
          if (activePanel) window.lucide.createIcons({ nodes: [activePanel] });
        }
      });
    });

    // Accordion toggle (Items tab)
    sidepanel.addEventListener('click', (e) => {
      const header = e.target.closest('.sp-accordion-header');
      if (!header) return;
      const accordion = header.closest('.sp-accordion');
      if (!accordion) return;
      const isOpen = accordion.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(isOpen));
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
