# ToolKitFree

A browser-only toolkit for everyday PDF, image, text, developer and utility tasks. Built with React, TypeScript, Vite, Tailwind CSS, a locally owned shadcn-style Button, Radix Slot and Lucide icons.

**52 tools. No application accounts, subscriptions, watermarks, database or file upload endpoint.**

## Quick start

Requirements: Node.js 22.19+ (or a supported newer release) and npm.

~~~sh
npm ci
npm run dev
~~~

Open the Local URL printed by Vite (normally http://127.0.0.1:5173).

~~~sh
npm run check
npm test
npm run build
npm run preview
~~~

The production output is **dist/**. Each tool has prerendered HTML, unique title and description, canonical and Open Graph metadata, WebApplication and FAQPage structured data, and a generated sitemap.

For browser regression checks, install Chromium once with **npx playwright install chromium**, start **npm run preview** in a second terminal, then run **npm run qa**. Test results and fixtures go in **.qa/**.

## Change the brand

Edit **src/config/site.ts**. This is the source of the site name, tagline, public origin, contact and support links, analytics and ad settings.

Copy .env.example to .env.local for local settings. Set VITE_SITE_URL to your real public domain before a public build. All VITE_ variables are public; never put secrets in them.

| Setting | Purpose | Default |
| --- | --- | --- |
| VITE_SITE_URL | Canonical origin and sitemap | Private preview origin |
| VITE_CONTACT_EMAIL | Real contact address and email draft link | Empty; feedback downloads locally |
| VITE_SUPPORT_URL | Optional donation/support URL | Empty; links to the support section |
| VITE_ADS_ENABLED | Show reserved ad placements | false |
| VITE_PLAUSIBLE_DOMAIN | Opt in to page-path analytics | Empty; disabled |
| VITE_PLAUSIBLE_SCRIPT | Plausible manual-events script | script.manual.js |

The ads flag reserves space; it does not load an ad network. Add your approved ad integration to AdSlot and update the privacy policy before enabling it. Never send tool content, filenames, passwords, data URLs, results or query strings to analytics.

## Project layout

~~~text
src/
  config/site.ts             Brand and deployment settings
  config/tools.ts            Tool and category catalog
  components/
    ui/button.tsx            Local shadcn-style Button
    UploadZone.tsx           Drop, picker, paste and validation
    FileList.tsx             Thumbnails and accessible ordering
    ToolLayout.tsx           Shared workspace and SEO content
    ResultCard.tsx           Download, ZIP, progress and copy
    ToolCard.tsx             Catalog cards
    SearchBar.tsx            Accessible autocomplete
    FAQ.tsx                  Native accessible accordion
  pages/                     Home, directory and information pages
  tools/
    pdf/                     PDF workspaces
    image/                   Images, Base64 and color picker
    text/                    Text editing and comparison
    developer/               JSON, code and data tools
    utility/                 QR, barcode, passwords and calculators
  lib/                       Algorithms, rendering and worker API
  workers/                   Cancellable background processing
  styles.css                 Design tokens and responsive themes
scripts/
  prerender-entry.ts         Deployment environment
  prerender.tsx              Static pages, SEO and service worker
  browser-qa.mjs             Browser regression checks
  make-icons.py              Reproducible PNG app icons
tests/core.test.ts           Algorithms, validation and catalog tests
public/                      Install icons
~~~

## Add a tool

1. Create src/tools/example/MyTool.tsx with a default component accepting a tool prop of type Tool.
2. Add a catalog entry in src/config/tools.ts with name, slug, category, icon, description, keywords and component: 'example/MyTool'. Optionally add seoTitle, note or popular.

The lazy registry discovers components automatically. Routing, category listings, search, footer links, related tools, metadata and sitemap come from the catalog. Set popularSlugs to curate homepage favorites. Add specific FAQs in src/lib/seo.ts.

Reuse UploadZone, FileList, Results, useTask, Field and worker helpers. Keep heavy imports out of the homepage. Revoke object URLs and terminate workers when jobs finish or are cancelled.

## Implemented tools

- **PDF (13):** merge, grouped/every-N/page-range split, target-size compression, rotate, delete, extract, reorder, image to PDF, PDF to JPG/PNG, page numbers, text watermark, AES-256 protect, password-based unlock.
- **Images (11):** quality compression, target KB/MB, pixel/percentage/preset resize, dimensions plus size with centimeter/DPI calculations, crop, format conversion, rotate/flip, metadata removal, image/Base64 conversion, image color picker.
- **Text (9):** case conversion, word counts, deduplication, sorting, whitespace cleanup, side-by-side diff, lorem ipsum, literal/regex find-replace, slugs.
- **Developer (12):** JSON formatting/validation/minification/tree, JSON/CSV, Base64, URL encoding, HTML/CSS/JS formatting/minification, regex, UUID, hashes, JWT, timestamps, colors, XML/YAML.
- **Utilities (7):** QR, barcode, secure passwords, units, age, EMI, percentages.

## Processing and practical limits

- Inputs stay in browser memory. Application assets download from the host. No processing server is used.
- PDF edits use pdf-lib in a worker; PDF rendering uses PDF.js's worker; password operations use QPDF WebAssembly in a disposable worker.
- Image encoding and target searches use OffscreenCanvas in a worker. HEIC decoding uses heic2any locally.
- Regex operations have a four-second worker deadline. JSON and code formatting have longer cancellable deadlines.
- Images accept batches of up to 20. There are no daily quotas or paid tiers. Device memory and file complexity are real limits. Canvas exports are bounded to 64 megapixels and 16,384 pixels per side to prevent browser crashes.
- Target size means **at or below** the requested bytes, without padding. KB = 1,000 bytes; MB = 1,000,000 bytes. Quality is searched iteratively; dimensions may shrink unless fixed by the dimensions-and-size tool. If no candidate fits, the smallest found is offered with a warning.
- PDF compression rebuilds pages as images and can remove text selection, forms, links, accessibility structure and signatures. This is disclosed in the UI. If output is larger, the original is offered.
- PDF editing can invalidate signatures. Merge/split preserve page content; document bookmarks and metadata are not guaranteed.
- Unlock requires the existing password. There is no password guessing or recovery. Passwords are not stored. Text watermarks support the Latin characters available in Helvetica.
- JPG, PNG, WebP and browser-supported AVIF can be read. HEIC works when the bundled decoder supports the file. Export supports JPG, PNG and WebP. AVIF export checks browser capability and reports when unavailable.
- Transparent pixels become white in JPEG. Re-encoding removes embedded EXIF/GPS tags, not information visible in the photo. Animated image inputs are treated as still images.
- DPI converts centimeters to pixels; an embedded print-density tag is not guaranteed. Use matching DPI settings in printing software.
- JSON uses JavaScript number precision. Quote identifiers above the safe integer range. Large trees progressively reveal entries.
- JWT decoding does not verify signatures. MD5 and SHA-1 are compatibility utilities, not password-storage algorithms.
- Calendar ages clamp anniversaries to the last day of shorter months. EMI excludes fees and rate changes.
- QR codes are static, contain entered data directly, and have no redirect service or expiry. Test logo QR codes before printing.
- Offline mode caches code as it is loaded. Use a tool online once before relying on it offline. Optional codecs must also load once.
- The application has no signup. A private hosting preview can require platform sign-in. Anonymous visitors need public hosting.

## Deployment

Use HTTPS for cryptography, clipboard, PWA and service-worker support.

### Vercel

Import the repository. Build: npm run build. Output: dist. Node: 22 or newer. Set VITE_SITE_URL and other environment variables. The included vercel.json handles routing and basic headers.

### Netlify

Import the repository; netlify.toml defines build and output. Add environment variables. Generated _redirects provides deep-link access; existing prerendered files take priority.

### Cloudflare Pages

Use the Vite preset, npm run build, output dist, and NODE_VERSION=22. Set VITE_SITE_URL. Generated _headers, _redirects and static pages require no backend or bindings.

### Public launch

Configure a real domain and contact address, review policy text for your operator and integrations, and test representative files on target mobile browsers. Enable ads only after approval from the ad network. Code cannot guarantee ad-network approval, search rankings or Lighthouse scores across every device and host.

## Design and licenses

Indigo #4F46E5, green success states, soft category accents, self-hosted Inter, 12–16 px card corners, focus rings and reduced-motion support. Theme preference stays local. CSS tokens control light and dark themes.

Dependencies retain their licenses. PDF.js is Apache-2.0; pdf-lib and jsPDF are MIT; the QPDF wrapper is ISC with upstream QPDF licensing. See the distributed dependency licenses before redistributing modified binaries.
