import { Card } from '../card';
import type { CaseCardFrameProps } from './case-card-types';

type CaseListingCardFrameProps = CaseCardFrameProps;

const listingStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-space-2)',
  padding: 'var(--site-inset-card)',
  borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
  backgroundColor: 'var(--site-surface)',
  transition:
    'border-color var(--site-duration-short-4), background-color var(--site-duration-short-4)',
  '&:hover': {
    borderColor: 'var(--site-primary-hover)',
    backgroundColor: 'var(--site-surface-hover)',
  },
  '&:hover .case-title': { color: 'secondary.main' },
};

export function CaseListingCardFrame(props: CaseListingCardFrameProps) {
  return <Card {...props} sx={listingStyles} />;
}
