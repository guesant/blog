import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  CaseStudy,
  ContentReference,
  Profile,
  ResumeContent,
  ResumePageContent,
  ResumePageCopy,
  SiteText,
} from './domain/types.ts';
import { isHidden, withoutHiddenItems } from './domain/content-visibility.ts';

export type ContentLocale = 'en' | 'pt-BR';

type TranslationKey = 'en' | 'ptBR';
type UnknownRecord = Record<string, unknown>;
type EntityCollection = 'technologies' | 'languages' | 'categories';
type RawDocument = UnknownRecord & {
  translations?: Partial<Record<TranslationKey, UnknownRecord>>;
};
type EntityDocument = {
  code?: string;
  translations?: Partial<Record<TranslationKey, { name?: string }>>;
};

export type ContentRuntime = {
  getContactEmail(): Promise<string>;
  getResumePageContent(locale?: string): Promise<ResumePageContent>;
};

function asRecord(value: unknown): UnknownRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : undefined;
}

function normalizeLocale(locale?: string): ContentLocale {
  return locale === 'pt-BR' ? 'pt-BR' : 'en';
}

function translationKey(locale?: string): TranslationKey {
  return normalizeLocale(locale) === 'pt-BR' ? 'ptBR' : 'en';
}

function withDefaults<T>(value: T, fields: string[]): T {
  const record = asRecord(value);
  if (!record) {
    return value;
  }

  const next = { ...record };
  for (const field of fields) {
    if (!Array.isArray(next[field])) {
      next[field] = [];
    }
  }
  return next as T;
}

function referenceValue(value: unknown): string | UnknownRecord | undefined {
  if (typeof value === 'string') {
    return value;
  }

  const record = asRecord(value);
  if (!record) {
    return undefined;
  }
  return 'item' in record ? referenceValue(record.item) : record;
}

function referenceSlug(value: unknown): string | undefined {
  const reference = referenceValue(value);
  if (typeof reference === 'string') {
    return reference
      .split('/')
      .at(-1)
      ?.replace(/\.json$/, '');
  }
  const slug = reference?.slug;
  return typeof slug === 'string' ? slug : undefined;
}

function referenceList(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value === undefined || value === null ? [] : [value];
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function localizedTranslation(raw: RawDocument, locale?: string): UnknownRecord {
  return withoutHiddenItems(raw.translations?.[translationKey(locale)] ?? {});
}

function selectByReferences<T extends { slug: string }>(
  items: T[],
  references: ContentReference[] = [],
): T[] {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  return references.flatMap((reference) => {
    const slug = referenceSlug(reference);
    const item = slug ? bySlug.get(slug) : undefined;
    return item ? [item] : [];
  });
}

class FileContentRuntime implements ContentRuntime {
  private readonly root: string;
  private entityIndexPromise: Promise<Map<string, EntityDocument>> | undefined;

  constructor(contentRoot: string) {
    this.root = path.resolve(contentRoot);
  }

  private async readJson<T extends UnknownRecord>(relativePath: string): Promise<T> {
    return JSON.parse(await readFile(path.join(this.root, relativePath), 'utf8')) as T;
  }

  private async readEntityCollection(collection: EntityCollection) {
    const directory = path.join(this.root, collection);
    const filenames = (await readdir(directory)).filter((filename) => filename.endsWith('.json'));
    return Promise.all(
      filenames.map(async (filename) => {
        const document = await this.readJson<EntityDocument>(path.join(collection, filename));
        return [`${collection}/${filename}`, document] as const;
      }),
    );
  }

  private async getEntityIndex(): Promise<Map<string, EntityDocument>> {
    this.entityIndexPromise ??= Promise.all(
      (['technologies', 'languages', 'categories'] as EntityCollection[]).map((collection) =>
        this.readEntityCollection(collection),
      ),
    ).then((collections) => new Map(collections.flat()));
    return this.entityIndexPromise;
  }

  private async embeddedEntityName(
    reference: string | UnknownRecord | undefined,
    key: TranslationKey,
  ): Promise<string> {
    if (!reference || typeof reference === 'string') {
      return '';
    }
    const translatedName = asRecord(asRecord(reference.translations)?.[key])?.name;
    return text(translatedName);
  }

  private async entityName(
    value: unknown,
    locale: string | undefined,
    collection: EntityCollection,
  ): Promise<string> {
    const key = translationKey(locale);
    const reference = referenceValue(value);
    const embeddedName = await this.embeddedEntityName(reference, key);
    if (embeddedName) {
      return embeddedName;
    }

    const slug = referenceSlug(reference);
    if (!slug) {
      return '';
    }
    const entity = (await this.getEntityIndex()).get(`${collection}/${slug}.json`);
    return text(entity?.translations?.[key]?.name) || entity?.code || slug;
  }

  private async entityNames(
    value: unknown,
    locale: string | undefined,
    collection: EntityCollection,
  ): Promise<string[]> {
    return Promise.all(
      referenceList(value).map((item) => this.entityName(item, locale, collection)),
    );
  }

  private async localizeCase(raw: RawDocument, locale?: string): Promise<CaseStudy> {
    const { translations: _translations, ...shared } = raw;
    const translated = localizedTranslation(raw, locale);
    const { body: _body, ...pdfTranslation } = translated;
    const technologies = await this.entityNames(shared.technologies, locale, 'technologies');
    const result = {
      ...shared,
      ...pdfTranslation,
      technologies,
      technologySlugs: referenceList(shared.technologies).flatMap((item) => {
        const slug = referenceSlug(item);
        return slug ? [slug] : [];
      }),
      ...(typeof shared.order === 'number'
        ? { number: String(shared.order).padStart(2, '0') }
        : {}),
    };
    return withDefaults(withoutHiddenItems(result), ['metrics', 'technologies']) as CaseStudy;
  }

  private async getCases(locale?: string): Promise<CaseStudy[]> {
    const filenames = (await readdir(path.join(this.root, 'cases')))
      .filter((filename) => filename.endsWith('.json'))
      .sort();
    const cases = await Promise.all(
      filenames.map(async (filename) =>
        this.localizeCase(await this.readJson<RawDocument>(path.join('cases', filename)), locale),
      ),
    );
    return cases.filter((item) => !isHidden(item)).sort((left, right) => left.order - right.order);
  }

  private async localizeResume(locale?: string): Promise<ResumeContent> {
    const raw = await this.readJson<RawDocument>('resume/resume.json');
    const { translations: _translations, ...shared } = raw;
    const translated = localizedTranslation(raw, locale);
    const skills = await Promise.all(
      referenceList(shared.skills).map(async (entry) => {
        const skill = asRecord(entry) ?? {};
        return {
          label: await this.entityName(skill.category, locale, 'categories'),
          items: await this.entityNames(skill.technologies, locale, 'technologies'),
        };
      }),
    );
    const languages = await Promise.all(
      referenceList(shared.languages).map(async (entry) => {
        const language = asRecord(entry) ?? {};
        const slug = referenceSlug(language.language);
        const entity = slug
          ? (await this.getEntityIndex()).get(`languages/${slug}.json`)
          : undefined;
        return {
          code: entity?.code ?? '',
          name: await this.entityName(language.language, locale, 'languages'),
          ...(text(language.proficiency) ? { proficiency: text(language.proficiency) } : {}),
        };
      }),
    );

    return withDefaults(
      withoutHiddenItems({
        ...shared,
        ...translated,
        skills,
        languages,
      }),
      [
        'skills',
        'languages',
        'selectedCases',
        'leadership',
        'education',
        'certificates',
        'certifications',
        'publications',
        'recommendations',
        'technicalProductions',
        'events',
        'awards',
      ],
    ) as ResumeContent;
  }

  private async localizeProfile(locale?: string): Promise<Profile> {
    const raw = await this.readJson<RawDocument>('profile/profile.json');
    const { translations: _translations, ...shared } = raw;
    return withDefaults(withoutHiddenItems({ ...shared, ...localizedTranslation(raw, locale) }), [
      'personalInterests',
      'trajectory',
      'milestones',
    ]) as Profile;
  }

  private async localizePage(locale?: string): Promise<ResumePageCopy> {
    const raw = await this.readJson<RawDocument>('pages/resume.json');
    return localizedTranslation(raw, locale) as ResumePageCopy;
  }

  private async getSiteText(locale?: string): Promise<SiteText> {
    const raw = await this.readJson<RawDocument>('settings/site.json');
    const { translations: _translations, contact: rawContact, ...shared } = raw;
    const contact = asRecord(rawContact) ?? {};
    const email = text(contact.email).trim();
    const translated = localizedTranslation(raw, locale);
    const maintenance = asRecord(translated.maintenance) ?? {};
    return {
      ...shared,
      ...translated,
      portfolioUrl: text(shared.portfolioUrl).trim() || undefined,
      maintenanceEnabled: shared.maintenanceEnabled === true,
      maintenance: {
        eyebrow: text(maintenance.eyebrow),
        title: text(maintenance.title),
        description: text(maintenance.description),
      },
      contact: {
        hasEmail: email.length > 0,
        profiles: Array.isArray(contact.profiles) ? contact.profiles : [],
        available: contact.available === true,
      },
    } as SiteText;
  }

  async getContactEmail(): Promise<string> {
    const raw = await this.readJson<RawDocument>('settings/site.json');
    return text(asRecord(raw.contact)?.email).trim();
  }

  async getResumePageContent(locale?: string): Promise<ResumePageContent> {
    const [cases, resume, page, profile, site] = await Promise.all([
      this.getCases(locale),
      this.localizeResume(locale),
      this.localizePage(locale),
      this.localizeProfile(locale),
      this.getSiteText(locale),
    ]);

    return {
      cases: selectByReferences(cases, resume.selectedCases),
      page,
      profile,
      resume,
      site,
    };
  }
}

export function createContentRuntime(contentRoot: string): ContentRuntime {
  return new FileContentRuntime(contentRoot);
}
