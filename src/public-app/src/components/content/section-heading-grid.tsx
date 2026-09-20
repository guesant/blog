import { Box, Typography } from '../ui';
import { Icon } from '../primitives/icon';
import { NavLink } from '../primitives/nav-link';
import type { SectionHeadingProps } from './section-heading.types';
import { ConditionalContent } from '../primitives/conditional-content';

type SectionHeadingGridProps = SectionHeadingProps;

export function SectionHeadingGrid(props: SectionHeadingGridProps) {
  const { title, description, href, linkLabel } = props;

  return (
    <Box visualVariant="sectionHeadingGrid">
      <Typography variant="h2" visualVariant="sectionHeadingGrid">
        {title}
      </Typography>
      <ConditionalContent
        condition={Boolean(href && linkLabel)}
        content={
          <NavLink href={href ?? '/'} underline="none" visualVariant="sectionHeadingGrid">
            {linkLabel} <Icon name="north-east" size={15} />
          </NavLink>
        }
      />
      <ConditionalContent
        condition={Boolean(description)}
        content={
          <Typography color="text.secondary" visualVariant="sectionHeadingGrid2">
            {description}
          </Typography>
        }
      />
    </Box>
  );
}
