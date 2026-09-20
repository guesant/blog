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
  openGraph?: OpenGraphMetadata;
};

export type OpenGraphMetadata = {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: string;
  url?: string;
};
