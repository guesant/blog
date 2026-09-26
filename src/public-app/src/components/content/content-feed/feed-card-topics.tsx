import { TopicChip } from '../topic-chip';
import type { FeedCardProps } from './feed-card-types';

type FeedCardTopicsProps = {
  topics: FeedCardProps['entry']['topics'];
};

export function FeedCardTopics(props: FeedCardTopicsProps) {
  return (
    <>
      {props.topics.map((topic) => (
        <TopicChip
          key={`${topic.slug ?? topic.name}-${topic.name}`}
          name={topic.name}
          slug={topic.slug}
          url={topic.url}
        />
      ))}
    </>
  );
}
