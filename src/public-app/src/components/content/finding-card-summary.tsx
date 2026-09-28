import { NavLink } from '../primitives/nav-link';
import { FindingCardDescription, FindingCardTitle, type FindingCardPresentation } from '../ui';

type FindingCardSummaryProps = {
  title: string;
  href: string;
  description: string;
  headingLevel: 'h2' | 'h3';
  presentation: FindingCardPresentation;
};

export function FindingCardSummary(props: FindingCardSummaryProps) {
  return (
    <>
      <FindingCardTitle component={props.headingLevel} presentation={props.presentation}>
        <NavLink href={props.href} underline="none" color="inherit">
          {props.title}
        </NavLink>
      </FindingCardTitle>
      <FindingCardDescription presentation={props.presentation}>
        {props.description}
      </FindingCardDescription>
    </>
  );
}
