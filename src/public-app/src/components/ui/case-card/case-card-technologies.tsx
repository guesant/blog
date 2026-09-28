import { Typography } from '../typography';
import type { CaseCardTextProps } from './case-card-types';

type CaseCardTechnologiesProps = CaseCardTextProps;

const technologiesStyles = {
  listing: {
    color: 'text.secondary',
    fontSize: 'var(--site-text-sm)',
  },
  showcase: {
    marginBlockStart: 'auto',
    color: 'text.secondary',
    fontSize: '.8rem',
  },
  featured: { color: 'text.secondary', fontSize: '.8rem' },
};

export function CaseCardTechnologies(props: CaseCardTechnologiesProps) {
  return <Typography sx={technologiesStyles[props.presentation]}>{props.children}</Typography>;
}
