/* ============================================================
   APP.JS — Tab switching and chip navigation
   ============================================================ */

/* Tab metadata — keep in sync with tab-content divs in index.html */
const tabMeta = {
  about: {
    title: 'About me',
    sub:   'B2B SaaS Product & Growth Marketing Leader | Educator and Entrepreneur',
  },
  work: {
    title: 'Work & results',
    sub:   'inFeedo.ai · Airmeet · The Remote Life · Fractional · Amadeus Labs',
  },
  bets: {
    title: "Bets I've placed",
    sub:   '4 bets · 1 failure · 1 acquisition · 2 in play',
  },
  gtm: {
    title: 'GTM + AI thinking',
    sub:   "Principles, frameworks, what I've built",
  },
  building: {
    title: "What I'm building",
    sub:   'Playbook A · the thesis · active projects',
  },
  contact: {
    title: "Let's work together",
    sub:   'Open to the right conversations',
  },
};

function switchTab(id) {
  /* Deactivate all nav items and tab content */
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

  /* Activate target nav item */
  const navItem = document.querySelector(`.nav-item[data-tab="${id}"]`);
  if (navItem) navItem.classList.add('active');

  /* Activate target tab content */
  const tab = document.getElementById(`tab-${id}`);
  if (tab) tab.classList.add('active');

  /* Update main header */
  const meta = tabMeta[id];
  if (meta) {
    document.getElementById('header-title').textContent = meta.title;
    document.getElementById('header-sub').textContent   = meta.sub;
  }

  /* Scroll chat area back to top */
  document.getElementById('chat-area').scrollTop = 0;
}

/* Sidebar nav clicks */
document.querySelectorAll('.nav-item[data-tab]').forEach(el => {
  el.addEventListener('click', () => switchTab(el.dataset.tab));
});

/* Chip navigation clicks */
document.querySelectorAll('.chip[data-goto]').forEach(el => {
  el.addEventListener('click', () => switchTab(el.dataset.goto));
});
