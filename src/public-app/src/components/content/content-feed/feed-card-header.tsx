import { Box, Chip, Stack } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { formatDate } from '../format-date';
import type { AchadosTranslationKey } from '@/i18n/compat-support';

type FeedCardHeaderProps = Pick<FeedCardProps, 'entry' | 'locale' | 't' | 'onQuickFilter'>;

export function FeedCardHeader(props: FeedCardHeaderProps) {
  const kindMessageKey: AchadosTranslationKey = (
    {
      achado: 'finding',
      post: 'writing',
      colecao: 'collection',
    } as const
  )[props.entry.kind];

  const metadata = [formatDate(props.entry.date, props.locale), props.entry.readingTime]
    .filter(Boolean)
    .join(' · ');

  return (
    <Stack direction="row" visualVariant="feedCard">
      <Chip
        label={props.t(kindMessageKey)}
        size="small"
        clickable={Boolean(props.onQuickFilter)}
        onClick={() => props.onQuickFilter?.({ kind: props.entry.kind })}
        visualVariant="feedCardKind"
      />
      <Box component="span">{metadata}</Box>
    </Stack>
  );
}
