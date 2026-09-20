import { toMessageKey } from '@portfolio/data/config/achados';
import type { FeedSelectDefinition } from './feed-select.types';
import type { SortMode } from './types';
import { buildContentKindSelect } from './build-content-kind-select';
import { buildSortSelect } from './build-sort-select';
import { buildTopicSelect } from './build-topic-select';
import { buildTypeSelect } from './build-type-select';

export type ContentFeedSelectBuilderProps = {
  fixedKind?: string;
  availableKindCount: number;
  kind: string;
  topic: string;
  type: string;
  sort: SortMode;
  writingsCount: number;
  findingsCount: number;
  collectionsCount: number;
  topics: Array<{ name: string; slug?: string }>;
  findingTypes: string[];
  onKindChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (value: SortMode) => void;
  contentLabel: string;
  writingLabel: string;
  findingsLabel: string;
  collectionsLabel: string;
  topicLabel: string;
  typeLabel: string;
  typeMessage: (value: string) => string;
  sortLabel: string;
  newestLabel: string;
  oldestLabel: string;
  alphabeticalLabel: string;
  popularLabel: string;
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
      findingsCount: props.findingsCount,
      collectionsCount: props.collectionsCount,
      label: props.contentLabel,
      onChange: props.onKindChange,
      writingLabel: props.writingLabel,
      findingsLabel: props.findingsLabel,
      collectionsLabel: props.collectionsLabel,
    }),
  (props) =>
    buildTopicSelect({
      topics: props.topics,
      label: props.topicLabel,
      selectedValue: props.topic,
      onChange: props.onTopicChange,
    }),
  (props) =>
    buildTypeSelect({
      types: props.findingTypes,
      fixedKind: props.fixedKind,
      label: props.typeLabel,
      selectedValue: props.type,
      onChange: props.onTypeChange,
      typeLabel: (value) => props.typeMessage(toMessageKey(value)),
    }),
  (props) =>
    buildSortSelect({
      label: props.sortLabel,
      selectedValue: props.sort,
      onChange: props.onSortChange,
      newestLabel: props.newestLabel,
      oldestLabel: props.oldestLabel,
      alphabeticalLabel: props.alphabeticalLabel,
      popularLabel: props.popularLabel,
    }),
];
