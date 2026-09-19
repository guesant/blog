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

Laravel is the single source of truth for published content. The application consumes its localized
snapshot through TanStack Start server functions and does not include an editorial admin or CMS runtime.
The versioned JSON documents remain available to local generation tools and tests under
`content-runtime/content/cms`.

Localization is field-based: each
page, case study, project, experiment, post, profile and résumé document contains `translations.en`
and `translations.ptBR`. Rich editorial content is stored as structured JSON. Global identity,
contact, availability and maintenance settings live in `content/cms/settings/site.json`.

### Content ownership

Content documents are normalized as a single source of truth:

- `profile/profile.json`: name, professional profile and experience;
- `settings/site.json`: short identity, contact, social links, optional Lattes URL and availability;
- `cases`, `projects`, `experiments` and `writing`: one canonical document per entity;
- `pages/*.json`: page-specific introductions and ordered references to featured entities;
- `resume/resume.json`: résumé summary, skills and references to selected cases.

The résumé also supports a shared language-proficiency list. Each item references one stable
language, records either `native` or an optional CEFR level (`A1`–`C2`), and resolves its localized
name from that language document. The list is available to the content pipeline but is not rendered publicly yet.

Home, detail pages, résumé, metadata, structured data, social images and the web manifest consume
these canonical documents. Page documents reference projects and cases instead of copying their
titles, summaries, technologies or links. Stable values such as profile name and technology lists
are shared fields outside the localized objects; only content that actually changes by language is
stored under `translations`.

### Optional content and empty states

Cases, projects, experiments and writing documents have a **Hide from the published site** switch
in the content data. Professional experience entries have the same switch inside each locale. Hiding content
keeps its JSON and edit history, while removing it from public listings, detail routes, featured
references, navigation and the sitemap.

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
