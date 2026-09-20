'use client';

import { Box, Divider, Typography } from '../../ui';
import type { ResumeSectionProps } from './types';

export function ResumeSection(props: ResumeSectionProps) {
  const { title, children } = props;

  return (
    <Box component="section" visualVariant="resumeSection">
      <Typography component="h2" variant="overline" visualVariant="resumeSection">
        {title}
      </Typography>
      <Divider visualVariant="resumeSection" />
      {children}
    </Box>
  );
}
