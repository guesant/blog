import type { Snippet } from '@portfolio/data/domain/types';
import { CatalogCard } from '../../content/catalog-card';
import { CatalogEntrySummary } from '../../content/catalog-entry-summary';

type SnippetCardProps = Snippet;

export function SnippetCard(props: SnippetCardProps) {
  return (
    <CatalogCard href={props.url ?? `/snippets/${props.slug}`}>
      <CatalogEntrySummary title={props.title} description={props.description} />
    </CatalogCard>
  );
}
