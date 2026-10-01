'use client';

import { ProjectRowFrame, ProjectSummaryContent } from '../../ui';
import { NavLink } from '../../primitives/nav-link';
import type { ProjectRowProps } from './types';

export function ProjectRow(props: ProjectRowProps) {
  return (
    <ProjectRowFrame>
      <ProjectSummaryContent
        status={props.item.status}
        title={
          <NavLink
            href={props.item.url ?? `/projects/${props.item.slug}`}
            underline="none"
            color="inherit"
          >
            {props.item.name}
          </NavLink>
        }
        headingLevel="h3"
        purpose={props.item.purpose}
        problem={props.item.problem}
        technologies={props.item.technologies.join(' · ')}
      />
    </ProjectRowFrame>
  );
}
