'use client';

import { Chip } from '../../ui';
import { NavLink } from '../../primitives/nav-link';

type FeedTopicChipProps = { topic: { name: string; slug?: string } };

export function FeedTopicChip(props: FeedTopicChipProps) {
  const { topic } = props;

  return (
    <Chip
      component={topic.slug ? NavLink : 'div'}
      href={topic.slug ? `/topics/${topic.slug}` : undefined}
      label={topic.name}
      size="small"
      variant="outlined"
      clickable={Boolean(topic.slug)}
    />
  );
}
