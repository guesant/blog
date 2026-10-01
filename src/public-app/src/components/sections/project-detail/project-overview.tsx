'use client';

import { Box, Typography } from '../../ui';
import { hasProjectOverview, type ProjectOverviewProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ProjectCurrentFocusText } from '../../ui/semantic/ProjectCurrentFocusText';
import { ProjectOverviewFactsFrame } from '../../ui/semantic/ProjectOverviewFactsFrame';
import { ProjectOverviewProblemText } from '../../ui/semantic/ProjectOverviewProblemText';

export function ProjectOverview(props: ProjectOverviewProps) {
  const { project, t } = props;

  if (!hasProjectOverview(project)) {
    return null;
  }
  return (
    <ProjectOverviewFactsFrame>
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
            <ProjectCurrentFocusText>{project.currentFocus}</ProjectCurrentFocusText>
          </Box>
        }
      />
    </ProjectOverviewFactsFrame>
  );
}
