import { buildContentFeedSelectDefinitions } from './build-content-feed-select-definitions';
import type { UseContentFeedViewPropsInput } from './use-content-feed-view-props.types';

type ContentFeedSelectInput = Parameters<typeof buildContentFeedSelectDefinitions>[0];

export function buildContentFeedSelectInput(
  input: UseContentFeedViewPropsInput,
): ContentFeedSelectInput {
  const { props, runtime } = input;

  const { data, state, translations } = runtime;

  return {
    fixedKind: props.fixedKind,
    availableKindCount: data.availableKindCount,
    kind: state.kind,
    topic: state.topic,
    type: state.type,
    sort: state.sort,
    writingsCount: props.writings.length,
    findingsCount: props.findings.length,
    collectionsCount: props.collections.length,
    topics: data.topics,
    findingTypes: data.findingTypes,
    onKindChange: state.setKind,
    onTopicChange: state.setTopic,
    onTypeChange: state.setType,
    onSortChange: state.setSort,
    contentLabel: translations.contentLabel,
    writingLabel: translations.writingLabel,
    findingsLabel: translations.findingsLabel,
    collectionsLabel: translations.collectionsLabel,
    topicLabel: translations.topicLabel,
    typeLabel: translations.typeLabel,
    typeMessage: (value) => translations.tPages(`types.${value}`),
    sortLabel: translations.sortLabel,
    newestLabel: translations.newestLabel,
    oldestLabel: translations.oldestLabel,
    alphabeticalLabel: translations.alphabeticalLabel,
    popularLabel: translations.popularLabel,
  };
}
