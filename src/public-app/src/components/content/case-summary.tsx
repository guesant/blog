import type { CaseStudy } from '@portfolio/data/domain/types';
import { Typography } from '../ui';

type CaseSummaryProps = {
  item: CaseStudy;
  meta: string;
  headingLevel: 'h2' | 'h3';
  titleClassName?: string;
  titleVisualVariant?: string;
  summaryVisualVariant?: string;
};

export function CaseSummary(props: CaseSummaryProps) {
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {props.meta}
      </Typography>
      <Typography
        className={props.titleClassName}
        component={props.headingLevel}
        variant="h3"
        visualVariant={props.titleVisualVariant}
      >
        {props.item.title}
      </Typography>
      <Typography color="text.secondary" visualVariant={props.summaryVisualVariant}>
        {props.item.summary}
      </Typography>
    </>
  );
}
