type TinaDocument = Record<string, unknown>;

export type TinaEditorPayload = {
  query: string;
  variables: { relativePath: string };
  data: Record<string, unknown>;
};

const documentSystemFields = `
  id
  _sys { filename relativePath path extension }
`;

const translationFields = (fields: string) => `
  translations {
    en { ${fields} }
    ptBR { ${fields} }
  }
`;

const seoFields = 'seo { title description image imageAlt keywords noIndex }';

const documentQuery = (name: string, fields: string) => `
  query ${name}Editor($relativePath: String!) {
    ${name}(relativePath: $relativePath) {
      ${documentSystemFields}
      ${fields}
    }
  }
`;

const tinaQueries = {
  caseStudy: documentQuery(
    'caseStudy',
    `slug hidden order visual technologies { item { ... on Technology { id slug ${translationFields('name')} } } } ${translationFields(
      `title status meta summary context role result metrics { label value } body ${seoFields}`,
    )}`,
  ),
  project: documentQuery(
    'project',
    `slug hidden order href external technologies { item { ... on Technology { id slug ${translationFields('name')} } } } ${translationFields(
      `name purpose problem currentFocus status metrics { label value } body ${seoFields}`,
    )}`,
  ),
  experiment: documentQuery(
    'experiment',
    `slug hidden order href external technologies { item { ... on Technology { id slug ${translationFields('name')} } } } ${translationFields(
      `name purpose body ${seoFields}`,
    )}`,
  ),
  writing: documentQuery(
    'writing',
    `slug hidden dateISO typeCategory { ... on Category { id slug ${translationFields('name')} } } subjectCategory { ... on Category { id slug ${translationFields('name')} } } tags { item { ... on Tag { id slug ${translationFields('name')} } } } ${translationFields(
      `title excerpt readingTime body ${seoFields}`,
    )}`,
  ),
  technology: documentQuery('technology', `slug order logo ${translationFields('name')}`),
  language: documentQuery('language', `slug order code ${translationFields('name')}`),
  category: documentQuery('category', `slug order kind ${translationFields('name')}`),
  tag: documentQuery('tag', `slug order ${translationFields('name')}`),
  topic: documentQuery('topic', `slug order ${translationFields('name')}`),
  profile: documentQuery(
    'profile',
    `name birthDate ${translationFields(
      'title location birthCity description interests learning personalInterests trajectory { hidden includeInResume role organization period highlights } milestones { hidden year title description }',
    )}`,
  ),
  resume: documentQuery(
    'resume',
    `selectedCases { item { ... on CaseStudy { id } } }
     skills { category { ... on Category { id slug ${translationFields('name')} } } technologies { item { ... on Technology { id slug ${translationFields('name')} } } } }
     languages { language { ... on Language { id slug code ${translationFields('name')} } } proficiency }
     ${translationFields(
       `summary
        leadership { hidden role organization period highlights }
        education { hidden institution location degree period }
        certificates { hidden name issuer url period }
        certifications { hidden name issuer url period credentialId }
        publications { hidden name issuer url period includeInPdf }
        recommendations { hidden author role quote url period }
        technicalProductions { hidden includeInPdf name kind description url period projectHref }
        events { hidden includeInPdf name role talkTitle location period url }
        awards { hidden includeInPdf name issuer description period url }`,
     )}`,
  ),
  settings: documentQuery(
    'settings',
    `shortName maintenanceEnabled ${translationFields(
      `copyrightTemplate maintenance { eyebrow title description } ${seoFields}`,
    )} contact { profiles { platform label url } available }`,
  ),
  homePage: documentQuery(
    'homePage',
    `featuredCases { item { ... on CaseStudy { id } } }
     featuredProjects { item { ... on Project { id } } }
     featuredWriting { item { ... on Writing { id } } }
     ${translationFields(
       `heroIdentity heroExperience heroCurrentFocus availableLabel unavailableLabel
       workEyebrow workTitle workDescription projectsEyebrow projectsTitle projectsDescription
       experimentsSummary experienceEyebrow experienceTitle experienceDescription
       currentlyExploringLabel recurringTechnologiesLabel writingEyebrow writingTitle
       writingDescription contactEyebrow contactTitle contactDescription ${seoFields}`,
     )}`,
  ),
  aboutPage: documentQuery(
    'aboutPage',
    translationFields(
      `eyebrow title description lead context storyEyebrow storyTitle story ${seoFields}`,
    ),
  ),
  casesPage: documentQuery(
    'casesPage',
    translationFields(`eyebrow title description ${seoFields}`),
  ),
  projectsPage: documentQuery(
    'projectsPage',
    translationFields(
      `eyebrow title description selectedLabel archiveLabel experimentsTitle ${seoFields}`,
    ),
  ),
  writingPage: documentQuery(
    'writingPage',
    translationFields(`eyebrow title description ${seoFields}`),
  ),
  contactPage: documentQuery(
    'contactPage',
    translationFields(`eyebrow title description ${seoFields}`),
  ),
  resumePage: documentQuery('resumePage', translationFields(`title description ${seoFields}`)),
  credits: documentQuery(
    'credits',
    `entries { url category ${translationFields('name description')} }`,
  ),
  creditsPage: documentQuery('creditsPage', translationFields(`title description ${seoFields}`)),
  resource: documentQuery(
    'resource',
    `slug hidden order type language { ... on Language { id slug code ${translationFields('name')} } }
     image authors organizations publishedDateISO foundDateISO
     consumptionState rating editorialState visibility
     topics { item { ... on Topic { id slug ${translationFields('name')} } } }
     links { url label platform purpose linkLanguage { ... on Language { id slug code ${translationFields('name')} } } region accessType isPrimary isFree isPaid note }
     identifiers { kind value }
     relations { relationType target { ... on Resource { id slug ${translationFields('title')} } } note context status visibility }
     book { isbn publisher edition pages }
     paper { doi journal conference year }
     repo { org name language license }
     video { channel duration youtubeId }
     film { director year duration imdbId tmdbId }
     ${translationFields(`title alternativeTitle description personalNote reasonFound ${seoFields}`)}`,
  ),
  referenceCollection: documentQuery(
    'referenceCollection',
    `slug hidden order image
     items { item { ... on Resource { id slug ${translationFields('title')} } } note }
     ${translationFields(`title description intro ${seoFields}`)}`,
  ),
} as const;

export type TinaQueryName = keyof typeof tinaQueries;

export function createTinaPayload(
  root: TinaQueryName,
  relativePath: string,
  document: TinaDocument,
): TinaEditorPayload {
  return {
    query: tinaQueries[root],
    variables: { relativePath },
    data: { [root]: document },
  };
}
