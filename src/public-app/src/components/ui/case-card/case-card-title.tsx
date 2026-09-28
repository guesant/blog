import { Typography } from '../typography';
import type { CaseCardTextProps } from './case-card-types';

type CaseCardTitleProps = CaseCardTextProps & { component: 'h2' | 'h3' };

const titleStyles = {
  listing: {
    marginBlockStart: 'var(--site-space-1)',
    fontSize: 'var(--site-text-xl)',
    transition: 'color .2s',
  },
  showcase: {
    marginBlockStart: 'var(--site-space-3)',
    transition: 'color .2s',
  },
  featured: {
    marginBlockStart: 'var(--site-space-3)',
    fontSize: { xs: '1.5rem', md: '1.75rem' },
  },
};

export function CaseCardTitle(props: CaseCardTitleProps) {
  const style =
    props.presentation === 'showcase' && props.compact
      ? { ...titleStyles.showcase, fontSize: '1.25rem' }
      : titleStyles[props.presentation];

  return (
    <Typography component={props.component} sx={style} className="case-title case-link-title">
      {props.children}
    </Typography>
  );
}
