import type { Technology } from '@portfolio/data/domain/types';
import { CatalogCard } from '../../content/catalog-card';
import { CatalogEntrySummary } from '../../content/catalog-entry-summary';

type TechnologyCardProps = Technology;

export function TechnologyCard(props: TechnologyCardProps) {
  return (
    <CatalogCard href={props.url ?? `/technologies/${props.slug}`}>
      <CatalogEntrySummary
        title={props.name}
        description={props.skills.length > 0 ? props.skills.join(' · ') : undefined}
      />
    </CatalogCard>
  );
}
