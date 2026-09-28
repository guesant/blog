import { Card } from '../card';
import type { CaseCardFrameProps } from './case-card-types';

type CaseShowcaseCardFrameProps = CaseCardFrameProps & { compact?: boolean };

const showcaseStyles = {
  display: 'flex',
  flexDirection: 'column',
  padding: 'var(--site-space-6)',
  color: 'text.primary',
  textDecoration: 'none',
  backgroundColor: 'rgba(255,255,255,.56)',
  transition: 'border-color .2s, background-color .2s, transform .2s',
  '&:hover': {
    borderColor: 'rgba(29,95,167,.55)',
    backgroundColor: 'background.paper',
    transform: 'translateY(-2px)',
  },
  '&:hover .case-link-title': { color: 'secondary.main' },
};

export function CaseShowcaseCardFrame(props: CaseShowcaseCardFrameProps) {
  const { compact, ...cardProps } = props;

  return <Card {...cardProps} sx={{ ...showcaseStyles, minHeight: compact ? '14rem' : 'auto' }} />;
}
