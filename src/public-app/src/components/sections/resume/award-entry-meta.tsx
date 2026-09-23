import { Typography } from '../../ui';
import type { AwardEntriesProps } from './types';

type AwardEntryMetaProps = {
  item: AwardEntriesProps['items'][number];
};

export function AwardEntryMeta(props: AwardEntryMetaProps) {
  return (
    <Typography variant="body2" color="text.secondary" visualVariant="awardEntries">
      {props.item.issuer}
    </Typography>
  );
}
