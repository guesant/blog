import type { FeedEntry } from './types';

type EntryMatchesTopicProps = {
  entry: FeedEntry;
  topic: string;
};

export function entryMatchesTopic(props: EntryMatchesTopicProps): boolean {
  return (
    !props.topic ||
    props.entry.topics.some((item) => item.slug === props.topic || item.name === props.topic)
  );
}
