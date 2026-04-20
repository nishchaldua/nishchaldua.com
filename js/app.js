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
  library: {
    title: 'Library',
    sub:   'nishchaldua.com · 123 books · 26 best reads',
  },
};

let spineCoversLoaded = false;

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

  /* Lazy-load spine cover images on first Library visit */
  if (id === 'library' && !spineCoversLoaded) {
    spineCoversLoaded = true;
    preloadSpineCovers();
  }
}

/* ── Theme toggle ── */
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('nd-theme', next);
});

/* Sidebar nav clicks */
document.querySelectorAll('.nav-item[data-tab]').forEach(el => {
  el.addEventListener('click', () => switchTab(el.dataset.tab));
});

/* Chip navigation clicks — re-query on each call to pick up dynamically rendered chips */
document.addEventListener('click', function(e) {
  const chip = e.target.closest('.chip[data-goto]');
  if (chip) switchTab(chip.dataset.goto);
});

/* ── Library: Filter books ── */
function filterBooks(filter) {
  document.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.filter === filter);
  });
  document.querySelectorAll('.spine-card').forEach(card => {
    if (filter === 'all') {
      card.style.display = '';
    } else if (filter === 'best') {
      card.style.display = card.dataset.best === 'true' ? '' : 'none';
    } else {
      card.style.display = card.dataset.category === filter ? '' : 'none';
    }
  });
}

/* ── Library: Title → local filename overrides (where filename differs from title) ── */
const coverFilenameOverrides = {
  "All Marketers Tell Stories":            "All Marketers Are Liars.jpg",
  "Homo Sapiens":                          "Sapiens.jpg",
  "One Night @ the Call Center":           "One Night at the Call Center.jpg",
  "$100 Million Offers":                   "$100M Offers.jpg",
  "The Subtle Art of Not Giving a F*ck":   "The Subtle Art of Not Giving a Fck.jpg",
  "Positioning: The Battle for Your Mind": "Positioning The Battle for Your Mind.jpg",
};

function getLocalCoverPath(title) {
  const filename = coverFilenameOverrides[title] || (title + '.jpg');
  return 'images/books/' + filename;
}

/* CSS-safe path: encode spaces and apostrophes for use inside url('...') */
function cssSafePath(rawPath) {
  return rawPath.replace(/ /g, '%20').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

/* ── Library: Paint cover images onto spine cards (lazy, first visit only) ── */
function preloadSpineCovers() {
  document.querySelectorAll('.spine-card').forEach(card => {
    const title    = card.dataset.title;
    const rawPath  = getLocalCoverPath(title);
    const spineBody = card.querySelector('.spine-body');

    const testImg   = new Image();
    testImg.onload  = function() {
      spineBody.style.backgroundImage    = `url('${cssSafePath(rawPath)}')`;
      spineBody.style.backgroundSize     = 'cover';
      spineBody.style.backgroundPosition = 'center center';
      card.classList.add('cover-loaded');
    };
    /* onerror: leave card as-is (dark spine with text) */
    testImg.src = rawPath;
  });
}

/* ── Library: Open book modal ── */
function openBook(el) {
  const overlay  = document.getElementById('book-overlay');
  const title    = el.dataset.title;
  const author   = el.dataset.author;
  const summary  = el.dataset.summary;
  const isBest   = el.dataset.best === 'true';
  const category = el.dataset.category;

  document.getElementById('modal-title').textContent   = title;
  document.getElementById('modal-author').textContent  = author;
  document.getElementById('modal-summary').textContent = summary;

  const badges = document.getElementById('modal-badges');
  badges.innerHTML = '';
  const catBadge = document.createElement('span');
  catBadge.className   = 'badge badge-blue';
  catBadge.textContent = category;
  badges.appendChild(catBadge);
  if (isBest) {
    const bestBadge = document.createElement('span');
    bestBadge.className   = 'badge badge-amber';
    bestBadge.textContent = '★ best read';
    badges.appendChild(bestBadge);
  }

  const img      = document.getElementById('modal-img');
  const fallback = document.getElementById('modal-fallback');
  fallback.textContent = title;
  img.style.display      = 'none';
  fallback.style.display = 'none';

  /* Try local cover first; fall back to Open Library; then text tile */
  const localPath = getLocalCoverPath(title);
  const localImg  = new Image();
  localImg.onload = function() {
    img.src                = localPath;
    img.style.display      = 'block';
    fallback.style.display = 'none';
  };
  localImg.onerror = function() {
    /* Local image missing — try Open Library */
    const encoded   = encodeURIComponent(title);
    const olUrl     = `https://covers.openlibrary.org/b/title/${encoded}-L.jpg`;
    const remoteImg = new Image();
    remoteImg.onload = function() {
      if (this.naturalWidth < 10) {
        fallback.style.display = 'flex';
      } else {
        img.src                = olUrl;
        img.style.display      = 'block';
        fallback.style.display = 'none';
      }
    };
    remoteImg.onerror = function() {
      fallback.style.display = 'flex';
    };
    remoteImg.src = olUrl;
  };
  localImg.src = localPath;

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/* ── Library: Close book modal ── */
function closeBook() {
  document.getElementById('book-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

const bookOverlay = document.getElementById('book-overlay');
if (bookOverlay) {
  bookOverlay.addEventListener('click', function(e) {
    if (e.target === this) closeBook();
  });
}
