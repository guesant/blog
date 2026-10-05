import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import { useLocale } from '@/i18n/compat';
import type { HomeTranslator } from '@/i18n/compat-support';
import { formatDate } from './format-date';
import { ConditionalContent } from '../primitives/conditional-content';
import { ContentDateLabel, FindingCardKindChip, FindingCardMetadataRow } from '../ui';

type CatalogFeedCardMetadataProps = {
  entry: HomeGalleryEntry;
  t: HomeTranslator;
};

export function CatalogFeedCardMetadata(props: CatalogFeedCardMetadataProps) {
  const locale = useLocale();

  const date = formatDate(props.entry.date ?? '', locale);

  const kindLabel = props.entry.category || props.t(`kind.${props.entry.kind}`);

  return (
    <FindingCardMetadataRow>
      <FindingCardKindChip>{kindLabel}</FindingCardKindChip>
      <ConditionalContent
        condition={Boolean(date)}
        content={<ContentDateLabel>{date}</ContentDateLabel>}
      />
    </FindingCardMetadataRow>
  );
}
