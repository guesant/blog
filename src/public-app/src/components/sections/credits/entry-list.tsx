import { Box } from '../../ui';
import type { EntryListProps } from './types';
import { CreditEntryItem } from './credit-entry-item';

export function EntryList(props: EntryListProps) {
  const { entries } = props;

  return (
    <Box visualVariant="entryList">
      {entries.map((entry) => (
        <CreditEntryItem key={entry.url || entry.name} entry={entry} />
      ))}
    </Box>
  );
}
