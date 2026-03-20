import { init as i18nInit } from './i18n.js';

function boot() {
  i18nInit();

  // Render lucide icons (shadcn/ui default icon set)
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Sidebar collapse/expand
  const appRoot = document.querySelector('.figma-app');
  const toggleBtn = document.querySelector('[data-action="toggle-sidebar"]');
  if (appRoot && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const collapsed = appRoot.classList.toggle('is-sidebar-collapsed');
      toggleBtn.setAttribute(
        'aria-label',
        collapsed ? 'Open sidebar' : 'Close sidebar',
      );
    });
  }

  // Tabs interaction + KPI refresh
  const kpiByRange = {
    '30d': {
      'contracts-closed': { value: '10.567,30 EUR', sub: 'Last 30 days' },
      'avg-resolution': { value: '2 days', sub: 'Last 30 days' },
      'claims-submitted': { value: '14', sub: 'Last 30 days' },
      'claims-paid': { value: '1.244,98 EUR', sub: 'Last 30 years', tag: '+2% past year' },
      'commission-paid': { value: '1.244,98 EUR', sub: 'Last 30 years', tag: '+4,6% past year' },
    },
    '60d': {
      'contracts-closed': { value: '18.420,00 EUR', sub: 'Last 60 days' },
      'avg-resolution': { value: '3 days', sub: 'Last 60 days' },
      'claims-submitted': { value: '26', sub: 'Last 60 days' },
      'claims-paid': { value: '2.380,10 EUR', sub: 'Last 60 years', tag: '+3,1% past year' },
      'commission-paid': { value: '2.018,70 EUR', sub: 'Last 60 years', tag: '+5,2% past year' },
    },
    '90d': {
      'contracts-closed': { value: '24.905,40 EUR', sub: 'Last 90 days' },
      'avg-resolution': { value: '3 days', sub: 'Last 90 days' },
      'claims-submitted': { value: '39', sub: 'Last 90 days' },
      'claims-paid': { value: '3.901,90 EUR', sub: 'Last 90 years', tag: '+4,0% past year' },
      'commission-paid': { value: '3.044,50 EUR', sub: 'Last 90 years', tag: '+6,4% past year' },
    },
  };

  const productValues = {
    'contracts-closed': {
      all: { '30d': '10.567,30 EUR', '60d': '18.420,00 EUR', '90d': '24.905,40 EUR' },
      bike: { '30d': '6.244,10 EUR', '60d': '11.220,50 EUR', '90d': '16.440,00 EUR' },
      motor: { '30d': '2.874,00 EUR', '60d': '4.398,10 EUR', '90d': '5.779,90 EUR' },
      home: { '30d': '1.009,20 EUR', '60d': '1.852,40 EUR', '90d': '2.468,30 EUR' },
      fleet: { '30d': '320,00 EUR', '60d': '612,00 EUR', '90d': '980,00 EUR' },
      travel: { '30d': '120,00 EUR', '60d': '337,00 EUR', '90d': '497,20 EUR' },
    },
    'avg-resolution': {
      all: { '30d': '2 days', '60d': '3 days', '90d': '3 days' },
      bike: { '30d': '2 days', '60d': '2 days', '90d': '3 days' },
      motor: { '30d': '3 days', '60d': '3 days', '90d': '4 days' },
      home: { '30d': '2 days', '60d': '3 days', '90d': '3 days' },
      fleet: { '30d': '4 days', '60d': '4 days', '90d': '5 days' },
      travel: { '30d': '1 day', '60d': '2 days', '90d': '2 days' },
    },
  };

  let activeRange = '30d';

  function applyProductSelections() {
    const selects = Array.from(
      document.querySelectorAll('.dash-kpi-select[data-kpi-select]'),
    );

    selects.forEach((select) => {
      const cardKey = select.getAttribute('data-kpi-select');
      if (!cardKey) return;
      const selected = select.value || 'all';
      const byCard = productValues[cardKey];
      const valueEl = document.querySelector(`[data-kpi-value="${cardKey}"]`);
      if (!byCard || !valueEl) return;
      const value = byCard[selected]?.[activeRange] || byCard.all?.[activeRange];
      if (value) valueEl.textContent = value;
    });
  }

  function applyKpiRange(rangeKey) {
    const snapshot = kpiByRange[rangeKey];
    if (!snapshot) return;
    activeRange = rangeKey;

    Object.keys(snapshot).forEach((key) => {
      const cardData = snapshot[key];
      const valueEl = document.querySelector(`[data-kpi-value="${key}"]`);
      const subEl = document.querySelector(`[data-kpi-sub="${key}"]`);
      const tagEl = document.querySelector(`[data-kpi-tag="${key}"]`);
      if (valueEl) valueEl.textContent = cardData.value;
      if (subEl) subEl.textContent = cardData.sub;
      if (tagEl && cardData.tag) tagEl.textContent = cardData.tag;
    });

    applyProductSelections();
  }

  const tabs = Array.from(document.querySelectorAll('.tab'));
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.toggle('tab--active', t === tab));
        const rangeKey = tab.getAttribute('data-range') || '30d';
        applyKpiRange(rangeKey);
      });
    });
    const initial = tabs.find((t) => t.classList.contains('tab--active')) || tabs[0];
    const initialRange = initial?.getAttribute('data-range') || '30d';
    applyKpiRange(initialRange);
  }

  // Sticky tabs handoff: page bar -> topbar
  const interactionBar = document.querySelector('.dash-interaction-bar');
  const topbar = document.querySelector('.topbar');
  if (interactionBar && topbar && appRoot) {
    const setTopbarTabs = (visible) => {
      appRoot.classList.toggle('show-topbar-tabs', visible);
    };
    let handoffObserver = null;

    const syncTopbarTabsVisibility = () => {
      const interactionBarTop = interactionBar.getBoundingClientRect().top;
      const topbarBottom = topbar.getBoundingClientRect().bottom;
      setTopbarTabs(interactionBarTop <= topbarBottom + 1);
    };

    const setupIntersectionHandoff = () => {
      if (typeof IntersectionObserver === 'undefined') {
        return false;
      }
      if (handoffObserver) {
        handoffObserver.disconnect();
        handoffObserver = null;
      }

      const topbarHeight = Math.ceil(topbar.getBoundingClientRect().height || 56);
      handoffObserver = new IntersectionObserver(
        ([entry]) => {
          // Visible when interaction bar has moved behind sticky topbar.
          setTopbarTabs(!entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0,
          rootMargin: `-${topbarHeight}px 0px 0px 0px`,
        },
      );
      handoffObserver.observe(interactionBar);
      return true;
    };

    // Prefer observer-based handoff; fallback to scroll math if needed.
    const usingObserver = setupIntersectionHandoff();
    if (!usingObserver) {
      syncTopbarTabsVisibility();
      window.addEventListener('scroll', syncTopbarTabsVisibility, { passive: true });
      window.addEventListener('resize', syncTopbarTabsVisibility);
    }

    // Re-evaluate after render/layout shifts and whenever viewport changes.
    const refreshHandoff = () => {
      if (!setupIntersectionHandoff()) {
        syncTopbarTabsVisibility();
      }
    };
    window.addEventListener('load', refreshHandoff);
    window.addEventListener('resize', refreshHandoff);

    requestAnimationFrame(() => {
      refreshHandoff();
      setTimeout(refreshHandoff, 120);
      setTimeout(refreshHandoff, 320);
    });
  }

  const kpiSelects = Array.from(document.querySelectorAll('.dash-kpi-select'));
  if (kpiSelects.length) {
    kpiSelects.forEach((select) => {
      select.addEventListener('change', () => {
        applyProductSelections();
      });
    });
  }

  // Sidebar search filters table rows and right-side cards
  const searchInput = document.querySelector('.sb-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      const searchTargets = Array.from(
        document.querySelectorAll('.ds-tr, .dash-news-item'),
      );

      searchTargets.forEach((node) => {
        const text = (node.textContent || '').toLowerCase();
        const visible = !query || text.includes(query);
        node.style.display = visible ? '' : 'none';
      });
    });
  }

  const personaButtons = Array.from(
    document.querySelectorAll('.dash-fixture-btn[data-persona]'),
  );
  if (appRoot && personaButtons.length) {
    personaButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const persona = btn.getAttribute('data-persona');
        appRoot.classList.toggle('is-member', persona === 'member');
        personaButtons.forEach((other) =>
          other.classList.toggle('is-active', other === btn),
        );
      });
    });
  }

  // New claim button routes to existing funnel MVP
  const newClaimBtns = Array.from(
    document.querySelectorAll('[data-action="new-claim"]'),
  );
  if (newClaimBtns.length) {
    newClaimBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        window.location.href = 'index.html#funnel';
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

