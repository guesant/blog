import type { ReactNode } from 'react';
import { FindingCardDescription } from '../ui';
import type { IconName } from '../primitives/icon';
import { ConditionalContent } from '../primitives/conditional-content';
import { FindingCardSummaryTitle } from './finding-card-summary-title';

type FindingCardSummaryProps = {
  title: string;
  href: string;
  description: string;
  metadata?: ReactNode;
  headingLevel: 'h2' | 'h3';
  titleFontSize?: string;
  leadingIcon?: IconName;
};

export function FindingCardSummary(props: FindingCardSummaryProps) {
  return (
    <>
      <FindingCardSummaryTitle
        title={props.title}
        href={props.href}
        headingLevel={props.headingLevel}
        titleFontSize={props.titleFontSize}
        leadingIcon={props.leadingIcon}
      />

      {props.metadata}
      <ConditionalContent
        condition={Boolean(props.description)}
        content={<FindingCardDescription>{props.description}</FindingCardDescription>}
      />
    </>
  );
}
