import type { ReactNode } from 'react';
import { NavLink } from '../primitives/nav-link';
import type { IconName } from '../primitives/icon';
import { FindingCardTitle, FindingCardTitleWithLeadingIcon } from '../ui';

type FindingCardSummaryTitleProps = {
  title: string;
  href: string;
  headingLevel: 'h2' | 'h3';
  titleFontSize?: string;
  leadingIcon?: IconName;
};

export function FindingCardSummaryTitle(props: FindingCardSummaryTitleProps) {
  const titleLink: ReactNode = (
    <NavLink href={props.href} underline="none" color="inherit">
      {props.title}
    </NavLink>
  );

  if (props.leadingIcon) {
    return (
      <FindingCardTitleWithLeadingIcon
        component={props.headingLevel}
        fontSize={props.titleFontSize}
        leadingIcon={props.leadingIcon}
        content={titleLink}
      />
    );
  }

  return (
    <FindingCardTitle
      component={props.headingLevel}
      fontSize={props.titleFontSize}
      content={titleLink}
    />
  );
}
