import type { ReactNode } from 'react';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { CaseCardReadAction, CaseCardSummary, CaseCardTechnologies, CaseCardTitle } from '../ui';
import { ContentNavigationActionIcon } from './content-navigation-action-icon';
import { CaseSummary } from './case-summary';

type CasePresentationProps = {
  item: CaseStudy;
  meta: ReactNode;
  headingLevel: 'h2' | 'h3';
  actionLabel: string;
};

export function CasePresentation(props: CasePresentationProps) {
  return (
    <>
      <CaseSummary item={props.item} meta={props.meta} />
      <CaseCardTitle component={props.headingLevel}>{props.item.title}</CaseCardTitle>
      <CaseCardSummary>{props.item.summary}</CaseCardSummary>
      <CaseCardTechnologies>{props.item.technologies.join(' · ')}</CaseCardTechnologies>
      <CaseCardReadAction>
        {props.actionLabel} <ContentNavigationActionIcon direction="external" size={15} />
      </CaseCardReadAction>
    </>
  );
}
