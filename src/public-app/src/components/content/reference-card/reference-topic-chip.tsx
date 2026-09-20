'use client';

import { Chip } from '../../ui';

type ReferenceTopicChipProps = { topic: string };

export function ReferenceTopicChip(props: ReferenceTopicChipProps) {
  return <Chip label={props.topic} size="small" variant="outlined" />;
}
