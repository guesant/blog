# Portfolio

Application base built with Next.js, TypeScript, pnpm and Material UI.

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

## Local CMS

TinaCMS is available only in development and uses the versioned JSON files as its source of truth. Start the CMS without Next.js with:

```bash
just cms
```

Then open:

- Admin: [http://localhost:4100/admin/](http://localhost:4100/admin/)
- GraphQL playground: [http://localhost:4001](http://localhost:4001)
- Data layer: [http://localhost:9000](http://localhost:9000)

Tina writes directly to versioned JSON files under `../content/content/cms`. The admin is intentionally served by a separate static process, so it does not require Next.js to edit content. Run `just dev` when contextual editing and the Next.js preview at [http://localhost:3000](http://localhost:3000) are needed.
Localization is field-based: each
page, case study, project, experiment, post, profile and résumé document contains `translations.en`
and `translations.ptBR`. Rich editorial content is stored as Tina rich-text JSON. Global identity,
contact, availability and maintenance settings live in `content/cms/settings/site.json`.

Use the collection form for structured editing, or open a document and choose **Enter Edit Mode**
for contextual editing in the page preview. The editorial components use `useTina()` to receive
local preview updates and `tinaField()` to connect visible elements to their fields. Navigation,
button labels and accessibility microcopy remain in `messages/*.json`; they are interface strings,
not editorial content.

The application consumes the internal `@portfolio/content` API during `next build`, so the published
site remains SSG and has no Tina API dependency. Only that package owns the Tina adapter; its editing
API supplies the serialized data used by the local editing iframe.

### Content ownership

CMS documents are normalized as a single source of truth:

- `profile/profile.json`: name, professional profile and experience;
- `settings/site.json`: short identity, contact, social links, optional Lattes URL and availability;
- `cases`, `projects`, `experiments` and `writing`: one canonical document per entity;
- `pages/*.json`: page-specific introductions and ordered references to featured entities;
- `resume/resume.json`: résumé summary, skills and references to selected cases.

The résumé also supports a shared language-proficiency list. Each item references one stable
language, records either `native` or an optional CEFR level (`A1`–`C2`), and resolves its localized
name from that language document. The list is CMS-ready but is not rendered publicly yet.

Home, detail pages, résumé, metadata, structured data, social images and the web manifest consume
these canonical documents. Page documents reference projects and cases instead of copying their
titles, summaries, technologies or links. Stable values such as profile name and technology lists
are shared fields outside the localized objects; only content that actually changes by language is
stored under `translations`.

### Optional content and empty states

Cases, projects, experiments and writing documents have a **Hide from the published site** switch
in Tina. Professional experience entries have the same switch inside each locale. Hiding content
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
receive `noindex, nofollow`, `robots.txt` disallows crawling and the sitemap becomes empty. The
Tina admin remains available locally as a separate service on port 4100; it is not part of the published Next.js application.
Because the site is SSG, changing the switch in production takes effect after the CMS file is
committed and a new build is deployed.

### SEO and social sharing

The localized **SEO and social sharing** group is available in Settings, pages, cases, projects,
experiments and writing. It supports an optional meta title, meta description, keywords, social
image, image alternative text and `noindex`. Images are stored in the repository through Tina's
local media manager; use a 1200 × 630 px image when possible.

An uploaded image takes priority. When neither the document nor Settings provides one, `/og`
generates a cacheable 1200 × 630 px fallback from the resolved page or post title and description.
The generator receives those resolved values in the image URL and does not query Tina at runtime.

Settings provides the global fallback. A document only needs SEO overrides when its search or social
presentation should differ from its visible title and description. Canonical URLs, locale alternates,
Open Graph type, publication dates and authorship remain application-generated so they cannot drift
from the actual route or document.

The production command is intentionally just `next build`. Do not add `tinacms build` to it: the
admin panel and local GraphQL API are development-only. Commit `../content/tina/tina-lock.json`, but do not
commit generated `../content/public/admin` or `../content/tina/__generated__` files.

## Production metadata

Copy `.env.example` to `.env.local` for local testing, and configure the same variables in the
production environment:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
GOOGLE_SITE_VERIFICATION=

NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
```

`NEXT_PUBLIC_SITE_URL` is used to generate canonical URLs, language alternates, `robots.txt` and
`sitemap.xml`. Google Tag Manager takes precedence over direct Google Analytics when both IDs are
present. Either integration is opt-in: no Google script is included before the visitor explicitly
allows usage analytics. The choice is stored only in that browser under
`portfolio:analytics-consent:v1`; choosing **Do not allow** keeps analytics disabled.
