import type { ReactNode } from 'react';
import { NavLink } from '../primitives/nav-link';
import { FindingCardDescription, FindingCardTitle, type FindingCardPresentation } from '../ui';

type FindingCardSummaryProps = {
  title: string;
  href: string;
  description: string;
  metadata?: ReactNode;
  headingLevel: 'h2' | 'h3';
  presentation: FindingCardPresentation;
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
      {title}
      {props.metadata}
      <FindingCardDescription presentation={props.presentation}>
        {props.description}
      </FindingCardDescription>
    </>
  );
}
