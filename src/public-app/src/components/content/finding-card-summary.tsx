import { NavLink } from '../primitives/nav-link';
import { Typography } from '../ui';

type FindingCardSummaryProps = {
  title: string;
  href: string;
  description: string;
  headingLevel: 'h2' | 'h3';
  titleVariant?: 'h3';
  titleClassName?: string;
  titleVisualVariant?: string;
  descriptionVisualVariant?: string;
};

export function FindingCardSummary(props: FindingCardSummaryProps) {
  return (
    <>
      <Typography
        className={props.titleClassName}
        component={props.headingLevel}
        variant={props.titleVariant}
        visualVariant={props.titleVisualVariant}
      >
        <NavLink href={props.href} underline="none" color="inherit">
          {props.title}
        </NavLink>
      </Typography>
      <Typography color="text.secondary" visualVariant={props.descriptionVisualVariant}>
        {props.description}
      </Typography>
    </>
  );
}
