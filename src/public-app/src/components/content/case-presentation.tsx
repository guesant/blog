import type { ReactNode } from 'react';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { CaseSummary } from './case-summary';
import { CaseTechnologies } from './case-technologies';

type CasePresentationProps = {
  item: CaseStudy;
  meta: ReactNode;
  headingLevel: 'h2' | 'h3';
  titleClassName?: string;
  titleVisualVariant?: string;
  summaryVisualVariant?: string;
  technologiesVisualVariant?: string;
  action?: ReactNode;
};

export function CasePresentation(props: CasePresentationProps) {
  return (
    <>
      <CaseSummary
        item={props.item}
        meta={props.meta}
        headingLevel={props.headingLevel}
        titleClassName={props.titleClassName}
        titleVisualVariant={props.titleVisualVariant}
        summaryVisualVariant={props.summaryVisualVariant}
      />
      <CaseTechnologies item={props.item} visualVariant={props.technologiesVisualVariant} />
      {props.action}
    </>
  );
}
