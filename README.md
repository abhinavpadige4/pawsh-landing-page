# Pawsh — Dog Grooming Salon Landing Page

A responsive, accessible static landing page for **Pawsh**, a premium dog grooming salon. Built with plain HTML, CSS, and vanilla JavaScript — no build step required.

## Features

- **Hero Section** — Full-width banner with salon name, tagline, and call-to-action
- **Services Grid** — Cards showcasing grooming, bathing, nail trimming, and styling services
- **Gallery** — Image grid with hover effects showcasing grooming results
- **Testimonials** — Client reviews with star ratings and quotes
- **Booking Modal** — Interactive form with validation for appointment requests
- **Sticky CTA** — Persistent call-to-action button for mobile users
- **Footer** — Contact info, social links, and business hours
- **Mobile Menu** — Hamburger toggle for responsive navigation
- **Lazy Loading** — Images load on demand via IntersectionObserver

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | Tailwind CSS (CDN) + custom CSS with design tokens |
| JavaScript | Vanilla ES6 — no frameworks |
| Fonts | Playfair Display (headings), Helvetica Neue (body) |
| Deployment | Vercel (static site) |

## Design Tokens

| Token | Value |
|-------|-------|
| Primary | `#FF6B6B` |
| Secondary | `#4ECDC4` |
| Dark | `#2F3E46` |
| Light | `#F7FFF7` |
| Muted | `#A8D0DB` |

Breakpoints: `sm: 576px`, `md: 768px`, `lg: 992px`, `xl: 1200px`

## File Structure

```
├── index.html              # Main landing page markup
├── css/
│   ├── _variables.css      # CSS custom properties
│   ├── base.css            # Global reset & typography
│   ├── main.css            # Imports all components
│   └── components/
│       ├── hero.css        # Hero section styles
│       ├── services.css    # Services grid & cards
│       ├── gallery.css     # Gallery grid & hover effects
│       ├── testimonials.css # Testimonial cards
│       ├── cta.css         # Sticky CTA button
│       └── footer.css      # Footer layout
├── js/
│   ├── main.js             # Init, mobile menu, lazy-load
│   └── booking-modal.js    # Modal logic & form validation
├── .htaccess               # Cache-control headers
└── README.md               # This file
```

## Setup

No build step or package manager required.

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd pawsh
   ```

2. **Open locally**
   ```bash
   # Option A: Open index.html directly in a browser
   open index.html

   # Option B: Use a local server
   npx serve .
   ```

3. **Verify** — Navigate to `http://localhost:3000` and confirm all sections render.

## Deployment

Deploy to Vercel:

1. Push the repository to GitHub/GitLab/Bitbucket
2. Import the project at [vercel.com](https://vercel.com)
3. Set **Framework Preset** to `Static`
4. Set **Build Command** to empty (no build step)
5. Set **Output Directory** to `.`
6. Click **Deploy**

The `.htaccess` file provides cache-control headers for static assets when served behind Apache. Vercel handles caching automatically.

## Accessibility

- WCAG AA compliant color contrast
- ARIA labels on interactive elements
- Focus-visible outlines on all focusable elements
- Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Keyboard-navigable modal with focus trap
- Alt text on all images

## Performance

- Tailwind CSS loaded via CDN with minimal custom CSS
- Images lazy-loaded via IntersectionObserver
- No JavaScript frameworks — minimal bundle size
- Browser caching via `.htaccess` headers
- Fonts loaded with `display: swap` for non-blocking rendering

## License

MIT — free to use for any purpose.