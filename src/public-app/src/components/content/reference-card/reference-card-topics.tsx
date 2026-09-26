'use client';

import { Box } from '../../ui';
import { TopicChip } from '../topic-chip';

type ReferenceCardTopicsProps = { topics: string[] };

export function ReferenceCardTopics(props: ReferenceCardTopicsProps) {
  return (
    <Box visualVariant="referenceCardTopics">
      {props.topics.slice(0, 3).map((topic) => (
        <TopicChip key={topic} name={topic} />
      ))}
    </Box>
  );
}
