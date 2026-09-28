import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeRecommendationQuoteProps = { children: ReactNode };

export function ResumeRecommendationQuote(props: ResumeRecommendationQuoteProps) {
  return <Typography>{props.children}</Typography>;
}
