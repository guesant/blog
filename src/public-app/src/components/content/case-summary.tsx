import type { CaseStudy } from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';
import { Typography } from '../ui';

type CaseSummaryProps = {
  item: CaseStudy;
  meta: ReactNode;
};

export function CaseSummary(props: CaseSummaryProps) {
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {props.meta}
      </Typography>
    </>
  );
}
