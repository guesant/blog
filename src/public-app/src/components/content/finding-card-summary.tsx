import type { ReactNode } from 'react';
import { ConditionalContent } from '../primitives/conditional-content';
import { NavLink } from '../primitives/nav-link';
import {
  FindingCardDescription,
  FindingCardTitle,
  FindingCardTitleFrame,
  type FindingCardPresentation,
} from '../ui';

type FindingCardSummaryProps = {
  title: string;
  href: string;
  description: string;
  headingLevel: 'h2' | 'h3';
  presentation: FindingCardPresentation;
  titleLeading?: ReactNode;
};

export function FindingCardSummary(props: FindingCardSummaryProps) {
  const title = (
    <FindingCardTitle component={props.headingLevel} presentation={props.presentation}>
      <NavLink href={props.href} underline="none" color="inherit">
        {props.title}
      </NavLink>
    </FindingCardTitle>
  );

  return (
    <>
      <ConditionalContent
        condition={Boolean(props.titleLeading)}
        content={
          <FindingCardTitleFrame leading={props.titleLeading}>{title}</FindingCardTitleFrame>
        }
        fallback={title}
      />
      <FindingCardDescription presentation={props.presentation}>
        {props.description}
      </FindingCardDescription>
    </>
  );
}
