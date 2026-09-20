import { Box, Typography } from '../../ui';
import { ExternalLink } from '../../primitives/external-link';
import type { CreditEntry } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';

type CreditEntryItemProps = { entry: CreditEntry };

export function CreditEntryItem(props: CreditEntryItemProps) {
  const { entry } = props;

  return (
    <Box>
      <ConditionalContent
        condition={Boolean(entry.url)}
        content={
          <ExternalLink href={entry.url ?? '#'} visualVariant="creditEntryItem">
            {entry.name}
          </ExternalLink>
        }
      />
      <ConditionalContent
        condition={!entry.url}
        content={<Typography visualVariant="creditEntryItem">{entry.name}</Typography>}
      />
      <Typography variant="body2" color="text.secondary" visualVariant="creditEntryItem2">
        {entry.description}
      </Typography>
    </Box>
  );
}
