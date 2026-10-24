'use client';

import type { Topic } from '@portfolio/data/domain/types';
import { Box, Typography } from '../../ui';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type TopicoDetailContentProps = {
  topic: Topic;
  pagination: ContentCollectionMeta;
};

export function TopicoDetailContent(props: TopicoDetailContentProps) {
  const { topic } = props;

  return (
    <Box>
      <Typography variant="h1">{topic.name}</Typography>
    </Box>
  );
}
