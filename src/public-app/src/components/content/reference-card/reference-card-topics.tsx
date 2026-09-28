'use client';

import { FindingReferenceTopicsFrame } from '../../ui';
import { TopicChip } from '../topic-chip';

type ReferenceCardTopicsProps = { topics: string[] };

export function ReferenceCardTopics(props: ReferenceCardTopicsProps) {
  return (
    <FindingReferenceTopicsFrame>
      {props.topics.slice(0, 3).map((topic) => (
        <TopicChip key={topic} name={topic} />
      ))}
    </FindingReferenceTopicsFrame>
  );
}
