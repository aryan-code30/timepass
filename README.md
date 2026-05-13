# Corner Pantry — Website

A single-page marketing website for **Corner Pantry**, a neighborhood liquor store.

## What's inside

- `index.html` — Markup for the full site (hero, shop categories, featured bottles, about, hours/contact, footer) plus an age-verification modal.
- `styles.css` — Modern responsive styling. Warm dark "cellar" palette with burnished amber accents, Cormorant + Inter typography, accessible focus/contrast.
- `script.js` — Age-gate (session-scoped), mobile nav toggle, scroll reveal, and footer year.

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

The color theme lives at the top of `styles.css` under `:root` — change `--amber`, `--wine`, etc. to retheme the whole site.

## Notes

- The age-gate is session-scoped (clears when the browser tab closes). It is a UX/compliance pattern, not a legal substitute for ID verification at the register.
- "No, exit" sends visitors to a responsible-drinking resource.
- The site is fully responsive and respects `prefers-reduced-motion`.
