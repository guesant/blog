'use client';

import { Box, Typography } from '../../ui';
import { hasProjectOverview, type ProjectOverviewProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ProjectOverview2Text } from '../../ui/semantic/ProjectOverview2Text';
import { ProjectOverviewFrame } from '../../ui/semantic/ProjectOverviewFrame';
import { ProjectOverviewProblemText } from '../../ui/semantic/ProjectOverviewProblemText';

export function ProjectOverview(props: ProjectOverviewProps) {
  const { project, t } = props;

  if (!hasProjectOverview(project)) {
    return null;
  }
  return (
    <ProjectOverviewFrame>
      <ConditionalContent
        condition={Boolean(project.problem)}
        content={
          <Box>
            <Typography variant="overline" color="text.secondary">
              {t('problem')}
            </Typography>
            <ProjectOverviewProblemText>{project.problem}</ProjectOverviewProblemText>
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
            <ProjectOverview2Text>{project.currentFocus}</ProjectOverview2Text>
          </Box>
        }
      />
    </ProjectOverviewFrame>
  );
}
