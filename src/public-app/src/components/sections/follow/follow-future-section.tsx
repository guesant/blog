import type { ReactNode } from 'react';
import { Box, Typography } from '../../ui';

type FollowFutureSectionProps = {
  children: ReactNode;
  label: string;
  title: string;
};

export function FollowFutureSection(props: FollowFutureSectionProps) {
  return (
    <Box visualVariant="pageSectionStart">
      <Typography variant="overline" color="text.secondary">
        {props.label}
      </Typography>
      <Typography component="h2" variant="h2" visualVariant="followFutureTitle">
        {props.title}
      </Typography>
      {props.children}
    </Box>
  );
}
