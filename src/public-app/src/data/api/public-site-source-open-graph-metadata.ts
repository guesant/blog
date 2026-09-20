import type { OpenGraphMetadata } from '../domain/types.ts';
import { objectValue } from './public-site-source-object-value';
import { stringField } from './public-site-source-string-field';

export function openGraphMetadata(value: unknown): OpenGraphMetadata | undefined {
  const metadata = objectValue(value);

  if (!metadata) {
    return undefined;
  }

  const result = {
    title: stringField(metadata.title),
    description: stringField(metadata.description),
    image: stringField(metadata.image),
    siteName: stringField(metadata.site_name),
    type: stringField(metadata.type),
    url: stringField(metadata.url),
  };

  return Object.values(result).some(Boolean) ? result : undefined;
}
