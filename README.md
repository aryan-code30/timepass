# Corner Pantry — Website

A single-page marketing website for **Corner Pantry**, a neighborhood liquor store.

## What's inside

- `index.html` — Markup for the full site:
  - Age verification modal (21+)
  - Sticky nav, hero
  - Shop by category (Wine / Spirits / Craft Beer / Mixers)
  - Featured bottles (this week's picks)
  - Tastings & Events
  - Gift cards (with CSS-drawn gift card art)
  - About + stats
  - Customer testimonials
  - FAQ accordion (native `<details>`)
  - Newsletter signup
  - Visit (hours, address, contact) with an embedded OpenStreetMap
  - Footer
- `styles.css` — Modern responsive styling. Warm dark "cellar" palette with burnished amber accents, Cormorant + Inter typography, accessible focus/contrast.
- `script.js` — Age-gate (session-scoped), mobile nav toggle, scroll reveal, footer year, and a client-side newsletter form with validation.
- `favicon.svg` — Inline SVG favicon (the CP monogram).

No build step, no dependencies — just static files.

## Run it locally

Open `index.html` directly in your browser, or serve the folder with any static server, e.g.:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## What to customize

When you're ready to make it yours, edit `index.html` and update:

- **Phone & email** — search for `(555) 555‑0123` and `hello@cornerpantry.example`.
- **Address** — search for `123 Main Street`.
- **Hours** — in the `#visit` section.
- **Featured bottles** — under `<!-- Featured Picks -->`, swap titles, descriptions, and prices.
- **About copy & stats** — under the `#about` section.
- **Events** — under `#events`, edit the month/day blocks and event details.
- **Testimonials** — swap the three `<figure class="quote">` blocks for real customer quotes.
- **FAQ** — under `#faq`, add/remove `<details>` blocks. They work without JS.
- **Map** — the `iframe` under `.map-card` currently points to a generic NYC bounding box on OpenStreetMap. Update the `src` URL's `bbox` (and the link below it) with your real coordinates. You can also swap it for a Google Maps embed if you prefer — just replace the iframe `src`.
- **Newsletter** — the submit handler in `script.js` is currently client-side only (validates and shows a success message). To actually collect emails, replace the success branch with a `fetch()` POST to your mailing-list provider (Mailchimp, Buttondown, ConvertKit, etc.).

The color theme lives at the top of `styles.css` under `:root` — change `--amber`, `--wine`, etc. to retheme the whole site.

## Notes

- The age-gate is session-scoped (clears when the browser tab closes). It is a UX/compliance pattern, not a legal substitute for ID verification at the register.
- "No, exit" sends visitors to a responsible-drinking resource.
- The site is fully responsive and respects `prefers-reduced-motion`.
