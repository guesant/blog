import { FindingFacets } from './public-site-source-support';
import { objectValue } from './public-site-source-object-value';

export function findingFacets(value: unknown): FindingFacets {
  const facets = objectValue(value);

  const topics = Array.isArray(facets?.topics) ? facets.topics : [];

  const stringValues = (key: string) =>
    Array.isArray(facets?.[key]) ? facets[key].map((item: unknown) => String(item)) : [];

  return {
    types: stringValues('types'),
    ratings: stringValues('ratings'),
    consumptionStates: stringValues('consumptionStates'),
    years: stringValues('years'),
    topics: topics.flatMap((item) => {
      const topic = objectValue(item);

      return topic ? [{ slug: String(topic.slug ?? ''), name: String(topic.name ?? '') }] : [];
    }),
  };
}
