export type MetadataImageSource = {
  ogImageUrl?: string;
  seo?: {
    image?: string;
  };
};

export function metadataImage(source?: MetadataImageSource): string | undefined {
  return source?.seo?.image || source?.ogImageUrl;
}
