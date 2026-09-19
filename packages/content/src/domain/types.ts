import type { ProtectedEmailChallenge } from './protected-email/types.ts';

export type RichTextContent = Record<string, unknown>;

export type ContentEditingState = {
  query: string;
  variables: { relativePath: string };
  data: Record<string, unknown>;
  root: string;
};

export type EditableContent = {
  _contentEditing?: ContentEditingState;
};

export type SeoMetadata = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  noIndex?: boolean;
};

type WithSeo = {
  seo?: SeoMetadata;
};

type MetricItem = {
  label: string;
  value: string;
};

export type TechnologyBadge = {
  slug: string;
  name: string;
  logo?: string;
};

export type CaseStudy = EditableContent &
  WithSeo & {
    hidden?: boolean;
    order: number;
    slug: string;
    number: string;
    title: string;
    status?: string;
    meta: string;
    summary: string;
    context: string;
    role: string;
    result: string;
    technologies: string[];
    technologySlugs?: string[];
    metrics: MetricItem[];
    visual: 'queue' | 'architecture' | 'process';
    body?: RichTextContent;
  };

export type Project = EditableContent &
  WithSeo & {
    hidden?: boolean;
    order: number;
    slug: string;
    name: string;
    purpose: string;
    problem?: string;
    currentFocus?: string;
    status: string;
    technologies: string[];
    technologySlugs?: string[];
    metrics: MetricItem[];
    href: string;
    external?: boolean;
    body?: RichTextContent;
  };

export type Experiment = EditableContent &
  WithSeo & {
    hidden?: boolean;
    order: number;
    slug: string;
    name: string;
    purpose: string;
    technologies: string[];
    technologySlugs?: string[];
    href: string;
    external?: boolean;
    body?: RichTextContent;
  };

export type Writing = EditableContent &
  WithSeo & {
    hidden?: boolean;
    slug: string;
    type: string;
    subject: string;
    tags: string[];
    title: string;
    excerpt: string;
    readingTime: string;
    dateISO: string;
    language?: 'en' | 'pt-BR';
    body: RichTextContent;
  };

type TrajectoryItem = {
  hidden?: boolean;
  includeInResume?: boolean;
  role: string;
  organization: string;
  period: string;
  highlights: string[];
};

export type ProfileMilestone = {
  hidden?: boolean;
  year: string;
  title: string;
  description: string;
};

type ResumeSkillGroup = {
  label: string;
  items: string[];
};

export type LanguageProficiency = {
  code: string;
  name: string;
  proficiency?: 'native' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
};

type LeadershipItem = {
  hidden?: boolean;
  role: string;
  organization: string;
  period: string;
  highlights: string[];
};

type EducationItem = {
  hidden?: boolean;
  institution: string;
  location: string;
  degree: string;
  period: string;
};

type CredentialItem = {
  hidden?: boolean;
  name: string;
  issuer: string;
  url?: string;
  period: string;
  credentialId?: string;
};

type PublicationItem = CredentialItem & {
  includeInPdf?: boolean;
};

type RecommendationItem = {
  hidden?: boolean;
  author: string;
  role: string;
  quote: string;
  url?: string;
  period?: string;
};

type TechnicalProductionItem = {
  hidden?: boolean;
  includeInPdf?: boolean;
  name: string;
  kind: 'software' | 'library' | 'tool' | 'dataset' | 'other';
  description?: string;
  url?: string;
  period: string;
  projectHref?: string;
};

type EventItem = {
  hidden?: boolean;
  includeInPdf?: boolean;
  name: string;
  role: 'speaker' | 'organizer' | 'panelist' | 'attendee' | 'other';
  talkTitle?: string;
  location?: string;
  period: string;
  url?: string;
};

type AwardItem = {
  hidden?: boolean;
  includeInPdf?: boolean;
  name: string;
  issuer: string;
  description?: string;
  period: string;
  url?: string;
};

export type ContentReference = string | { item: string };

export type ExternalLink = {
  url: string;
  label?: string;
  platform?: string;
  purpose?: string;
  language?: string;
  region?: string;
  accessType?: 'free' | 'paid' | 'subscription' | 'institutional';
  isPrimary?: boolean;
  isFree?: boolean;
  isPaid?: boolean;
  note?: string;
};

export type ReferenceIdentifier = {
  kind: 'isbn' | 'doi' | 'issn' | 'imdb' | 'tmdb' | 'youtube' | 'other';
  value: string;
};

export type ReferenceRelation = {
  relationType: string;
  family?: string;
  direction: 'outbound' | 'inbound';
  label: string;
  targetSlug: string;
  targetTitle: string;
  note?: string;
  context?: string;
  status: string;
};

export type ReferenceBookDetails = {
  isbn?: string;
  publisher?: string;
  edition?: string;
  pages?: number;
};

export type ReferencePaperDetails = {
  doi?: string;
  journal?: string;
  conference?: string;
  year?: string;
};

export type ReferenceRepoDetails = {
  org?: string;
  name?: string;
  language?: string;
  license?: string;
};

export type ReferenceVideoDetails = {
  channel?: string;
  duration?: string;
  youtubeId?: string;
};

export type ReferenceFilmDetails = {
  director?: string;
  year?: string;
  duration?: string;
  imdbId?: string;
  tmdbId?: string;
};

export type Reference = EditableContent &
  WithSeo & {
    hidden?: boolean;
    order: number;
    slug: string;
    type: string;
    language?: string;
    image?: string;
    authors?: string;
    organizations?: string;
    publishedDateISO?: string;
    foundDateISO?: string;
    consumptionState: string;
    rating: string;
    editorialState: string;
    visibility: string;
    title: string;
    alternativeTitle?: string;
    description: string;
    personalNote?: string;
    reasonFound?: string;
    topics: string[];
    topicSlugs?: string[];
    topicMemberships?: TopicMembership[];
    links: ExternalLink[];
    identifiers: ReferenceIdentifier[];
    relations: ReferenceRelation[];
    book?: ReferenceBookDetails;
    paper?: ReferencePaperDetails;
    repo?: ReferenceRepoDetails;
    video?: ReferenceVideoDetails;
    film?: ReferenceFilmDetails;
  };

export type TopicRelation = {
  relationType: string;
  targetSlug: string;
  note?: string;
};

export type Topic = {
  slug: string;
  name: string;
  kind?: 'topic' | 'category';
  parentSlug?: string;
  relations?: TopicRelation[];
};

export type TopicMembership = {
  topicSlug: string;
  role?: 'primary' | 'related' | 'mentioned';
};

export type GraphNodeKind = 'reference' | 'topic';

export type GraphNode = {
  id: string;
  kind: GraphNodeKind;
  label: string;
  meta?: Record<string, unknown>;
};

export type GraphEdge = {
  source: string;
  target: string;
  relationType: string;
  label?: string;
};

export type KnowledgeGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type ReferenceCollectionItem = {
  reference: Reference;
  note?: string;
};

export type ReferenceCollection = EditableContent &
  WithSeo & {
    hidden?: boolean;
    order: number;
    slug: string;
    image?: string;
    title: string;
    description: string;
    intro?: RichTextContent;
  };

export type ReferenceCollectionDetail = ReferenceCollection & {
  items: ReferenceCollectionItem[];
};

export type ResumeContent = EditableContent & {
  summary: string;
  skills: ResumeSkillGroup[];
  languages: LanguageProficiency[];
  selectedCases: ContentReference[];
  leadership: LeadershipItem[];
  education: EducationItem[];
  certificates: CredentialItem[];
  certifications: CredentialItem[];
  publications: PublicationItem[];
  recommendations: RecommendationItem[];
  technicalProductions: TechnicalProductionItem[];
  events: EventItem[];
  awards: AwardItem[];
};

export type Profile = EditableContent & {
  name: string;
  birthDate?: string;
  title: string;
  location: string;
  birthCity?: string;
  description: string;
  interests: string;
  learning: string;
  personalInterests: string[];
  trajectory: TrajectoryItem[];
  milestones: ProfileMilestone[];
};

type ExternalProfilePlatform =
  | 'linkedin'
  | 'github'
  | 'lattes'
  | 'orcid'
  | 'instagram'
  | 'gitlab'
  | 'scholar'
  | 'researchgate'
  | 'mastodon'
  | 'bluesky'
  | 'other';

export type ExternalProfile = {
  platform: ExternalProfilePlatform;
  label?: string;
  url: string;
};

type ContactInformation = {
  hasEmail: boolean;
  emailChallenge?: ProtectedEmailChallenge;
  profiles: ExternalProfile[];
  available: boolean;
};

type MaintenanceContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type NavigationItem = {
  route: string;
  label: string;
  children: NavigationItem[];
};

export type SiteNavigation = {
  sidebar: NavigationItem[][];
  footerLinks: NavigationItem[];
  sitemap: NavigationItem[];
};

export type SiteVisibility = {
  about: boolean;
  resume: boolean;
  portfolio: boolean;
  cases: boolean;
  contact: boolean;
  license: boolean;
  credits: boolean;
  follow: boolean;
  feed: boolean;
  writing: boolean;
  findings: boolean;
  topics: boolean;
  collections: boolean;
  snippets: boolean;
  rightSidebar: boolean;
};

export type SiteBuild = {
  commitSha?: string;
};

export type SiteText = EditableContent &
  WithSeo & {
    shortName: string;
    portfolioUrl?: string;
    copyrightTemplate: string;
    maintenanceEnabled: boolean;
    maintenance: MaintenanceContent;
    contact: ContactInformation;
    sourceRepositoryUrl?: string;
    navigation?: SiteNavigation;
    visibility?: SiteVisibility;
    build?: SiteBuild;
  };

export type InterfaceMessage = string | { [key: string]: InterfaceMessage };

export type InterfaceMessages = { [key: string]: InterfaceMessage };

export type DeveloperPlatformLanguage = {
  name: string;
  bytes: number;
};

export type GitHubDeveloperPlatformStatistics = {
  username: string;
  followers: number;
  publicRepositories: number;
  starsReceived: number;
  commitsLastYear: number;
  pullRequestsLastYear: number;
  issuesLastYear: number;
  contributionsLastYear: number;
  topLanguages: DeveloperPlatformLanguage[];
};

export type DeveloperPlatformStatistics = {
  schemaVersion: 1;
  updatedAt: string;
  github: GitHubDeveloperPlatformStatistics;
  gitlab: null;
};

export type PageIntroduction = EditableContent &
  WithSeo & {
    eyebrow: string;
    title: string;
    description: string;
  };

export type HomePageCopy = EditableContent &
  WithSeo & {
    featuredCases: ContentReference[];
    featuredProjects: ContentReference[];
    featuredWriting: ContentReference[];
    heroIdentity: string;
    heroExperience: string;
    heroCurrentFocus: string;
    availableLabel: string;
    unavailableLabel: string;
    workEyebrow: string;
    workTitle: string;
    workDescription: string;
    projectsEyebrow: string;
    projectsTitle: string;
    projectsDescription: string;
    experimentsSummary: string;
    experienceEyebrow: string;
    experienceTitle: string;
    experienceDescription: string;
    currentlyExploringLabel: string;
    recurringTechnologiesLabel: string;
    writingEyebrow: string;
    writingTitle: string;
    writingDescription: string;
    contactEyebrow: string;
    contactTitle: string;
    contactDescription: string;
  };

export type AboutPageCopy = PageIntroduction & {
  lead: string;
  context: string;
  storyEyebrow?: string;
  storyTitle?: string;
  story?: RichTextContent;
};

export type ProjectsPageCopy = PageIntroduction & {
  selectedLabel: string;
  archiveLabel: string;
  experimentsTitle: string;
};

export type ResumePageCopy = EditableContent &
  WithSeo & {
    title: string;
    description: string;
  };

export type HomePageContent = {
  cases: CaseStudy[];
  projects: Project[];
  experiments: Experiment[];
  writings: Writing[];
  profile: Profile;
  resume: ResumeContent;
  page: HomePageCopy;
  site: SiteText;
  recurringTechnologies: TechnologyBadge[];
};

export type ResumePageContent = {
  profile: Profile;
  site: SiteText;
  resume: ResumeContent;
  cases: CaseStudy[];
  page: ResumePageCopy;
};

type CreditEntry = {
  url: string;
  category: 'reference' | 'infrastructure';
  name: string;
  description: string;
};

export type CreditsContent = EditableContent & {
  entries: CreditEntry[];
};

export type CreditsPageCopy = EditableContent &
  WithSeo & {
    title: string;
    description: string;
  };

export type PackageCredit = {
  name: string;
  version: string;
  description?: string;
  license?: string;
  author?: string;
  repositoryUrl?: string;
};

export type CreditsPageContent = {
  page: CreditsPageCopy;
  credits: CreditsContent;
  libraries: PackageCredit[];
  tools: PackageCredit[];
};

export type NavigationAvailability = {
  cases: boolean;
  projects: boolean;
  writing: boolean;
  achados: boolean;
  contact: boolean;
};
