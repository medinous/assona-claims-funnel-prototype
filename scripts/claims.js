import { init as i18nInit } from './i18n.js';

const CLAIMS = [
  { id: 'CLM-001', status: 'pending',  msg: 'Additional photo(s) required',                                              type: 'Partial Damage', amount: '349.00 EUR',    submitted: '2024-09-09', updated: '2 days ago' },
  { id: 'CLM-008', status: 'pending',  msg: 'Proof of Purchase required',                                                 type: 'Partial Damage', amount: '887.00 EUR',    submitted: '2024-09-07', updated: '6 days ago' },
  { id: 'CLM-002', status: 'draft',    msg: 'Invoice uploaded',                                                            type: 'Partial Damage', amount: '15,020.00 EUR', submitted: '—',          updated: '2 days ago' },
  { id: 'CLM-003', status: 'draft',    msg: 'Invoice uploaded',                                                            type: 'Partial Damage', amount: '—',             submitted: '—',          updated: '3 days ago' },
  { id: 'CLM-004', status: 'process',  msg: 'Claim submitted, assona is analyzing',                                       type: 'Total Loss',     amount: '1,500.00 EUR',  submitted: '2024-09-12', updated: '1 day ago' },
  { id: 'CLM-005', status: 'process',  msg: 'Claim submitted, assona is analyzing',                                       type: 'Minor Damage',   amount: '100.00 EUR',    submitted: '2024-09-10', updated: '3 days ago' },
  { id: 'CLM-006', status: 'paid',     msg: 'Payment effectuated',                                                        type: 'Partial Damage', amount: '800.00 EUR',    submitted: '2024-09-09', updated: '4 days ago' },
  { id: 'CLM-007', status: 'process',  msg: 'Claim submitted, assona is analyzing',                                       type: 'Total Loss',     amount: '2,500.00 EUR',  submitted: '2024-09-06', updated: '5 days ago' },
  { id: 'CLM-009', status: 'paid',     msg: 'Payment effectuated',                                                        type: 'Inspection',     amount: '50.00 EUR',     submitted: '2024-09-04', updated: '7 days ago' },
  { id: 'CLM-010', status: 'process',  msg: 'Claim submitted, assona is analyzing',                                       type: 'Minor Damage',   amount: '600.00 EUR',    submitted: '2024-09-05', updated: '8 days ago' },
  { id: 'CLM-011', status: 'denied',   msg: 'The amount for Wear & Tear is above the amount insured by e.',               type: 'Total Loss',     amount: '3,000.00 EUR',  submitted: '2024-09-04', updated: '9 days ago' },
  { id: 'CLM-012', status: 'process',  msg: 'Claim submitted, assona is analyzing',                                       type: 'Partial Damage', amount: '200.00 EUR',    submitted: '2024-09-03', updated: '10 days ago' },
  { id: 'CLM-013', status: 'process',  msg: 'Claim submitted, assona is analyzing',                                       type: 'Partial Damage', amount: '100.00 EUR',    submitted: '2024-09-02', updated: '11 days ago' },
  { id: 'CLM-014', status: 'draft',    msg: 'Cost Estimate uploaded',                                                     type: 'Inspection',     amount: '1,200.00 EUR',  submitted: '—',          updated: '12 days ago' },
  { id: 'CLM-015', status: 'draft',    msg: 'Cost Estimate uploaded',                                                     type: 'Inspection',     amount: '1,200.00 EUR',  submitted: '—',          updated: '12 days ago' },
];

const BADGE = {
  pending: { label: 'Pending Answer', cls: 'cl-badge--pending' },
  draft:   { label: 'Draft',          cls: 'cl-badge--draft'   },
  process: { label: 'In Process',     cls: 'cl-badge--process' },
  paid:    { label: 'Paid out',        cls: 'cl-badge--paid'    },
  denied:  { label: 'Payout denied',  cls: 'cl-badge--denied'  },
};

// Tab → which statuses to show (null = all)
const TAB_FILTER = {
  all:       null,
  open:      ['pending', 'process'],
  drafts:    ['draft'],
  resolved:  ['paid'],
  cancelled: ['denied'],
};

function renderBadge(status) {
  const b = BADGE[status] || { label: status, cls: '' };
  return `<span class="cl-badge ${b.cls}"><span class="cl-badge-dot"></span>${b.label}</span>`;
}

function renderRow(c) {
  return `
    <tr data-status="${c.status}" data-search-text="${[c.id, c.msg, c.type, c.amount].join(' ').toLowerCase()}">
      <td><span class="cl-claim-id">${c.id}</span></td>
      <td>${renderBadge(c.status)}</td>
      <td><span class="cl-msg" title="${c.msg}">${c.msg}</span></td>
      <td>${c.type}</td>
      <td class="cl-amount">${c.amount}</td>
      <td class="${c.submitted === '—' ? 'cl-muted' : ''}">${c.submitted}</td>
      <td class="cl-muted">${c.updated}</td>
      <td><button class="cl-action-btn" aria-label="More options"><i data-lucide="more-horizontal"></i></button></td>
    </tr>`;
}

function boot() {
  i18nInit();

  // Render table rows
  const tbody = document.getElementById('cl-tbody');
  if (tbody) {
    tbody.innerHTML = CLAIMS.map(renderRow).join('');
  }

  // Init Lucide icons
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

  // New claim button
  document.querySelectorAll('[data-action="new-claim"]').forEach((btn) => {
    btn.addEventListener('click', () => { window.location.href = 'index.html#funnel'; });
  });

  // Tab filtering
  let activeFilter = null; // null = all
  let searchQuery = '';

  function applyFilters() {
    const rows = Array.from(document.querySelectorAll('#cl-tbody tr'));
    let visible = 0;
    rows.forEach((row) => {
      const status = row.getAttribute('data-status');
      const text   = row.getAttribute('data-search-text') || '';
      const matchTab    = !activeFilter || activeFilter.includes(status);
      const matchSearch = !searchQuery  || text.includes(searchQuery);
      const show = matchTab && matchSearch;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const info = document.getElementById('cl-pagination-info');
    if (info) info.textContent = `Showing ${visible} of ${CLAIMS.length} claims`;
  }

  document.querySelectorAll('.cl-tab[data-filter]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cl-tab[data-filter]').forEach((t) =>
        t.classList.toggle('cl-tab--active', t === tab),
      );
      const key = tab.getAttribute('data-filter');
      activeFilter = TAB_FILTER[key] || null;
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

  // Initial count
  applyFilters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
