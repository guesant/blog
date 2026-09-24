import { Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { Technology } from '@portfolio/data/domain/types';
import { CatalogCard } from '../../content/catalog-card';

type TechnologyCardProps = Technology;

export function TechnologyCard(props: TechnologyCardProps) {
  return (
    <CatalogCard href={props.url ?? `/technologies/${props.slug}`}>
      <Typography component="h2" variant="h5">
        {props.name}
      </Typography>
      <ConditionalContent
        condition={props.skills.length > 0}
        content={<Typography color="text.secondary">{props.skills.join(' · ')}</Typography>}
      />
    </CatalogCard>
  );
}
