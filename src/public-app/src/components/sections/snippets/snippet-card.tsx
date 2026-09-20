import { Typography } from '../../ui';
import type { Snippet } from '@portfolio/data/domain/types';
import { CatalogCard } from '../../content/catalog-card';

type SnippetCardProps = Snippet;

export function SnippetCard(props: SnippetCardProps) {
  return (
    <CatalogCard href={`/snippets/${props.slug}`}>
      <Typography component="h2" variant="h5">
        {props.title}
      </Typography>
      <Typography color="text.secondary">{props.description}</Typography>
    </CatalogCard>
  );
}
