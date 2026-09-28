import type { ReactNode } from 'react';
import { Stack } from '../stack';

type FindingCardMetadataRowProps = { children: ReactNode };

const rowStyles = {
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  rowGap: 'var(--site-gap-stack)',
  columnGap: 'var(--site-gap-cluster)',
  color: 'var(--site-text-secondary)',
  fontSize: 'var(--site-text-xs)',
  fontWeight: 'var(--site-weight-medium)',
  letterSpacing: 'var(--site-letter-label)',
  textTransform: 'uppercase',
  textAlign: 'left',
};

export function FindingCardMetadataRow(props: FindingCardMetadataRowProps) {
  return (
    <Stack direction="row" sx={rowStyles}>
      {props.children}
    </Stack>
  );
}
