import { Typography } from '../typography';
import type { CaseCardTextProps } from './case-card-types';

type CaseCardReadActionProps = CaseCardTextProps;

const actionStyles = {
  listing: {
    display: 'inline-flex',
    gap: 'var(--site-space-1)',
    alignItems: 'center',
    fontWeight: 'var(--site-weight-semibold)',
  },
  showcase: {
    display: 'inline-flex',
    gap: 'var(--site-space-2)',
    alignItems: 'center',
    fontWeight: 'var(--site-weight-semibold)',
  },
  featured: {},
};

export function CaseCardReadAction(props: CaseCardReadActionProps) {
  return (
    <Typography color="secondary" sx={actionStyles[props.presentation]}>
      {props.children}
    </Typography>
  );
}
