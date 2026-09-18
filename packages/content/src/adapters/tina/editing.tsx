'use client';

import { useLocale } from 'next-intl';
import { tinaField, useTina } from 'tinacms/dist/react';
import { withoutHiddenItems } from '../../domain/content-visibility.ts';
import { type RelationTypeId, relationTypes } from '../../domain/relation-types.ts';
import type { EditableContent } from '../../domain/types.ts';

const arrayFieldsByRoot: Record<string, string[]> = {
  caseStudy: ['technologies', 'metrics'],
  project: ['technologies', 'metrics'],
  experiment: ['technologies'],
  writing: ['tags'],
  profile: ['personalInterests', 'trajectory', 'milestones'],
  resume: [
    'selectedCases',
    'skills',
    'languages',
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
  homePage: ['featuredCases', 'featuredProjects', 'featuredWriting'],
  resource: ['topics', 'links', 'identifiers', 'relations'],
  referenceCollection: ['items'],
};

type EditableSkill = { category?: unknown; technologies?: unknown[] };
type FallbackSkill = { label?: string; items?: string[] };
type EditableLanguage = { language?: unknown; proficiency?: string };
type FallbackLanguage = { name?: string };
type EmbeddedLanguage = { code?: string };
type ContentFields = Record<string, unknown>;

function embeddedItem(value: unknown) {
  if (!value || typeof value !== 'object' || !('item' in value)) {
    return value;
  }
  return (value as { item?: unknown }).item;
}

function embeddedSlug(value: unknown): string | undefined {
  const item = embeddedItem(value);
  if (!item || typeof item !== 'object') {
    return undefined;
  }
  const slug = (item as { slug?: unknown }).slug;
  return typeof slug === 'string' ? slug : undefined;
}

function localizedSlugs(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item, index) => embeddedSlug(item) || fallback[index] || '');
}

function embeddedEntityName(value: unknown, locale: string) {
  const item = embeddedItem(value);
  if (!item || typeof item !== 'object') {
    return '';
  }
  const translations = (item as { translations?: Record<'en' | 'ptBR', { name?: string }> })
    .translations;
  return translations?.[locale === 'pt-BR' ? 'ptBR' : 'en']?.name ?? '';
}

function fallbackItems(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function localizedNames(value: unknown, locale: string, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item, index) => embeddedEntityName(item, locale) || fallback[index] || '');
}

function localizeTechnologyRelations(
  shared: ContentFields,
  locale: string,
  fallback: ContentFields,
) {
  return {
    ...shared,
    technologies: localizedNames(shared.technologies, locale, fallbackItems(fallback.technologies)),
  };
}

function localizeWritingRelations(shared: ContentFields, locale: string, fallback: ContentFields) {
  return {
    ...shared,
    type: embeddedEntityName(shared.typeCategory, locale) || fallback.type || '',
    subject: embeddedEntityName(shared.subjectCategory, locale) || fallback.subject || '',
    tags: localizedNames(shared.tags, locale, fallbackItems(fallback.tags)),
  };
}

function localizeResumeSkills(shared: ContentFields, locale: string, fallback: ContentFields) {
  const fallbackSkills = Array.isArray(fallback.skills) ? (fallback.skills as FallbackSkill[]) : [];
  const skills = Array.isArray(shared.skills) ? shared.skills : [];
  return {
    ...shared,
    skills: skills.map((entry, groupIndex) => {
      const skill = entry as EditableSkill;
      const fallbackGroup = fallbackSkills[groupIndex];
      return {
        label: embeddedEntityName(skill.category, locale) || fallbackGroup?.label || '',
        items: localizedNames(skill.technologies, locale, fallbackGroup?.items ?? []),
      };
    }),
  };
}

type EmbeddedRelation = {
  relationType?: string;
  target?: unknown;
  note?: string;
  context?: string;
  status?: string;
};
type FallbackRelation = { targetTitle?: string };

function relationLocaleKey(locale: string): 'en' | 'ptBR' {
  return locale === 'pt-BR' ? 'ptBR' : 'en';
}

function outboundRelationLabel(relationType: string, locale: string): string {
  const definition = relationTypes[relationType as RelationTypeId];
  return definition ? definition.outboundLabel[relationLocaleKey(locale)] : relationType;
}

function localizeReferenceRelations(
  shared: ContentFields,
  locale: string,
  fallback: ContentFields,
) {
  const fallbackRelations = Array.isArray(fallback.relations)
    ? (fallback.relations as FallbackRelation[])
    : [];
  const inboundRelations = Array.isArray(fallback.relations)
    ? (fallback.relations as { direction?: string }[]).filter((r) => r.direction === 'inbound')
    : [];
  const relations = Array.isArray(shared.relations) ? shared.relations : [];
  const localeKey = relationLocaleKey(locale);

  return {
    ...shared,
    topics: localizedNames(shared.topics, locale, fallbackItems(fallback.topics)),
    topicSlugs: localizedSlugs(shared.topics, fallbackItems(fallback.topicSlugs)),
    language: embeddedEntityName(shared.language, locale) || (fallback.language as string) || '',
    relations: [
      ...relations.map((entry, index) => {
        const relation = entry as EmbeddedRelation;
        const target = embeddedItem(relation.target) as
          | { slug?: string; translations?: Record<'en' | 'ptBR', { title?: string }> }
          | undefined;
        const targetTitle =
          target?.translations?.[localeKey]?.title ||
          fallbackRelations[index]?.targetTitle ||
          target?.slug ||
          '';
        return {
          relationType: relation.relationType,
          direction: 'outbound' as const,
          label: relation.relationType ? outboundRelationLabel(relation.relationType, locale) : '',
          targetSlug: target?.slug ?? '',
          targetTitle,
          note: relation.note,
          context: relation.context,
          status: relation.status ?? 'verified',
        };
      }),
      ...inboundRelations,
    ],
  };
}

type RelationLocalizer = (
  shared: ContentFields,
  locale: string,
  fallback: ContentFields,
) => ContentFields;

const relationLocalizers: Record<string, RelationLocalizer> = {
  caseStudy: localizeTechnologyRelations,
  project: localizeTechnologyRelations,
  experiment: localizeTechnologyRelations,
  writing: localizeWritingRelations,
  resume: localizeResumeSkills,
  resource: localizeReferenceRelations,
};

function localizeRelations(
  shared: ContentFields,
  root: string,
  locale: string,
  fallback: ContentFields,
): ContentFields {
  return relationLocalizers[root]?.(shared, locale, fallback) ?? shared;
}

function fallbackResumeLanguages(staticShared: ContentFields): FallbackLanguage[] {
  return Array.isArray(staticShared.languages)
    ? (staticShared.languages as FallbackLanguage[])
    : [];
}

function embeddedLanguage(value: unknown): EmbeddedLanguage | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  const item = 'item' in value ? (value as { item?: unknown }).item : value;
  return item && typeof item === 'object' ? (item as EmbeddedLanguage) : undefined;
}

function localizeResumeLanguage(
  entry: unknown,
  index: number,
  fallbackLanguages: FallbackLanguage[],
  locale: string,
) {
  const language = entry as EditableLanguage;
  const item = embeddedLanguage(language.language);
  const proficiency = language.proficiency;
  return {
    code: item?.code ?? '',
    name: embeddedEntityName(language.language, locale) || fallbackLanguages[index]?.name || '',
    ...(proficiency ? { proficiency } : {}),
  };
}

function contentDocument(value: unknown): ContentFields | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return { ...(value as ContentFields) };
}

function contactWithDefaults(document: ContentFields): ContentFields {
  if (document.contact && typeof document.contact === 'object') {
    return document;
  }
  return { ...document, contact: { hasEmail: false, profiles: [], available: false } };
}

function withProtectedContact(shared: ContentFields, staticShared: ContentFields): ContentFields {
  const staticContact = contentDocument(staticShared.contact);
  if (!staticContact) {
    return shared;
  }
  const liveContact = contentDocument(shared.contact) ?? {};
  return {
    ...shared,
    contact: {
      ...liveContact,
      hasEmail: staticContact.hasEmail ?? false,
      ...(staticContact.emailChallenge ? { emailChallenge: staticContact.emailChallenge } : {}),
    },
  };
}

function withContentDefaults<T>(value: T, fields: string[], includeContact = false): T {
  const document = contentDocument(value);
  if (!document) {
    return value;
  }

  for (const field of fields) {
    if (!Array.isArray(document[field])) {
      document[field] = [];
    }
  }
  return (includeContact ? contactWithDefaults(document) : document) as T;
}

export function editableField(source: unknown, field?: string | string[]) {
  if (!source || typeof source !== 'object') {
    return undefined;
  }
  return tinaField(source as Record<string, unknown>, field as string);
}

export function getEditableProps(source: unknown, field?: string | string[]) {
  const value = editableField(source, field);
  return value ? { 'data-tina-field': value } : {};
}

type EditableStaticContent<T extends object> = T & EditableContent;

function localizeSharedFields(
  shared: ContentFields,
  root: string,
  locale: string,
  staticShared: ContentFields,
) {
  if (root === 'settings') {
    return withProtectedContact(shared, staticShared);
  }
  const localized = localizeRelations(shared, root, locale, staticShared);
  if (root === 'resume' && Array.isArray(shared.languages)) {
    const fallbackLanguages = fallbackResumeLanguages(staticShared);
    localized.languages = shared.languages.map((entry, index) =>
      localizeResumeLanguage(entry, index, fallbackLanguages, locale),
    );
  }
  return localized;
}

export function useEditableContent<T extends object>(staticContent: EditableStaticContent<T>) {
  const editing = staticContent._contentEditing;
  if (!editing) {
    throw new Error('Editable Tina content is missing its query payload.');
  }

  const locale = useLocale();
  const { root, ...payload } = editing;
  const { data } = useTina(payload);
  const raw = data[root] as Record<string, unknown> & {
    translations: {
      en: Record<string, unknown>;
      ptBR: Record<string, unknown>;
    };
  };
  const source = withoutHiddenItems(
    locale === 'pt-BR' ? raw.translations.ptBR : raw.translations.en,
  );
  const shared = Object.fromEntries(
    Object.entries(raw).filter(([field]) => field !== 'translations'),
  );
  const staticShared: ContentFields = { ...staticContent };
  const localizedShared = localizeSharedFields(shared, root, locale, staticShared);

  return {
    content: withContentDefaults(
      {
        ...localizedShared,
        ...source,
        _contentEditing: editing,
      } as T & EditableContent,
      arrayFieldsByRoot[root] ?? [],
      root === 'settings',
    ),
    source,
    raw,
  };
}
