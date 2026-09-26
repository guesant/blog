'use client';

import { Box } from '../../ui';
import { NavLink } from '../../primitives/nav-link';
import type { ProjectRowProps } from './types';
import { ProjectSummary } from '../../content/project-summary';

export function ProjectRow(props: ProjectRowProps) {
  return (
    <Box visualVariant="projectRow">
      <ProjectSummary
        project={props.item}
        headingLevel="h3"
        titleContent={
          <NavLink
            href={props.item.url ?? `/projects/${props.item.slug}`}
            underline="none"
            color="inherit"
          >
            {props.item.name}
          </NavLink>
        }
        titleClassName="project-row-title"
        titleVisualVariant="projectRow"
        technologiesColor="text.secondary"
      />
    </Box>
  );
}
