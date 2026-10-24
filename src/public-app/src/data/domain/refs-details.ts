import type { RichTextContent, WithOgImage } from './content';

type ReferenceCollection = WithOgImage & {
  hidden?: boolean;
  order: number;
  slug: string;
  url?: string;
  image?: string;
  title: string;
  description: string;
  intro?: RichTextContent;
};

type TopicRelation = {
  relationType: string;
  targetSlug: string;
  note?: string;
};

export type Topic = {
  slug: string;
  url?: string;
  name: string;
  kind?: 'topic' | 'category';
  parentSlug?: string;
  relations?: TopicRelation[];
};

export type ReferenceCollectionDetail = ReferenceCollection & {
  items: never[];
};
