'use client';

import { Box, Typography } from '../../ui';
import { NavLink } from '../../primitives/nav-link';
import type { ProjectRowProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';

export function ProjectRow(props: ProjectRowProps) {
  const { item: staticItem } = props;

  const item = staticItem;

  return (
    <Box visualVariant="projectRow">
      <Typography variant="overline" color="text.secondary">
        {item.status}
      </Typography>
      <Typography className="project-row-title" component="h3" visualVariant="projectRow">
        <NavLink href={`/projects/${item.slug}`} underline="none" color="inherit">
          {item.name}
        </NavLink>
      </Typography>
      <Typography color="text.secondary">{item.purpose}</Typography>
      <ConditionalContent
        condition={Boolean(item.problem)}
        content={<Typography>{item.problem}</Typography>}
      />
      <Typography color="text.secondary">{item.technologies.join(' · ')}</Typography>
    </Box>
  );
}
