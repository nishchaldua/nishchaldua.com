# nishchaldua.com

Personal website for Nishchal Dua — GTM + AI operator.  
Designed to look and feel like a Claude AI chat interface.

---

## File Structure

```
nishchaldua.com/
├── index.html          ← All HTML content and structure
├── css/
│   ├── tokens.css      ← Design tokens (colours, fonts, spacing vars)
│   ├── base.css        ← Reset and html/body defaults
│   ├── animations.css  ← @keyframes (pulse + fadeIn only)
│   ├── layout.css      ← Shell, sidebar, main area, header, input bar
│   ├── components.css  ← Messages, cards, badges, chips, framework blocks, contact
│   └── responsive.css  ← Mobile breakpoint (≤700px)
├── js/
│   └── app.js          ← Tab switching and chip navigation logic
└── README.md
```

**Where to make edits:**

| What you want to change | File to edit |
|---|---|
| Colours, fonts, spacing | `css/tokens.css` |
| Page content / copy | `index.html` |
| A specific component's style | `css/components.css` |
| Sidebar or main area layout | `css/layout.css` |
| Tab switching behaviour | `js/app.js` — update `tabMeta` object too |
| Add a new tab | See checklist below |

---

## Deploying to GitHub Pages

1. Create a GitHub repo (public). Name it `your-username.github.io` for a root URL, or any name for a custom domain.
2. Push this entire folder as the repo root (so `index.html` is at `/`).
3. Go to **Settings → Pages → Source → Deploy from branch → main → / (root) → Save**.
4. Site is live at `https://your-username.github.io` within 2–5 minutes.

### Custom domain (GoDaddy → GitHub Pages)

Add these DNS records in GoDaddy:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | your-username.github.io |

Then in GitHub Pages settings: enter your custom domain and enable **Enforce HTTPS**.  
DNS propagates in 10–60 minutes.

### Updating the site

Edit files locally → commit → push. GitHub Pages rebuilds in ~1–2 minutes.

---

## Adding a New Tab

Checklist:

- [ ] Add a `.nav-item` to the sidebar in `index.html` with `data-tab="name"` and the correct dot colour
- [ ] Add an entry to the `tabMeta` object in `js/app.js` with `title` and `sub` strings
- [ ] Add a `.tab-content` div in `index.html` with `id="tab-name"`
- [ ] Choose a layout type: Chat (message bubbles) · Cards · Frameworks · Contact
- [ ] Open with the correct layout starter (message bubble → chat/framework, section-intro → cards)
- [ ] End with a `.chip-row` pointing to contextually relevant next tabs
- [ ] Test: sidebar click, chip navigation, header update, scroll-to-top

---

## Design Rules (non-negotiable)

- **0.5px borders everywhere** — only exception: section intro left border is 2px
- **Font weights 400 and 500 only** — never 600 or 700
- **Dark mode only** — no light mode, no system preference detection
- **Accent colour** (`#c9a96e`) is for text and small elements only — never large backgrounds
- **Geist Mono** for all metadata, labels, badges, timestamps, numbers — never body copy
- **Instrument Serif** for section intro quotes only — always italic, max one per tab
- **No gradients, no shadows, no glow effects**
- **No new animations** — only the two keyframes in `animations.css` are permitted
- **Input bar stays non-functional** — cursor: default, no event listeners
- **Chips always end with →**
- **Badge text always lowercase**
