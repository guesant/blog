export type MetadataImageSource = {
  ogImageUrl?: string;
};

export function metadataImage(source?: MetadataImageSource): string | undefined {
  return source?.ogImageUrl;
}
