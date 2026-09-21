import type { ExternalLink } from './refs-links';
import type { RichTextContent, WithSeo } from './content';

type ReferenceIdentifier = {
  kind: 'isbn' | 'doi' | 'issn' | 'imdb' | 'tmdb' | 'youtube' | 'other';
  value: string;
};

export type ReferenceRelation = {
  relationType: string;
  family?: string;
  direction: 'outbound' | 'inbound';
  label: string;
  targetKind?: string;
  targetSlug: string;
  targetTitle: string;
  targetUrl?: string;
  note?: string;
  context?: string;
  status: string;
};

type ReferenceBookDetails = {
  isbn?: string;
  publisher?: string;
  edition?: string;
  pages?: number;
};

type ReferencePaperDetails = {
  doi?: string;
  journal?: string;
  conference?: string;
  year?: string;
};

type ReferenceRepoDetails = {
  org?: string;
  name?: string;
  language?: string;
  license?: string;
};

type ReferenceVideoDetails = {
  channel?: string;
  duration?: string;
  youtubeId?: string;
  playlistId?: string;
  channelId?: string;
  handle?: string;
};

type ReferenceFilmDetails = {
  director?: string;
  year?: string;
  duration?: string;
  imdbId?: string;
  tmdbId?: string;
};

export type Reference = WithSeo & {
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
  popularity?: {
    value: number;
    kind: string;
    rank: number;
  };
  featured?: boolean;
  featuredOrder?: number;
  identifiers: ReferenceIdentifier[];
  relations: ReferenceRelation[];
  book?: ReferenceBookDetails;
  paper?: ReferencePaperDetails;
  repo?: ReferenceRepoDetails;
  video?: ReferenceVideoDetails;
  film?: ReferenceFilmDetails;
};

type TopicRelation = {
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

type TopicMembership = {
  topicSlug: string;
  role?: 'primary' | 'related' | 'mentioned';
};

type ReferenceCollectionItem = {
  reference: Reference;
  note?: string;
};

export type ReferenceCollection = WithSeo & {
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
