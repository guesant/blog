import type {
  CreditsContent,
  InterfaceMessages,
  Profile,
  Reference,
  ReferenceCollection,
  ResumeContent,
  SiteText,
  TechnologyBadge,
} from '../../domain/types.ts';
import type { ContentCollection, ContentLocale } from '../tina/filesystem-source.ts';
import interfaceDocument from '../../../content/cms/settings/interface.json';

type RecordValue = Record<string, any>;

type Snapshot = RecordValue & {
  chrome: RecordValue;
  pages: Record<string, RecordValue>;
  projects: RecordValue[];
  cases: RecordValue[];
  writings: RecordValue[];
  findings: RecordValue[];
  collections: RecordValue[];
  topics: RecordValue[];
  technologies: RecordValue[];
  experiments: RecordValue[];
  credits: RecordValue[];
};

const snapshots = new Map<ContentLocale, Promise<Snapshot>>();

export function normalizeLocale(locale?: string): ContentLocale {
  return locale === 'pt-BR' ? 'pt-BR' : 'en';
}

function apiUrl(locale: ContentLocale): string {
  const base = process.env.PORTFOLIO_CONTENT_API_URL ?? 'http://laravel:8000/api/v1/public-site';
  return `${base}?locale=${encodeURIComponent(locale)}`;
}

async function getSnapshot(locale?: string): Promise<Snapshot> {
  const normalized = normalizeLocale(locale);
  const cached = snapshots.get(normalized);
  if (cached) {
    return cached;
  }

  const request = fetch(apiUrl(normalized), {
    next: { revalidate: 60, tags: [`public-site:${normalized}`] },
  } as RequestInit).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Public site API returned ${response.status}`);
    }

    return (await response.json()) as Snapshot;
  });

  snapshots.set(normalized, request);
  return request;
}

function slugFromKey(value: unknown): string {
  const slug = String(value ?? '');
  return /^[0-9a-f]{6}-/.test(slug) ? slug.slice(7) : slug;
}

function reference(item: RecordValue): Reference {
  return {
    hidden: false,
    order: 0,
    slug: item.slug,
    type: item.type ?? '',
    authors: item.authors ?? '',
    organizations: item.organizations ?? '',
    publishedDateISO: item.published_date ?? '',
    foundDateISO: item.found_date ?? '',
    consumptionState: item.consumption_state ?? '',
    rating: item.rating ?? '',
    editorialState: '',
    visibility: 'public',
    title: item.title ?? item.slug,
    alternativeTitle: item.alternative_title ?? '',
    description: item.description ?? '',
    personalNote: item.personal_note ?? '',
    reasonFound: item.reason_found ?? '',
    topics: (item.topics ?? []).map((topic: RecordValue) => topic.name ?? topic.slug),
    topicSlugs: (item.topics ?? []).map((topic: RecordValue) => topic.slug),
    links: (item.links ?? []).map((link: RecordValue) => ({
      url: link.url,
      label: link.label ?? undefined,
      platform: link.platform ?? undefined,
      purpose: link.purpose ?? undefined,
      isFree: link.is_free,
      isPrimary: link.is_primary,
    })),
    identifiers: item.identifiers ?? [],
    relations: item.related ?? [],
  };
}

function entity(collection: ContentCollection, item: RecordValue): RecordValue {
  switch (collection) {
    case 'cases':
      return {
        ...item,
        number: '',
        technologies: (item.technologies ?? []).map((technology: RecordValue) => technology.name),
        technologySlugs: (item.technologies ?? []).map((technology: RecordValue) => technology.slug),
        metrics: item.metrics ?? [],
        visual: 'queue',
      };
    case 'projects':
      return {
        ...item,
        currentFocus: item.current_focus,
        technologies: (item.technologies ?? []).map((technology: RecordValue) => technology.name),
        technologySlugs: (item.technologies ?? []).map((technology: RecordValue) => technology.slug),
        metrics: item.metrics ?? [],
      };
    case 'experiments':
      return {
        ...item,
        technologies: (item.technologies ?? []).map((technology: RecordValue) => technology.name),
        technologySlugs: (item.technologies ?? []).map((technology: RecordValue) => technology.slug),
      };
    case 'writing':
      return {
        ...item,
        dateISO: item.date,
        readingTime: item.reading_time,
        subject: '',
        tags: (item.topics ?? []).map((topic: RecordValue) => topic.name ?? topic.slug),
      };
    case 'references':
      return reference(item);
    case 'collections':
      return {
        ...item,
        intro: item.intro ?? undefined,
      };
    case 'topics':
      return {
        slug: item.slug,
        name: item.name ?? item.slug,
        kind: item.kind === 'skill' ? 'topic' : item.kind,
        parentSlug: item.parent ?? undefined,
        relations: [],
      };
  }
}

function itemsFor(snapshot: Snapshot, collection: ContentCollection): RecordValue[] {
  return {
    cases: snapshot.cases,
    projects: snapshot.projects,
    experiments: snapshot.experiments,
    writing: snapshot.writings,
    references: snapshot.findings,
    collections: snapshot.collections,
    topics: snapshot.topics,
  }[collection];
}

export async function getContentCollection<T>(
  collection: ContentCollection,
  locale?: string,
): Promise<T[]> {
  const snapshot = await getSnapshot(locale);
  return itemsFor(snapshot, collection).map((item) => entity(collection, item) as T);
}

export async function getContentDocument<T>(
  collection: ContentCollection,
  slug: string,
  locale?: string,
): Promise<T | undefined> {
  const item = (await getContentCollection<RecordValue>(collection, locale)).find(
    (value) => value.slug === slug || slugFromKey(value.slug) === slug,
  );
  return item as T | undefined;
}

export async function getInboundReferenceRelations(
  _slug?: string,
  _locale?: string,
): Promise<Reference['relations']> {
  return [];
}

export async function getLocalizedPage<T>(slug: string, locale?: string): Promise<T> {
  const snapshot = await getSnapshot(locale);
  const page = { ...(snapshot.pages[slug] ?? {}) };

  if (slug === 'home') {
    page.featuredCases = (snapshot.featured_cases ?? []).map((item: RecordValue) => ({ item: item.slug }));
    page.featuredProjects = (snapshot.featured_projects ?? []).map((item: RecordValue) => ({ item: item.slug }));
    page.featuredWriting = (snapshot.featured_writings ?? []).map((item: RecordValue) => ({ item: item.slug }));
  }

  return page as T;
}

export async function getLocalizedProfile(locale?: string): Promise<Profile> {
  const profile = (await getSnapshot(locale)).chrome.profile ?? {};
  return {
    name: profile.name ?? '',
    birthDate: profile.birth_date ?? '',
    title: profile.title ?? '',
    location: profile.location ?? '',
    birthCity: profile.birth_city ?? '',
    description: profile.description ?? '',
    interests: profile.interests ?? '',
    learning: profile.learning ?? '',
    personalInterests: profile.personal_interests ?? [],
    trajectory: profile.trajectory ?? [],
    milestones: profile.milestones ?? [],
  };
}

export async function listTechnologies(
  slugs?: string[],
  locale?: string,
): Promise<TechnologyBadge[]> {
  const technologies = (await getSnapshot(locale)).technologies;
  const filtered = slugs?.length
    ? technologies.filter((technology) => slugs.includes(technology.slug))
    : technologies;
  return filtered.map((technology) => ({ slug: technology.slug, name: technology.name }));
}

export async function getLocalizedResume(locale?: string): Promise<ResumeContent> {
  const resume = (await getSnapshot(locale)).resume ?? {};
  return {
    summary: resume.summary ?? '',
    skills: (resume.skills ?? []).map((skill: RecordValue) => ({
      label: skill.name ?? '',
      items: (skill.technologies ?? []).map((technology: RecordValue) => technology.name ?? technology.slug),
    })),
    languages: resume.languages ?? [],
    selectedCases: (resume.selected_cases ?? []).map((item: RecordValue) => ({ item: item.slug })),
    leadership: resume.leadership ?? [],
    education: resume.education ?? [],
    certificates: resume.certificates ?? [],
    certifications: resume.certifications ?? [],
    publications: resume.publications ?? [],
    recommendations: resume.recommendations ?? [],
    technicalProductions: resume.technical_productions ?? [],
    events: resume.events ?? [],
    awards: resume.awards ?? [],
  };
}

export async function getLocalizedCredits(locale?: string): Promise<CreditsContent> {
  return {
    entries: (await getSnapshot(locale)).credits.map((credit) => ({
      url: credit.url ?? '',
      category: credit.category,
      name: credit.name ?? credit.category,
      description: credit.description ?? '',
    })),
  };
}

export async function getContactEmail(): Promise<string> {
  return '';
}

export async function getLocalizedSiteText(locale?: string): Promise<SiteText> {
  const snapshot = await getSnapshot(locale);
  const site = snapshot.chrome.site ?? {};
  return {
    shortName: site.short_name ?? '',
    portfolioUrl: site.portfolio_url ?? '',
    copyrightTemplate: snapshot.chrome.copyright ?? '',
    maintenanceEnabled: site.maintenance_enabled ?? false,
    maintenance: {
      eyebrow: site.maintenance_eyebrow ?? '',
      title: site.maintenance_title ?? '',
      description: site.maintenance_description ?? '',
    },
    contact: {
      hasEmail: site.protected_email !== null,
      profiles: site.contact_profiles ?? [],
      available: site.contact_available ?? false,
    },
    seo: site.seo ?? undefined,
  };
}

export async function getLocalizedInterface(_locale?: string): Promise<InterfaceMessages> {
  const key = normalizeLocale(_locale) === 'pt-BR' ? 'ptBR' : 'en';
  return interfaceDocument.translations[key] as InterfaceMessages;
}
