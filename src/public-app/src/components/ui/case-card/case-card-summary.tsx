import { Typography } from '../typography';
import type { CaseCardTextProps } from './case-card-types';

type CaseCardSummaryProps = CaseCardTextProps;

const summaryStyles = {
  listing: {
    marginBlockStart: 'var(--site-space-1)',
    maxWidth: '58ch',
    fontSize: 'var(--site-text-body)',
  },
  showcase: {
    marginBlockStart: 'var(--site-space-3)',
    maxWidth: '52ch',
    fontSize: '.9rem',
  },
  featured: { marginBlockStart: 'var(--site-space-2)', maxWidth: '56ch' },
};

export function CaseCardSummary(props: CaseCardSummaryProps) {
  return (
    <Typography color="text.secondary" sx={summaryStyles[props.presentation]}>
      {props.children}
    </Typography>
  );
}
