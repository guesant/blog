'use client';

import { Box, Typography } from '../../ui';

type ProfileSummarySectionProps = {
  title: string;
  text: string;
};

export function ProfileSummarySection(props: ProfileSummarySectionProps) {
  const { title, text } = props;

  return (
    <Box visualVariant="profileSummarySection">
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <Typography color="text.secondary" visualVariant="profileSummarySection">
        {text}
      </Typography>
    </Box>
  );
}
