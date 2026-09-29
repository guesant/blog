import type { SeoMetadata } from '../domain/content';
import { booleanValue } from './public-site-source-boolean-value';
import { objectValue } from './public-site-source-object-value';
import { optionalStringValue } from './public-site-source-optional-string-value';
import { recordList } from './public-site-source-list';
import { stringValue } from './public-site-source-string-value';

export function seoMetadata(value: unknown): SeoMetadata | undefined {
  const source = objectValue(value);

  if (!source) {
    return undefined;
  }

  return {
    title: optionalStringValue(source.title),
    description: optionalStringValue(source.description),
    canonical: optionalStringValue(source.canonical),
    image: optionalStringValue(source.image),
    imageAlt: optionalStringValue(source.imageAlt),
    robots: optionalStringValue(source.robots),
    keywords: recordList<unknown>(source.keywords).map(stringValue),
    noIndex: booleanValue(source.noIndex),
  };
}
