import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { CatalogCard } from '../../content/catalog-card';
import { Typography } from '../../ui';

type HomeGalleryCatalogCardProps = {
  entry: HomeGalleryEntry;
  t: Translator;
};

export function HomeGalleryCatalogCard(props: HomeGalleryCatalogCardProps) {
  return (
    <CatalogCard href={props.entry.href}>
      <Typography variant="overline" color="text.secondary">
        {props.t(`kind.${props.entry.kind}`)}
      </Typography>
      <Typography component="h3" variant="h3">
        {props.entry.title}
      </Typography>
      <Typography color="text.secondary">{props.entry.description}</Typography>
    </CatalogCard>
  );
}
