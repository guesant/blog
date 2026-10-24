import type { FeedSelectDefinition } from './feed-select.types';
import { buildContentKindSelect } from './build-content-kind-select';
import { buildTopicSelect } from './build-topic-select';

export type ContentFeedSelectBuilderProps = {
  fixedKind?: string;
  availableKindCount: number;
  kind: string;
  topic: string;
  writingsCount: number;
  collectionsCount: number;
  topics: Array<{ name: string; slug?: string }>;
  onKindChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  contentLabel: string;
  writingLabel: string;
  collectionsLabel: string;
  topicLabel: string;
};

type ContentFeedSelectBuilder = (
  props: ContentFeedSelectBuilderProps,
) => FeedSelectDefinition | undefined;

export const contentFeedSelectBuilders: ContentFeedSelectBuilder[] = [
  (props) =>
    buildContentKindSelect({
      fixedKind: props.fixedKind,
      availableKindCount: props.availableKindCount,
      kind: props.kind,
      writingsCount: props.writingsCount,
      collectionsCount: props.collectionsCount,
      label: props.contentLabel,
      onChange: props.onKindChange,
      writingLabel: props.writingLabel,
      collectionsLabel: props.collectionsLabel,
    }),
  (props) =>
    buildTopicSelect({
      topics: props.topics,
      label: props.topicLabel,
      selectedValue: props.topic,
      onChange: props.onTopicChange,
    }),
];
