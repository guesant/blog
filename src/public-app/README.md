# Portfolio

Application base built with TanStack Start, TypeScript, pnpm and Material UI.

## Development

Run project commands through the `justfile`; Docker provides Hermit, Moon, Node and pnpm:

```bash
just build
just check
just dev
```

For the other common workflows:

```bash
just audit
just ci
```

The development address is [http://localhost:3000](http://localhost:3000).

## Content

Laravel is the single source of truth for published content. The application consumes paginated,
localized resources through TanStack Start server functions and does not include an editorial admin or
CMS runtime. Localization is field-based and is resolved by Laravel before resources reach the frontend.
The OpenAPI contract used to generate the frontend client lives at
`../../src/laravel/openapi/public-site.json`. It is exported from Laravel with
`just api-spec` before the client is generated.

### Content ownership

The database stores the canonical records, translations, relations, visibility flags and settings.
Home, detail pages, résumé, metadata, structured data, social images and the web manifest consume
Laravel resources rather than a repository copy of editorial content.

### Optional content and empty states

Cases, projects, experiments, writing and findings have a **Hide from the published site** switch in
the database. Hiding content keeps its record and edit history, while removing it from public
listings, detail routes, featured references, navigation and the sitemap.

The home page omits empty work, project, experience, writing and contact sections. Collection pages
remain valid URLs and show a restrained localized empty state. Email, LinkedIn and GitHub links are
rendered independently, so any field may be blank. Disabling **Available for opportunities** removes
the availability indicator and opportunity CTA without removing existing social links from the
footer or résumé.

### Maintenance mode

Settings contains a global **Maintenance mode** switch and a localized notice. When enabled, every
localized public route renders the maintenance page instead of its regular content. Search engines
receive `noindex, nofollow`, `robots.txt` disallows crawling and the sitemap becomes empty. Because
content is loaded through server functions, changing the switch in production takes effect when the
Laravel content API returns the new value.

### SEO and social sharing

The localized **SEO and social sharing** group is available in Settings, pages, cases, projects,
experiments and writing. It supports an optional meta title, meta description, keywords, social
image, image alternative text and `noindex`. Images are stored in the repository; use a 1200 × 630 px
image when possible.

An uploaded image takes priority. When neither the document nor Settings provides one, `/og`
generates a cacheable 1200 × 630 px fallback from the resolved page or post title and description.
The generator receives those resolved values in the image URL and does not query an editor at runtime.

Settings provides the global fallback. A document only needs SEO overrides when its search or social
presentation should differ from its visible title and description. Canonical URLs, locale alternates,
Open Graph type, publication dates and authorship remain application-generated so they cannot drift
from the actual route or document.

The production command is intentionally just `corepack pnpm build` from this directory.

## Component boundaries

Routes compose section entrypoints from `src/components/sections`. Shared primitives and wrappers
live in `src/components/ui`, while styles and low-level visual composition specific to one section
live in that section's `ui` directory. Both UI layers may use Material UI, native elements and
`sx`; route and feature composition layers may only consume those wrappers. Each section exposes
its public components through `index.ts`, so routes do not reach into another section's internals.

## Production metadata

Copy `.env.example` to `.env.local` for local testing, and configure the same variables in the
production environment:

```bash
SITE_URL=https://your-domain.example
GOOGLE_SITE_VERIFICATION=
```

`SITE_URL` is used to generate canonical URLs and language alternates.
`sitemap.xml`. Google Tag Manager takes precedence over direct Google Analytics when both IDs are
present. Either integration is opt-in: no Google script is included before the visitor explicitly
allows usage analytics. The choice is stored only in that browser under
`portfolio:analytics-consent:v1`; choosing **Do not allow** keeps analytics disabled.
