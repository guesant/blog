import type { ExternalLink } from './refs-links';
import type { Reference } from './refs-details';

export type RichTextContent = Record<string, unknown>;

type SeoMetadata = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export type WithSeo = {
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

export type Technology = TechnologyBadge & {
  code?: string;
  url: string;
  skills: string[];
};

type SnippetFile = {
  id: string;
  path: string;
  language?: string;
  content: string;
};

export type Snippet = {
  slug: string;
  title: string;
  description: string;
  publishedAt?: string;
  url: string;
  downloadUrl: string;
  files: SnippetFile[];
};

export type CaseStudy = WithSeo & {
  hidden?: boolean;
  order: number;
  slug: string;
  url?: string;
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

export type Project = WithSeo & {
  hidden?: boolean;
  order: number;
  slug: string;
  url?: string;
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

export type Experiment = WithSeo & {
  hidden?: boolean;
  order: number;
  slug: string;
  url?: string;
  name: string;
  purpose: string;
  technologies: string[];
  technologySlugs?: string[];
  href: string;
  external?: boolean;
  body?: RichTextContent;
};

export type Writing = WithSeo & {
  hidden?: boolean;
  slug: string;
  url?: string;
  type: string;
  subject: string;
  tags: string[];
  title: string;
  excerpt: string;
  readingTime: string;
  dateISO: string;
  topicSlugs?: string[];
  topicUrls?: string[];
  language?: 'en' | 'pt-BR';
  body: RichTextContent;
};

export type PublicFeedItem = {
  kind: 'post' | 'achado' | 'colecao';
  slug: string;
  title: string;
  preview: string;
  date: string;
  readingTime?: string;
  topics: { name: string; slug?: string; url?: string }[];
  findingType?: string;
  popularity?: { value: number; kind: string; rank: number };
  featured?: boolean;
  links?: ExternalLink[];
  reference?: Reference;
  href: string;
};
