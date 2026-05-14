# Corner Pantry — Website

A single-page marketing website for **Corner Pantry**, a neighborhood liquor store.
Static HTML/CSS/JS — no build step, no dependencies.

## What's inside

**HTML / CSS / JS**
- `index.html` — full site markup. Sections, in order:
  - Age verification modal (21+)
  - Sticky nav, hero (with photo background)
  - Shop by category (Wine / Spirits / Craft Beer / Mixers)
  - Featured bottles ("This week's picks")
  - Tastings & Events
  - Gift cards (with CSS-drawn gift card art)
  - About + stats
  - Customer testimonials
  - FAQ accordion (native `<details>`)
  - Newsletter signup
  - Visit (hours, address, contact) + embedded OpenStreetMap
  - Footer
- `styles.css` — warm dark "cellar" palette with burnished amber accents,
  Cormorant Garamond + Inter typography, responsive grids, mobile nav,
  `prefers-reduced-motion` aware.
- `script.js` — age-gate (session-scoped), mobile nav, scroll reveal,
  footer year, newsletter form validation.

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

## What to customize before launch

Open `index.html` and update:

- **Site URL** — search for `https://www.cornerpantry.example/` and replace
  with your real domain (appears in meta tags, JSON-LD, sitemap, robots).
- **Phone & email** — `(555) 555‑0123` and `hello@cornerpantry.example`.
- **Address & geo** — `123 Main Street` and the `latitude` / `longitude`
  in the JSON-LD block.
- **Hours** — in the visible `#visit` section *and* in the JSON-LD
  `openingHoursSpecification` block.
- **Social profiles** — add Instagram / Facebook / etc. URLs to the
  `sameAs` array in the JSON-LD block (helps Google connect them).
- **Featured bottles** — under `<!-- Featured Picks -->`, swap titles,
  descriptions, and prices.
- **About copy & stats** — `#about`.
- **Events** — `#events`, edit the month/day blocks and event details.
- **Testimonials** — swap the three `<figure class="quote">` blocks.
- **FAQ** — `#faq`, add/remove `<details>` blocks. They work without JS.
- **Map** — the iframe in `.map-card` currently points to a generic NYC
  bounding box on OpenStreetMap. Update the `src` URL's `bbox` (and the
  "Open in maps" link) with your real coordinates, or swap for a Google
  Maps embed.
- **Newsletter** — the submit handler in `script.js` is client-side only.
  To actually collect emails, replace the success branch with a `fetch()`
  POST to your provider (Mailchimp, Buttondown, ConvertKit, etc.).
- **Brand assets** — to use your own logo, replace
  `img/logo-mark.png`, `img/logo-512.png`, `img/logo-192.png`,
  `img/apple-touch-icon.png`, `img/og-image.jpg`, and `favicon.svg`.

Also update `sitemap.xml` and `robots.txt` to use your real domain.

The color theme lives at the top of `styles.css` under `:root` — change
`--amber`, `--wine`, etc. to retheme the whole site.

## Notes

- The age-gate is session-scoped (clears when the browser tab closes). It
  is a UX/compliance pattern, not a legal substitute for ID at the register.
- "No, exit" sends visitors to a responsible-drinking resource.
- The site is fully responsive and respects `prefers-reduced-motion`.
- External requests: Google Fonts and the OpenStreetMap iframe only.
