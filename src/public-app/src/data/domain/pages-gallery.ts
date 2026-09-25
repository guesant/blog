export type HomeGalleryEntryKind =
  | 'cases'
  | 'projects'
  | 'experiments'
  | 'snippets'
  | 'technologies'
  | 'topics'
  | 'credits'
  | 'writing'
  | 'finding'
  | 'collection';

export type HomeGalleryEntry = Record<string, unknown> & {
  kind: HomeGalleryEntryKind;
  slug: string;
  title: string;
  description: string;
  href: string;
};

export type HomeCollectionShowcase = {
  collection: HomeGalleryEntry;
  items: HomeGalleryEntry[];
};

export type HomeGalleryFeedCategories = {
  writing: HomeGalleryEntry[];
  finding: HomeGalleryEntry[];
  collection: HomeGalleryEntry[];
};

export type HomeGalleryPortfolio = {
  cases: HomeGalleryEntry[];
  projects: HomeGalleryEntry[];
  experiments: HomeGalleryEntry[];
  collections: HomeGalleryEntry[];
  snippets: HomeGalleryEntry[];
  technologies: HomeGalleryEntry[];
  topics: HomeGalleryEntry[];
  credits: HomeGalleryEntry[];
};

export type HomeGallerySectionTotals = {
  writing: number;
  finding: number;
  collection: number;
};

export type HomeGalleryPortfolioTotals = {
  cases: number;
  projects: number;
  experiments: number;
  collections: number;
  snippets: number;
  technologies: number;
  topics: number;
  credits: number;
};

export type HomeGalleryTotals = {
  highlights: number;
  recent: HomeGallerySectionTotals;
  popular: HomeGallerySectionTotals;
  portfolio: HomeGalleryPortfolioTotals;
  collectionShowcases: number;
};

export type HomeGallery = {
  highlights: HomeGalleryEntry[];
  recent: HomeGalleryFeedCategories;
  popular: HomeGalleryFeedCategories;
  portfolio: HomeGalleryPortfolio;
  collectionShowcases: HomeCollectionShowcase[];
  totals: HomeGalleryTotals;
};
