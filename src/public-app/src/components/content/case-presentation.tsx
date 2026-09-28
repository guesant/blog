import type { ReactNode } from 'react';
import type { CaseStudy } from '@portfolio/data/domain/types';
import {
  CaseCardReadAction,
  CaseCardSummary,
  CaseCardTechnologies,
  CaseCardTitle,
  type CaseCardPresentation,
} from '../ui';
import { ContentNavigationActionIcon } from './content-navigation-action-icon';
import { CaseSummary } from './case-summary';

type CasePresentationProps = {
  item: CaseStudy;
  meta: ReactNode;
  headingLevel: 'h2' | 'h3';
  presentation: CaseCardPresentation;
  compact?: boolean;
  actionLabel: string;
};

export function CasePresentation(props: CasePresentationProps) {
  return (
    <>
      <CaseSummary item={props.item} meta={props.meta} />
      <CaseCardTitle
        component={props.headingLevel}
        presentation={props.presentation}
        compact={props.compact}
      >
        {props.item.title}
      </CaseCardTitle>
      <CaseCardSummary presentation={props.presentation}>{props.item.summary}</CaseCardSummary>
      <CaseCardTechnologies presentation={props.presentation} compact={props.compact}>
        {props.item.technologies.join(' · ')}
      </CaseCardTechnologies>
      <CaseCardReadAction presentation={props.presentation}>
        {props.actionLabel} <ContentNavigationActionIcon direction="external" size={15} />
      </CaseCardReadAction>
    </>
  );
}
