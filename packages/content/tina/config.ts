import { defineConfig, type TinaField } from 'tinacms';
import interfaceSource from '../content/cms/settings/interface.json';
import { referenceRelationTypeIds, topicRelationTypeIds } from '../src/domain/relation-types.ts';

type LabelItem = { label?: string };
type ReferenceItem = { item?: unknown };
type RoleItem = { role?: string };
type MilestoneItem = { title?: string };
type DegreeItem = { degree?: string };
type NamedItem = { name?: string };
type RecommendationItem = { author?: string };
type ProficiencyItem = { proficiency?: string };
type CreditItem = { translations?: { en?: { name?: string } } };
type ProfileItem = { platform?: string };
type LinkItem = { label?: string; url?: string };
type IdentifierItem = { kind?: string; value?: string };
type RelationItem = { relationType?: string };

const textField = (name: string, label: string) => ({
  name,
  label,
  type: 'string' as const,
});

const textareaField = (name: string, label: string) => ({
  ...textField(name, label),
  ui: { component: 'textarea' },
});

const richTextField = (name = 'body', label = 'Content'): TinaField => ({
  name,
  label,
  type: 'rich-text',
});

const highlightsField = (): TinaField =>
  ({
    name: 'highlights',
    label: 'Highlights',
    type: 'string',
    list: true,
    description:
      'One bullet per line. Favor a compact XYZ shape — accomplished X, measured by Y, via Z ' +
      '(e.g. "Cut deploy time from 40 to 8 minutes by automating the pipeline with GitLab CI and ' +
      'ArgoCD") over vague duties like "Responsible for maintaining APIs". No hard metric? Cite ' +
      'other concrete evidence instead: scale, frequency, quality, or process improvements.',
    ui: { component: 'textarea' },
  }) as TinaField;

const metricsField = (): TinaField =>
  ({
    name: 'metrics',
    label: 'Impact highlights',
    type: 'object',
    list: true,
    description:
      'Think in XYZ terms — accomplished X, measured by Y, via Z — then distill just the Y+X ' +
      'pair here: Label = the indicator (Y, e.g. "Response time"), Value = the outcome number ' +
      '(X, e.g. "-80% (40→8 min)"). The "via Z" part (the tech/approach) belongs in the body text ' +
      'below, not here. No hard metric? Use other concrete evidence instead: scale, frequency, ' +
      'quality, or process improvements (e.g. Label "Rollout" → Value "Zero-downtime, 6 services"). Optional.',
    ui: { itemProps: (item: LabelItem) => ({ label: item?.label || 'Metric' }) },
    fields: [textField('label', 'Label'), textField('value', 'Value')],
  }) as TinaField;

const seoField = (label = 'SEO and social sharing'): TinaField => ({
  name: 'seo',
  label,
  type: 'object',
  description: 'Optional overrides. Empty fields fall back to the visible page content.',
  fields: [
    textField('title', 'Meta title'),
    textareaField('description', 'Meta description'),
    {
      name: 'image',
      label: 'Social sharing image',
      type: 'image',
      description: 'Recommended size: 1200 × 630 px.',
    },
    textField('imageAlt', 'Social image alternative text'),
    { name: 'keywords', label: 'Keywords', type: 'string', list: true },
    { name: 'noIndex', label: 'Hide from search engines', type: 'boolean' },
  ],
});

const referenceList = (
  name: string,
  label: string,
  collection: string,
  extraFields: TinaField[] = [],
): TinaField =>
  ({
    name,
    label,
    type: 'object',
    list: true,
    ui: {
      itemProps: (item: ReferenceItem) => {
        const reference = typeof item?.item === 'string' ? item.item : '';
        const filename = reference
          .split('/')
          .at(-1)
          ?.replace(/\.json$/, '');
        return { label: filename || 'Reference' };
      },
    },
    fields: [
      {
        name: 'item',
        label: 'Document',
        type: 'reference',
        collections: [collection],
      },
      ...extraFields,
    ],
  }) as TinaField;

const referenceField = (name: string, label: string, collection: string): TinaField => ({
  name,
  label,
  type: 'reference',
  collections: [collection],
});

const entityFields = (label: string, translated = true): TinaField[] => [
  { ...textField('slug', 'Slug'), isTitle: true, required: true },
  { name: 'order', label: 'Order', type: 'number', required: true },
  ...(translated ? [translationsField([textField('name', label)])] : [textField('name', label)]),
];

const translationsField = (fields: TinaField[]): TinaField => ({
  name: 'translations',
  label: 'Translations',
  type: 'object',
  fields: [
    {
      name: 'en',
      label: 'English',
      type: 'object',
      fields,
    },
    {
      name: 'ptBR',
      label: 'Português (Brasil)',
      type: 'object',
      fields,
    },
  ],
});

type InterfaceShape = { [key: string]: string | InterfaceShape };

const interfaceFields = (shape: InterfaceShape): TinaField[] =>
  Object.entries(shape).map(([name, value]) =>
    typeof value === 'string'
      ? textField(name, name)
      : ({ name, label: name, type: 'object', fields: interfaceFields(value) } as TinaField),
  );

const interfaceShape = interfaceSource.translations.en as InterfaceShape;

const profileFields: TinaField[] = [
  textField('title', 'Professional title'),
  textField('location', 'Location'),
  textField('birthCity', 'Birth city'),
  textareaField('description', 'Short description'),
  textareaField('interests', 'Technical interests'),
  textareaField('learning', 'Learning interests'),
  {
    name: 'personalInterests',
    label: 'Personal interests',
    type: 'string',
    list: true,
    description: 'One interest per item. These are shown only when the list has content.',
  },
  {
    name: 'trajectory',
    label: 'Professional experience',
    type: 'object',
    list: true,
    ui: { itemProps: (item: RoleItem) => ({ label: item?.role || 'Experience' }) },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this experience in the CMS, but removes it from the website.',
      },
      {
        name: 'includeInResume',
        label: 'Include in résumé and PDF',
        type: 'boolean',
        description:
          'Opt-in: unchecked by default. This experience still shows on the About page and homepage regardless of this setting — it only controls whether it appears in the Experience section of /resume and the downloadable PDF.',
      },
      textField('role', 'Role'),
      textField('organization', 'Organization'),
      textField('period', 'Period'),
      highlightsField(),
    ],
  },
  {
    name: 'milestones',
    label: 'Milestones',
    type: 'object',
    list: true,
    description:
      'Personal turning points, such as the first contact with a computer or the first line of code. Shown on the About page below the story.',
    ui: { itemProps: (item: MilestoneItem) => ({ label: item?.title || 'Milestone' }) },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this milestone in the CMS, but removes it from the website.',
      },
      textField('year', 'Year'),
      textField('title', 'Title'),
      textareaField('description', 'Description'),
    ],
  },
];

const resumeFields: TinaField[] = [
  textareaField('summary', 'Summary'),
  {
    name: 'leadership',
    label: 'Leadership activities',
    type: 'object',
    list: true,
    description: 'Volunteer work, academic clubs, or leadership positions. Optional.',
    ui: {
      itemProps: (item: RoleItem) => ({ label: item?.role || 'Leadership activity' }),
    },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this entry in the CMS, but removes it from the website and PDF.',
      },
      textField('role', 'Role'),
      textField('organization', 'Organization'),
      textField('period', 'Period'),
      highlightsField(),
    ],
  },
  {
    name: 'education',
    label: 'Education',
    type: 'object',
    list: true,
    description: 'Optional.',
    ui: { itemProps: (item: DegreeItem) => ({ label: item?.degree || 'Education' }) },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this entry in the CMS, but removes it from the website and PDF.',
      },
      textField('institution', 'Institution'),
      textField('location', 'Location'),
      textField('degree', 'Degree'),
      textField('period', 'Period'),
    ],
  },
  {
    name: 'certificates',
    label: 'Certificates',
    type: 'object',
    list: true,
    description: 'Independent course certificates (Origamid, Hyperskill, etc). Optional.',
    ui: { itemProps: (item: NamedItem) => ({ label: item?.name || 'Certificate' }) },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this entry in the CMS, but removes it from the website and PDF.',
      },
      textField('name', 'Course or certificate name'),
      textField('issuer', 'Issuer / platform'),
      textField('url', 'Credential URL'),
      textField('period', 'Period'),
    ],
  },
  {
    name: 'certifications',
    label: 'Certifications',
    type: 'object',
    list: true,
    description: 'Professional certifications (AWS, Microsoft, Scrum, etc). Optional.',
    ui: { itemProps: (item: NamedItem) => ({ label: item?.name || 'Certification' }) },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this entry in the CMS, but removes it from the website and PDF.',
      },
      textField('name', 'Certification name'),
      textField('issuer', 'Issuing organization'),
      textField('url', 'Verification URL'),
      textField('period', 'Period'),
      textField('credentialId', 'Credential ID'),
    ],
  },
  {
    name: 'publications',
    label: 'Publications',
    type: 'object',
    list: true,
    description: 'Articles, papers, talks, or other published work (Lattes-style). Optional.',
    ui: { itemProps: (item: NamedItem) => ({ label: item?.name || 'Publication' }) },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this entry in the CMS, but removes it from the website and PDF.',
      },
      {
        name: 'includeInPdf',
        label: 'Include in the downloadable PDF',
        type: 'boolean',
        description:
          'Opt-in: unchecked by default. This publication still shows on the /resume page regardless of this setting — it only controls whether it also appears in the downloadable résumé PDF, which stays curated to the most relevant items.',
      },
      textField('name', 'Title'),
      textField('issuer', 'Venue / publisher (journal, conference, book)'),
      textField('url', 'Link'),
      textField('period', 'Year / period'),
    ],
  },
  {
    name: 'recommendations',
    label: 'Recommendations',
    type: 'object',
    list: true,
    description: 'Testimonials received (LinkedIn-style). Optional.',
    ui: { itemProps: (item: RecommendationItem) => ({ label: item?.author || 'Recommendation' }) },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this entry in the CMS, but removes it from the website and PDF.',
      },
      textField('author', 'Author name'),
      textField('role', 'Author role / company'),
      textareaField('quote', 'Recommendation text'),
      textField('url', "Author's LinkedIn URL"),
      textField('period', 'Date'),
    ],
  },
  {
    name: 'technicalProductions',
    label: 'Technical productions',
    type: 'object',
    list: true,
    description:
      'Software, libraries, tools, or datasets produced — optionally tied to a project (Lattes-style "produção técnica"). Optional.',
    ui: {
      itemProps: (item: NamedItem) => ({ label: item?.name || 'Technical production' }),
    },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this entry in the CMS, but removes it from the website.',
      },
      {
        name: 'includeInPdf',
        label: 'Include in the downloadable PDF',
        type: 'boolean',
        description:
          'Opt-in: unchecked by default. This production still shows on the /resume page regardless of this setting — it only controls whether it also appears in the downloadable résumé PDF, which stays curated to the most relevant items.',
      },
      textField('name', 'Name'),
      {
        name: 'kind',
        label: 'Kind',
        type: 'string',
        options: ['software', 'library', 'tool', 'dataset', 'other'],
      },
      textareaField('description', 'Description'),
      textField('url', 'Link'),
      textField('period', 'Year / period'),
      textField('projectHref', 'Related project link (optional)'),
    ],
  },
  {
    name: 'events',
    label: 'Events',
    type: 'object',
    list: true,
    description: 'Talks, presentations, or notable event participation. Optional.',
    ui: { itemProps: (item: NamedItem) => ({ label: item?.name || 'Event' }) },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this entry in the CMS, but removes it from the website.',
      },
      {
        name: 'includeInPdf',
        label: 'Include in the downloadable PDF',
        type: 'boolean',
        description:
          'Opt-in: unchecked by default. This event still shows on the /resume page regardless of this setting — it only controls whether it also appears in the downloadable résumé PDF, which stays curated to the most relevant items.',
      },
      textField('name', 'Event name'),
      {
        name: 'role',
        label: 'Role',
        type: 'string',
        options: ['speaker', 'organizer', 'panelist', 'attendee', 'other'],
      },
      textField('talkTitle', 'Talk / presentation title (if applicable)'),
      textField('location', 'Location'),
      textField('period', 'Date'),
      textField('url', 'Link'),
    ],
  },
  {
    name: 'awards',
    label: 'Awards',
    type: 'object',
    list: true,
    description: 'Prizes and recognitions. Optional.',
    ui: { itemProps: (item: NamedItem) => ({ label: item?.name || 'Award' }) },
    fields: [
      {
        name: 'hidden',
        label: 'Hide from the published site',
        type: 'boolean',
        description: 'Keeps this entry in the CMS, but removes it from the website.',
      },
      {
        name: 'includeInPdf',
        label: 'Include in the downloadable PDF',
        type: 'boolean',
        description:
          'Opt-in: unchecked by default. This award still shows on the /resume page regardless of this setting — it only controls whether it also appears in the downloadable résumé PDF, which stays curated to the most relevant items.',
      },
      textField('name', 'Award name'),
      textField('issuer', 'Awarding organization'),
      textareaField('description', 'Description'),
      textField('period', 'Date'),
      textField('url', 'Link'),
    ],
  },
];

const sharedDocumentFields: TinaField[] = [
  { ...textField('slug', 'Slug'), isTitle: true, required: true },
  {
    name: 'hidden',
    label: 'Hide from the published site',
    type: 'boolean',
    description: 'Keeps this document in the CMS, but removes it from listings and public routes.',
  },
  { name: 'order', label: 'Order', type: 'number', required: true },
];

const pageIntroductionFields: TinaField[] = [
  textField('eyebrow', 'Eyebrow'),
  textField('title', 'Title'),
  textareaField('description', 'Description'),
];

type PageCollectionOptions = {
  name: string;
  label: string;
  filename: string;
  route: string;
  fields: TinaField[];
  sharedFields?: TinaField[];
};

type RoutableDocument = { _sys: { filename: string } };
type DocumentRouterProps = { document: RoutableDocument };

const documentRouter =
  (segment: string) =>
  (props: DocumentRouterProps): string =>
    `/pt-BR/${segment}/${props.document._sys.filename}`;

const pageCollection = (options: PageCollectionOptions) => {
  const { name, label, filename, route, fields, sharedFields = [] } = options;
  return {
    name,
    label,
    path: 'content/cms/pages',
    format: 'json' as const,
    match: { include: filename },
    ui: {
      allowedActions: { create: false, delete: false },
      router: () => route,
    },
    fields: [...sharedFields, translationsField([...fields, seoField()])],
  };
};

export default defineConfig({
  branch: 'local',
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
    host: '0.0.0.0',
  },
  telemetry: 'disabled',
  schema: {
    collections: [
      {
        name: 'caseStudy',
        label: 'Case studies',
        path: 'content/cms/cases',
        format: 'json',
        ui: { router: documentRouter('cases') },
        fields: [
          ...sharedDocumentFields,
          {
            name: 'visual',
            label: 'Visual',
            type: 'string',
            options: ['queue', 'architecture', 'process'],
          },
          referenceList('technologies', 'Technologies', 'technology'),
          translationsField([
            textField('title', 'Title'),
            textField('status', 'Status'),
            textField('meta', 'Metadata'),
            textareaField('summary', 'Summary'),
            textareaField('context', 'Context'),
            textareaField('role', 'Contribution'),
            textareaField('result', 'Result'),
            metricsField(),
            richTextField(),
            seoField(),
          ]),
        ],
      },
      {
        name: 'project',
        label: 'Projects',
        path: 'content/cms/projects',
        format: 'json',
        ui: { router: documentRouter('projects') },
        fields: [
          ...sharedDocumentFields,
          textField('href', 'URL'),
          { name: 'external', label: 'External link', type: 'boolean' },
          referenceList('technologies', 'Technologies', 'technology'),
          translationsField([
            textField('name', 'Name'),
            textareaField('purpose', 'Purpose'),
            textareaField('problem', 'Problem'),
            textareaField('currentFocus', 'Current focus'),
            textField('status', 'Status'),
            metricsField(),
            richTextField(),
            seoField(),
          ]),
        ],
      },
      {
        name: 'experiment',
        label: 'Experiments',
        path: 'content/cms/experiments',
        format: 'json',
        ui: { router: documentRouter('projects/experiments') },
        fields: [
          ...sharedDocumentFields,
          textField('href', 'URL'),
          { name: 'external', label: 'External link', type: 'boolean' },
          referenceList('technologies', 'Technologies', 'technology'),
          translationsField([
            textField('name', 'Name'),
            textareaField('purpose', 'Purpose'),
            richTextField(),
            seoField(),
          ]),
        ],
      },
      {
        name: 'writing',
        label: 'Writing',
        path: 'content/cms/writing',
        format: 'json',
        ui: { router: documentRouter('writing') },
        fields: [
          { ...textField('slug', 'Slug'), isTitle: true, required: true },
          {
            name: 'hidden',
            label: 'Hide from the published site',
            type: 'boolean',
            description:
              'Keeps this document in the CMS, but removes it from listings and public routes.',
          },
          textField('dateISO', 'ISO date'),
          referenceField('typeCategory', 'Type', 'category'),
          referenceField('subjectCategory', 'Subject', 'category'),
          referenceList('tags', 'Tags', 'tag'),
          translationsField([
            textField('title', 'Title'),
            textareaField('excerpt', 'Excerpt'),
            textField('readingTime', 'Reading time'),
            richTextField(),
            seoField(),
          ]),
        ],
      },
      {
        name: 'resource',
        label: 'Achados',
        path: 'content/cms/references',
        format: 'json',
        ui: { router: documentRouter('achados') },
        fields: [
          { ...textField('slug', 'Slug'), isTitle: true, required: true },
          {
            name: 'hidden',
            label: 'Hide from the published site',
            type: 'boolean',
            description:
              'Keeps this document in the CMS, but removes it from listings and public routes.',
          },
          { name: 'order', label: 'Order', type: 'number', required: true },
          {
            name: 'type',
            label: 'Type',
            type: 'string',
            required: true,
            options: [
              'book',
              'article',
              'paper',
              'repo',
              'site',
              'docs',
              'tool',
              'course',
              'video',
              'playlist',
              'channel',
              'podcast',
              'film',
              'other',
            ],
          },
          referenceField('language', 'Language', 'language'),
          { name: 'image', label: 'Cover / thumbnail', type: 'image' },
          textField('authors', 'Authors / creators'),
          textField('organizations', 'Organizations'),
          textField('publishedDateISO', 'Publication date (ISO)'),
          textField('foundDateISO', 'Date found (ISO)'),
          {
            name: 'consumptionState',
            label: 'Consumption state',
            type: 'string',
            options: [
              'found',
              'saved-for-later',
              'exploring',
              'in-progress',
              'completed',
              'abandoned',
              'archived',
            ],
          },
          {
            name: 'rating',
            label: 'Rating',
            type: 'string',
            options: [
              'not-rated',
              'interesting',
              'recommended',
              'strongly-recommended',
              'not-recommended',
            ],
          },
          {
            name: 'editorialState',
            label: 'Editorial state',
            type: 'string',
            options: ['imported', 'pending-review', 'draft', 'reviewed', 'published', 'archived'],
          },
          {
            name: 'visibility',
            label: 'Visibility',
            type: 'string',
            options: ['public', 'unlisted', 'private', 'hidden', 'archived'],
          },
          referenceList('topics', 'Topics', 'topic', [
            {
              name: 'role',
              label: 'Role',
              type: 'string',
              options: ['primary', 'related', 'mentioned'],
            },
          ]),
          {
            name: 'links',
            label: 'External links',
            type: 'object',
            list: true,
            ui: { itemProps: (item: LinkItem) => ({ label: item?.label || item?.url || 'Link' }) },
            fields: [
              textField('url', 'URL'),
              textField('label', 'Label'),
              textField('platform', 'Platform'),
              {
                name: 'purpose',
                label: 'Purpose',
                type: 'string',
                options: [
                  'official-source',
                  'reading',
                  'viewing',
                  'purchase',
                  'download',
                  'documentation',
                  'repository',
                  'demo',
                  'translation',
                  'archived-version',
                  'review',
                  'discussion',
                  'author-page',
                  'publisher-page',
                  'other',
                ],
              },
              referenceField('linkLanguage', 'Language', 'language'),
              textField('region', 'Region'),
              {
                name: 'accessType',
                label: 'Access type',
                type: 'string',
                options: ['free', 'paid', 'subscription', 'institutional'],
              },
              { name: 'isPrimary', label: 'Primary link', type: 'boolean' },
              { name: 'isFree', label: 'Free', type: 'boolean' },
              { name: 'isPaid', label: 'Paid', type: 'boolean' },
              textareaField('note', 'Note'),
            ],
          },
          {
            name: 'identifiers',
            label: 'External identifiers',
            type: 'object',
            list: true,
            ui: {
              itemProps: (item: IdentifierItem) => ({
                label: item?.kind ? `${item.kind}: ${item.value ?? ''}` : 'Identifier',
              }),
            },
            fields: [
              {
                name: 'kind',
                label: 'Kind',
                type: 'string',
                options: ['isbn', 'doi', 'issn', 'imdb', 'tmdb', 'youtube', 'other'],
              },
              textField('value', 'Value'),
            ],
          },
          {
            name: 'relations',
            label: 'Relations to other references',
            type: 'object',
            list: true,
            ui: {
              itemProps: (item: RelationItem) => ({ label: item?.relationType || 'Relation' }),
            },
            fields: [
              {
                name: 'relationType',
                label: 'Relation type',
                type: 'string',
                required: true,
                options: referenceRelationTypeIds,
              },
              {
                name: 'target',
                label: 'Target reference',
                type: 'reference',
                collections: ['resource'],
              },
              textareaField('note', 'Note'),
              textField('context', 'Context'),
              {
                name: 'status',
                label: 'Status',
                type: 'string',
                options: ['suggested', 'automatic', 'verified', 'contested', 'removed', 'private'],
              },
              {
                name: 'visibility',
                label: 'Visibility',
                type: 'string',
                options: ['public', 'unlisted', 'private', 'hidden', 'archived'],
              },
            ],
          },
          {
            name: 'book',
            label: 'Book details',
            type: 'object',
            fields: [
              textField('isbn', 'ISBN'),
              textField('publisher', 'Publisher'),
              textField('edition', 'Edition'),
              { name: 'pages', label: 'Pages', type: 'number' },
            ],
          },
          {
            name: 'paper',
            label: 'Paper details',
            type: 'object',
            fields: [
              textField('doi', 'DOI'),
              textField('journal', 'Journal'),
              textField('conference', 'Conference'),
              textField('year', 'Year'),
            ],
          },
          {
            name: 'repo',
            label: 'Repository details',
            type: 'object',
            fields: [
              textField('org', 'Organization'),
              textField('name', 'Repository name'),
              textField('language', 'Primary language'),
              textField('license', 'License'),
            ],
          },
          {
            name: 'video',
            label: 'Video / playlist / channel details',
            type: 'object',
            fields: [
              textField('channel', 'Channel'),
              textField('duration', 'Duration'),
              textField('youtubeId', 'YouTube ID'),
            ],
          },
          {
            name: 'film',
            label: 'Film details',
            type: 'object',
            fields: [
              textField('director', 'Director'),
              textField('year', 'Year'),
              textField('duration', 'Duration'),
              textField('imdbId', 'IMDb ID'),
              textField('tmdbId', 'TMDb ID'),
            ],
          },
          translationsField([
            textField('title', 'Title'),
            textField('alternativeTitle', 'Alternative title'),
            textareaField('description', 'Short description'),
            textareaField('personalNote', 'Personal note'),
            textareaField('reasonFound', 'Reason found / motivation'),
            seoField(),
          ]),
        ],
      },
      {
        name: 'referenceCollection',
        label: 'Collections',
        path: 'content/cms/collections',
        format: 'json',
        ui: { router: documentRouter('colecoes') },
        fields: [
          { ...textField('slug', 'Slug'), isTitle: true, required: true },
          {
            name: 'hidden',
            label: 'Hide from the published site',
            type: 'boolean',
            description:
              'Keeps this document in the CMS, but removes it from listings and public routes.',
          },
          { name: 'order', label: 'Order', type: 'number', required: true },
          { name: 'image', label: 'Cover image', type: 'image' },
          referenceList('items', 'References', 'resource', [
            textareaField('note', 'Editorial note for this item'),
          ]),
          translationsField([
            textField('title', 'Title'),
            textareaField('description', 'Description'),
            richTextField('intro', 'Introduction'),
            seoField(),
          ]),
        ],
      },
      {
        name: 'technology',
        label: 'Technologies',
        path: 'content/cms/technologies',
        format: 'json',
        fields: [
          ...entityFields('Technology name'),
          {
            ...textField('logo', 'Brand logo slug'),
            description:
              'Optional Simple Icons slug (see https://simpleicons.org), for example "nextdotjs" or "postgresql". Leave empty for concepts without a brand logo; the site falls back to a monogram.',
          },
        ],
      },
      {
        name: 'language',
        label: 'Languages',
        path: 'content/cms/languages',
        format: 'json',
        fields: [...entityFields('Language name'), textField('code', 'Language code')],
      },
      {
        name: 'category',
        label: 'Categories',
        path: 'content/cms/categories',
        format: 'json',
        fields: [
          ...entityFields('Category name'),
          {
            name: 'kind',
            label: 'Category kind',
            type: 'string',
            options: ['skill', 'writing-type', 'writing-subject'],
          },
        ],
      },
      {
        name: 'tag',
        label: 'Tags',
        path: 'content/cms/tags',
        format: 'json',
        fields: entityFields('Tag name'),
      },
      {
        name: 'topic',
        label: 'Topics',
        path: 'content/cms/topics',
        format: 'json',
        fields: [
          ...entityFields('Topic name'),
          {
            name: 'kind',
            label: 'Kind',
            type: 'string',
            options: ['topic', 'category'],
            description:
              'Optional. Mark as "category" when this topic should act as a top-level organizing node in the knowledge map.',
          },
          referenceField('parent', 'Parent topic', 'topic'),
          {
            name: 'relations',
            label: 'Relations to other topics',
            type: 'object',
            list: true,
            ui: {
              itemProps: (item: RelationItem) => ({ label: item?.relationType || 'Relation' }),
            },
            fields: [
              {
                name: 'relationType',
                label: 'Relation type',
                type: 'string',
                required: true,
                options: topicRelationTypeIds,
              },
              {
                name: 'target',
                label: 'Target topic',
                type: 'reference',
                collections: ['topic'],
              },
              textareaField('note', 'Note'),
            ],
          },
        ],
      },
      {
        name: 'profile',
        label: 'Profile',
        path: 'content/cms/profile',
        format: 'json',
        match: { include: 'profile' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/pt-BR/about',
        },
        fields: [
          textField('name', 'Name'),
          textField('birthDate', 'Birth date (ISO, e.g. 1998-05-14)'),
          translationsField(profileFields),
        ],
      },
      {
        name: 'resume',
        label: 'Résumé',
        path: 'content/cms/resume',
        format: 'json',
        match: { include: 'resume' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/pt-BR/resume',
        },
        fields: [
          referenceList('selectedCases', 'Selected cases', 'caseStudy'),
          {
            name: 'skills',
            label: 'Technology groups',
            type: 'object',
            list: true,
            fields: [
              { name: 'category', label: 'Category', type: 'reference', collections: ['category'] },
              referenceList('technologies', 'Technologies', 'technology'),
            ],
          },
          {
            name: 'languages',
            label: 'Language proficiency',
            type: 'object',
            list: true,
            ui: {
              itemProps: (item: ProficiencyItem) => ({
                label: item?.proficiency || 'Language',
              }),
            },
            fields: [
              { name: 'language', label: 'Language', type: 'reference', collections: ['language'] },
              {
                name: 'proficiency',
                label: 'Proficiency',
                type: 'string',
                options: ['native', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                description:
                  'Leave empty when no CEFR level is stated; use Native for a native language.',
              },
            ],
          },
          translationsField(resumeFields),
        ],
      },
      pageCollection({
        name: 'homePage',
        label: 'Home page',
        filename: 'home',
        route: '/pt-BR',
        fields: [
          textField('heroIdentity', 'Hero identity'),
          textareaField('heroExperience', 'Hero experience'),
          textareaField('heroCurrentFocus', 'Hero current focus'),
          textField('availableLabel', 'Available label'),
          textField('unavailableLabel', 'Unavailable label'),
          textField('workEyebrow', 'Work eyebrow'),
          textField('workTitle', 'Work title'),
          textareaField('workDescription', 'Work description'),
          textField('projectsEyebrow', 'Projects eyebrow'),
          textField('projectsTitle', 'Projects title'),
          textareaField('projectsDescription', 'Projects description'),
          textareaField('experimentsSummary', 'Experiments summary'),
          textField('experienceEyebrow', 'Experience eyebrow'),
          textField('experienceTitle', 'Experience title'),
          textareaField('experienceDescription', 'Experience description'),
          textField('currentlyExploringLabel', 'Currently exploring label'),
          textField('recurringTechnologiesLabel', 'Recurring technologies label'),
          textField('writingEyebrow', 'Writing eyebrow'),
          textField('writingTitle', 'Writing title'),
          textareaField('writingDescription', 'Writing description'),
          textField('contactEyebrow', 'Contact eyebrow'),
          textField('contactTitle', 'Contact title'),
          textareaField('contactDescription', 'Contact description'),
        ],
        sharedFields: [
          referenceList('featuredCases', 'Featured cases', 'caseStudy'),
          referenceList('featuredProjects', 'Featured projects', 'project'),
          referenceList('featuredWriting', 'Featured writing', 'writing'),
        ],
      }),
      pageCollection({
        name: 'aboutPage',
        label: 'About page',
        filename: 'about',
        route: '/pt-BR/about',
        fields: [
          ...pageIntroductionFields,
          textField('lead', 'Lead'),
          textareaField('context', 'Context'),
          textField('storyEyebrow', 'Story eyebrow'),
          textField('storyTitle', 'Story title'),
          richTextField('story', 'Story'),
        ],
      }),
      pageCollection({
        name: 'casesPage',
        label: 'Cases page',
        filename: 'cases',
        route: '/pt-BR/cases',
        fields: [...pageIntroductionFields],
      }),
      pageCollection({
        name: 'projectsPage',
        label: 'Projects page',
        filename: 'projects',
        route: '/pt-BR/projects',
        fields: [
          ...pageIntroductionFields,
          textField('selectedLabel', 'Selected label'),
          textField('archiveLabel', 'Archive label'),
          textField('experimentsTitle', 'Experiments title'),
        ],
      }),
      pageCollection({
        name: 'writingPage',
        label: 'Writing page',
        filename: 'writing',
        route: '/pt-BR/writing',
        fields: [...pageIntroductionFields],
      }),
      pageCollection({
        name: 'achadosPage',
        label: 'Achados page',
        filename: 'achados',
        route: '/pt-BR/achados',
        fields: [...pageIntroductionFields],
      }),
      pageCollection({
        name: 'contactPage',
        label: 'Contact page',
        filename: 'contact',
        route: '/pt-BR/contact',
        fields: [...pageIntroductionFields],
      }),
      pageCollection({
        name: 'resumePage',
        label: 'Résumé page',
        filename: 'resume',
        route: '/pt-BR/resume',
        fields: [textField('title', 'Title'), textareaField('description', 'Description')],
      }),
      {
        name: 'credits',
        label: 'Credits',
        path: 'content/cms/credits',
        format: 'json',
        match: { include: 'credits' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/pt-BR/credits',
        },
        fields: [
          {
            name: 'entries',
            label: 'Credits',
            type: 'object',
            list: true,
            ui: {
              itemProps: (item: CreditItem) => ({
                label: item?.translations?.en?.name || 'Credit',
              }),
            },
            fields: [
              textField('url', 'URL'),
              {
                name: 'category',
                label: 'Category',
                type: 'string',
                options: ['reference', 'infrastructure'],
              },
              translationsField([
                textField('name', 'Name'),
                textareaField('description', 'Description'),
              ]),
            ],
          },
        ],
      },
      pageCollection({
        name: 'creditsPage',
        label: 'Credits page',
        filename: 'credits',
        route: '/pt-BR/credits',
        fields: [textField('title', 'Title'), textareaField('description', 'Description')],
      }),
      {
        name: 'interface',
        label: 'Interface copy',
        path: 'content/cms/settings',
        format: 'json',
        match: { include: 'interface' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/',
        },
        fields: [translationsField(interfaceFields(interfaceShape))],
      },
      {
        name: 'settings',
        label: 'Settings',
        path: 'content/cms/settings',
        format: 'json',
        match: { include: 'site' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/',
        },
        fields: [
          textField('shortName', 'Short name'),
          {
            ...textField('portfolioUrl', 'Public portfolio URL'),
            description:
              'Canonical public URL used by derived profile content. Leave blank until it is defined.',
          },
          {
            name: 'maintenanceEnabled',
            label: 'Maintenance mode',
            type: 'boolean',
            description:
              'Replaces every public page with the localized maintenance notice and disables indexing.',
          },
          translationsField([
            textField('copyrightTemplate', 'Copyright template'),
            {
              name: 'maintenance',
              label: 'Maintenance notice',
              type: 'object',
              fields: [
                textField('eyebrow', 'Eyebrow'),
                textField('title', 'Title'),
                textareaField('description', 'Description'),
              ],
            },
            seoField('Default SEO and social sharing'),
          ]),
          {
            name: 'contact',
            label: 'Contact and availability',
            type: 'object',
            fields: [
              textField('email', 'Email'),
              {
                name: 'profiles',
                label: 'External profiles',
                type: 'object',
                list: true,
                description: 'Links to external profiles (LinkedIn, GitHub, Lattes, ORCID, etc).',
                ui: {
                  itemProps: (item: ProfileItem) => ({
                    label: item?.platform || 'Profile',
                  }),
                },
                fields: [
                  {
                    name: 'platform',
                    label: 'Platform',
                    type: 'string',
                    options: [
                      'linkedin',
                      'github',
                      'lattes',
                      'orcid',
                      'instagram',
                      'gitlab',
                      'scholar',
                      'researchgate',
                      'mastodon',
                      'bluesky',
                      'other',
                    ],
                  },
                  textField(
                    'label',
                    'Label override (used when Platform is "Other", or to customize the link text)',
                  ),
                  textField('url', 'URL'),
                ],
              } as TinaField,
              { name: 'available', label: 'Available for opportunities', type: 'boolean' },
            ],
          },
        ],
      },
    ],
  },
});
