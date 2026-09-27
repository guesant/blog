import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { CatalogCard } from '../../content/catalog-card';
import { CatalogEntrySummary } from '../../content/catalog-entry-summary';
import { Typography } from '../../ui';

type HomeGalleryCatalogCardProps = {
  entry: HomeGalleryEntry;
  t: HomeTranslator;
};

export function HomeGalleryCatalogCard(props: HomeGalleryCatalogCardProps) {
  return (
    <CatalogCard href={props.entry.href}>
      <CatalogEntrySummary
        meta={
          <Typography variant="overline" color="text.secondary">
            {props.t(`kind.${props.entry.kind}`)}
          </Typography>
        }
        title={props.entry.title}
        description={props.entry.description}
        titleComponent="h3"
        titleVariant="h3"
      />
    </CatalogCard>
  );
}
