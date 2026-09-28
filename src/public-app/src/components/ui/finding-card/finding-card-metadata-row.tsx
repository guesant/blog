import type { ReactNode } from 'react';
import { Stack } from '../stack';

type FindingCardMetadataRowProps = { children: ReactNode };

const rowStyles = {
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  gap: 'var(--site-space-3)',
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
