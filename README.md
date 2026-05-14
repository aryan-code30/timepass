# Corner Pantry — Website

A single-page marketing website for **Corner Pantry**, a family-run
neighborhood corner store in Carol Stream, IL. Snacks, frozen, groceries,
plus wine, spirits, and craft beer.

Static HTML/CSS/JS — no build step, no dependencies.

## What's inside

**HTML / CSS / JS**
- `index.html` — full site markup. Sections, in order:
  - Sticky nav with **Shop dropdown mega-menu**
    (two columns: Pantry & everyday / Bottle shop)
  - Hero (with photo background)
  - **Shop browser** — filter pills + product grid (52 items across
    8 categories, dynamically rendered and filterable)
  - Delivery (DoorDash, Grubhub, Seamless, order.online)
  - Featured bottles ("This week's picks", 21+)
  - Tastings & Events
  - **Corner Pantry Rewards** — sign-up + balance card + redemption tiers
  - About + stats
  - Customer testimonials
  - FAQ accordion (native `<details>`)
  - Newsletter signup
  - Visit (hours, address, contact) + embedded map with Google Maps link
  - Footer (with 21+ alcohol notice)
- `styles.css` — warm dark "cellar" palette with burnished amber accents,
  Cormorant Garamond + Inter typography, responsive grids, mobile nav,
  `prefers-reduced-motion` aware.
- `script.js` — mobile nav, scroll reveal, footer year, newsletter
  form validation, the **Shop browser** (Shop dropdown mega-menu open
  /close + outside-click + Escape handling; product catalog data;
  filter pills with live counts and status line), and the **Rewards**
  client (sign-up, balance, tier progress, sign-out).

**Brand assets**
- `favicon.svg` — vector favicon (CP monogram in amber on dark)
- `img/logo-mark.png` — primary logo mark (1024×1024)
- `img/logo-512.png`, `img/logo-192.png` — PWA icons
- `img/apple-touch-icon.png` — 180×180 iOS home-screen icon
- `img/hero-bg.jpg` — hero background photograph (~300 KB, optimized)
- `img/og-image.jpg` — Open Graph / Twitter share card (1200×630)

**SEO & PWA**
- `<head>` includes Open Graph + Twitter cards, canonical URL, theme color
- JSON-LD `LiquorStore` schema with hours, geo, contact (helps Google
  show your hours and address directly in search results)
- `site.webmanifest` so the site can be installed as a PWA
- `robots.txt` and `sitemap.xml`

**Deploy configs**
- `netlify.toml` — Netlify deploy config with sensible security + cache headers
- `vercel.json` — Vercel deploy config with the same headers

## Run it locally

Open `index.html` directly in your browser, or serve the folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy

This site is just static files in this folder, so it works on any static host.

### Netlify (easiest)

Two ways:

1. **Drag-and-drop**: zip the folder (or just drag the unzipped folder) onto
   <https://app.netlify.com/drop>. Done in 30 seconds.
2. **Git-connected**: in Netlify, "Add new site → Import from Git", point at
   this repo. The included `netlify.toml` already sets the publish directory
   and security/cache headers. No build command needed.

### Vercel

In Vercel, "Add New → Project → Import Git Repository". The included
`vercel.json` configures headers and clean URLs. Framework preset:
**Other**. Build command: leave empty. Output directory: leave default.

### GitHub Pages

In the repo, **Settings → Pages → Source: Deploy from branch**, pick the
branch and `/ (root)`. Save. Your site will be live at
`https://<username>.github.io/<repo>/` within a minute.

### Cloudflare Pages

"Create a project → Connect to Git", pick the repo, leave build command
empty, and set "Build output directory" to `/`. Done.

### Custom domain

After your site is up on any of the above, point your domain (or
subdomain like `www.cornerpantry.com`) at it via the host's DNS
instructions. Then come back and update the placeholder URLs (see below).

## Real business details (wired in)

The site is already configured with the real Corner Pantry info:

- **Name:** Corner Pantry (a.k.a. Patel Corner Pantry)
- **Address:** 331 S Schmale Rd, Carol Stream, IL 60188
- **Phone:** (630) 752‑0631
- **Hours:** Daily, 7am – 12:30am
- **Google Maps:** https://share.google/ACtTM17oWck8ZRb4S
- **Delivery:** DoorDash, Grubhub, Seamless, order.online

## Still to customize before launch

Open `index.html` and update:

- **Site URL** — search for `https://www.cornerpantry.example/` and
  replace with your real domain everywhere it appears (meta tags, JSON-LD,
  sitemap, robots). Do the same in `sitemap.xml` and `robots.txt`.
- **Email address** — there's currently no email on the site (we removed
  the placeholder). If you want one, add it back to the `#contact` block
  and to the JSON-LD as `"email": "..."`.
- **Geo coordinates** — the JSON-LD uses approximate Schmale Rd coords
  (41.8934, -88.1037). If you want building-exact precision, replace
  with the real lat/long.
- **Delivery URLs** — the four tiles in `#delivery` currently link to
  each platform's search results for "Corner Pantry Carol Stream". Once
  you know the direct merchant URLs (e.g. your specific DoorDash store
  page), swap them in.
- **Social profiles** — add Instagram / Facebook / etc. URLs to the
  `sameAs` array in the JSON-LD block (helps Google connect them).
- **Featured bottles** — under `<!-- Featured Picks -->`, swap titles,
  descriptions, and prices for what's actually on your shelves.
- **About copy & stats** — `#about`.
- **Events** — `#events`, edit the month/day blocks and event details
  (or delete the section if you don't run events).
- **Testimonials** — swap the three `<figure class="quote">` blocks for
  real customer quotes from your Google reviews.
- **FAQ** — `#faq`, add/remove `<details>` blocks. They work without JS.
- **Newsletter** — the submit handler in `script.js` is client-side only.
  To actually collect emails, replace the success branch with a `fetch()`
  POST to your provider (Mailchimp, Buttondown, ConvertKit, etc.) — or
  remove the newsletter section entirely if you don't want it.
- **Brand assets** — to use your own logo, replace
  `img/logo-mark.png`, `img/logo-512.png`, `img/logo-192.png`,
  `img/apple-touch-icon.png`, `img/og-image.jpg`, and `favicon.svg`.

The color theme lives at the top of `styles.css` under `:root` — change
`--amber`, `--wine`, etc. to retheme the whole site.

## Shop browser — how it works

The Shop section renders products from a `PRODUCTS` array in
`script.js`. The site ships with **52 sample items** across 8
categories (chosen to look believable for a corner store with a
serious bottle shelf).

### Categories

| Key | Label | 21+ |
| --- | ----- | --- |
| `snacks`   | Snacks & Candy      | — |
| `frozen`   | Frozen              | — |
| `pantry`   | Pantry & Groceries  | — |
| `drinks`   | Drinks & Mixers     | — |
| `wine`     | Wine                | Yes |
| `spirits`  | Spirits             | Yes |
| `beer`     | Craft Beer          | Yes |
| `cocktail` | Cocktail Aisle      | Yes |

Each category has its own color tone for the product card art (see
`CATEGORIES` in `script.js`). Age-restricted categories automatically
get a 21+ pill on every product card.

### Editing the catalog

Open `script.js`, find the `PRODUCTS` constant, and add / remove /
edit objects:

```js
{ cat: "snacks", name: "Hershey's Milk Chocolate", size: "1.55 oz", price: "$2.49", desc: "The classic." },
```

The filter pill counts, dropdown menu, and product grid all update
automatically — there is nothing else to change.

### Wiring to a real inventory feed

The `PRODUCTS` array is a swap point. To pull from a live source
(POS export, Google Sheet, CSV, or backend API), replace the
hard-coded `const PRODUCTS = [...]` with an async load:

```js
const PRODUCTS = await fetch("/api/products").then((r) => r.json());
```

…or a CSV / Google-Sheet fetch + parse. The rendering pipeline
(`renderProducts()`, `updateCounts()`, `applyFilter()`) doesn't
need any other changes.

### Shop dropdown mega-menu

Clicking **Shop** in the nav opens a two-column panel:

- **Pantry & everyday** — Snacks / Frozen / Pantry / Drinks
- **Bottle shop** (with a 21+ pill) — Wine / Spirits / Beer / Cocktail

Each link selects that filter and smooth-scrolls to the Shop section.
The dropdown closes on outside click, on Escape, and after a
selection. Fully keyboard accessible.

On mobile, the dropdown becomes an inline accordion inside the
hamburger drawer (no overflow issues).

## Corner Pantry Rewards — how it works

The site ships with a working **client-side prototype** of a loyalty
program. The UX is real (sign up, see your balance, watch a progress bar
fill toward the next tier, sign out), but the data lives in
`localStorage` on the customer's device.

**Default tiers** (edit in `script.js` `TIERS` and in the `<ul id="tiers-list">` markup):

| Points | Reward                                  |
| -----: | --------------------------------------- |
|    100 | $5 off your next order                  |
|    250 | Free Corner Pantry pint glass           |
|    500 | $25 store credit                        |
|  1,000 | $60 credit + a handpicked bottle        |

Sign-ups get a **50-point welcome bonus** (`WELCOME_BONUS` in `script.js`).

### Making it real

To run an actual loyalty program, you'll need a backend that:

1. Stores customer accounts (name + phone is the natural key).
2. Credits points when an order is paid — for in-store orders this is
   easiest if you use a POS like Square or Toast and turn on their
   built-in loyalty product. For delivery orders, each platform has a
   different story (DoorDash/Grubhub don't directly expose order
   webhooks to the merchant; some merchants reconcile manually).
3. Lets the customer redeem at checkout (show phone → POS deducts points).

Easiest paths, ranked by effort:

- **Square Loyalty** — if you already use Square for the POS, this is
  basically a checkbox. The site's sign-up form would POST to your
  Square customer directory; balance lookups would hit Square's API.
- **Toast Loyalty / Clover Rewards** — same story, different POS.
- **Third-party loyalty SaaS** (Loverse, FiveStars, Belly, Smile.io) —
  drop-in services that handle accounts, points, and redemption.
- **Custom backend** — biggest lift; only worth it if the above don't fit.

In all cases, the changes to this site are small: in `script.js`, replace
the `localStorage` calls inside `loadCard`, `saveCard`, and the form
`submit` handler with `fetch()` calls to your chosen provider. The UI
and tier ladder don't need to change.

## Notes

- **No age gate on the front page.** Corner Pantry sells groceries,
  snacks, frozen, and other items that customers of any age can buy.
  Alcohol is one category among many, so we don't block the site with
  a 21+ modal. Instead:
  - The Bottle Shop category group is labeled with a "21+" pill and a
    "Must be 21+ to purchase alcohol. We ID at the register." line.
  - The Featured Bottles section eyebrow shows the same "21+" pill.
  - The footer carries the legal "Must be 21+ to purchase alcohol. We
    card." notice on every page view.
  - IDs are checked at the register / on delivery, which is where
    age verification legally happens anyway.
- The Rewards card is stored in `localStorage` (not a cookie) and never
  leaves the customer's device — until you wire it up to a backend.
- The site is fully responsive and respects `prefers-reduced-motion`.
- External requests: Google Fonts and the OpenStreetMap iframe only.
