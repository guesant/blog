import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeRecommendationQuoteProps = { children: ReactNode };

const quoteStyles = { marginBlockStart: 'var(--site-space-2)' };

export function ResumeRecommendationQuote(props: ResumeRecommendationQuoteProps) {
  return <Typography sx={quoteStyles}>{props.children}</Typography>;
}
