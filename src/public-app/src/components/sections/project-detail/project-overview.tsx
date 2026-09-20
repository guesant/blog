'use client';

import { Box, Typography } from '../../ui';
import { hasProjectOverview, type ProjectOverviewProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';

export function ProjectOverview(props: ProjectOverviewProps) {
  const { project, t } = props;

  if (!hasProjectOverview(project)) {
    return null;
  }
  return (
    <Box visualVariant="projectOverview">
      <ConditionalContent
        condition={Boolean(project.problem)}
        content={
          <Box>
            <Typography variant="overline" color="text.secondary">
              {t('problem')}
            </Typography>
            <Typography visualVariant="projectOverview">{project.problem}</Typography>
          </Box>
        }
      />
      <ConditionalContent
        condition={Boolean(project.currentFocus)}
        content={
          <Box>
            <Typography variant="overline" color="text.secondary">
              {t('currentFocus')}
            </Typography>
            <Typography visualVariant="projectOverview2">{project.currentFocus}</Typography>
          </Box>
        }
      />
    </Box>
  );
}
