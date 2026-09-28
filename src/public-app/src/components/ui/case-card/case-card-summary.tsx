import { Typography } from '../typography';
import type { CaseCardTextProps } from './case-card-types';

type CaseCardSummaryProps = CaseCardTextProps;

const summaryStyles = {
  listing: {
    maxWidth: '58ch',
    fontSize: 'var(--site-text-body)',
  },
  showcase: {
    maxWidth: '52ch',
    fontSize: '.9rem',
  },
  featured: { maxWidth: '56ch' },
};

export function CaseCardSummary(props: CaseCardSummaryProps) {
  return (
    <Typography color="text.secondary" sx={summaryStyles[props.presentation]}>
      {props.children}
    </Typography>
  );
}
