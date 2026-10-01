import type { ReactNode } from 'react';
import { NavLink } from '../primitives/nav-link';
import {
  FindingCardDescription,
  FindingCardTitle,
  FindingCardTitleBlock,
  type FindingCardPresentation,
} from '../ui';

type FindingCardSummaryProps = {
  title: string;
  href: string;
  description: string;
  headingLevel: 'h2' | 'h3';
  presentation: FindingCardPresentation;
  titleSupporting?: ReactNode;
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
      <FindingCardTitleBlock supporting={props.titleSupporting}>{title}</FindingCardTitleBlock>
      <FindingCardDescription presentation={props.presentation}>
        {props.description}
      </FindingCardDescription>
    </>
  );
}
