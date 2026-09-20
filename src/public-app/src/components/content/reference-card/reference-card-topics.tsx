'use client';

import { Box } from '../../ui';
import { ReferenceTopicChip } from './reference-topic-chip';

type ReferenceCardTopicsProps = { topics: string[] };

export function ReferenceCardTopics(props: ReferenceCardTopicsProps) {
  return (
    <Box visualVariant="referenceCardTopics">
      {props.topics.slice(0, 3).map((topic) => (
        <ReferenceTopicChip key={topic} topic={topic} />
      ))}
    </Box>
  );
}
